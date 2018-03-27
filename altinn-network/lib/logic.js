/**
 * Transaction of buy/sales between oweners of a Stock
 * @param {org.acme.biznet.SaleOfStock} saleOfStock - the Stock to be processed
 * @transaction
 */

function sellStock(sellstock){
  
    var queryOrgnr = 'resource:org.acme.biznet.RegisterOfShareholders#' + sellstock.registerOfShareholders
    var queryOldOwner = 'resource:org.acme.biznet.StockOwner#' + sellstock.oldOwner
   	
   	return getAssetRegistry('org.acme.biznet.Stock')
   			.then(function(assetRegistry){
      			return query('getFirstStocks', {firm : queryOrgnr, ownerIn : queryOldOwner})
                       .then(function(results){
                  	if (results.length < sellstock.quantity) {
                      	throw new Error('Du vil ha ' + sellstock.quantity + ' aksjer. Personen du prøver å kjøpe av har kun: ' + results.length);
                    }
                  	for(var n = 0; n < sellstock.quantity; n++){
                      	results[n].marketValue = sellstock.bid;
                      	results[n].owner = sellstock.newOwner;
                      	results[n].purchasedDate = sellstock.timestamp;
                    }
                  	return assetRegistry.updateAll(results);
                })
    });
}

/**
 * Transaction for increasing / decreasing value of Stock belongin to company
 * @param {org.acme.biznet.ExpandCapital} expandcapital - the Stock to be processed
 * @transaction
 */

function expandCapital(expandcapital){

    expandcapital.registerOfShareholders.capital = expandcapital.verdi

    nyAksjeVerdi = expandcapital.verdi / expandcapital.registerOfShareholders.numberOfShares
    
    var queryString = 'resource:org.acme.biznet.RegisterOfShareholders#' + expandcapital.registerOfShareholders.orgnr
    
   	getAssetRegistry('org.acme.biznet.RegisterOfShareholders')
       	.then(function(assetRegistry){
            assetRegistry.update(expandcapital.RegisterOfShareholders)
        });
   	
   	return getAssetRegistry('org.acme.biznet.Stock')
        .then(function(assetRegistry){
            return query('selectAllStocks', {orgnr : queryString})
                    .then(function(results){
                        for(var n = 0; n < results.length; n++){
                            results[n].value = nyAksjeVerdi;
                        }
                        return assetRegistry.updateAll(results);
            })
    });
 }

 /**
* Transaction for changing value of given stocks
* @param {org.acme.biznet.ChangeStockValue} changestockvalue - RegisterOfShareholders whos stocks is changing value
* @transaction
*/

function changeStockValue(changestockvalue){
  
    var queryString = 'resource:org.acme.biznet.RegisterOfShareholders#' + changestockvalue.registerOfShareholders
    
    return getAssetRegistry('org.acme.biznet.Stock')
        .then(function(assetRegistry){
            return query('selectAllStocks', {orgnr : queryString})
                .then(function(results){
                    for(var n = 0; n < results.length; n++){
                    results[n].value = changestockvalue.newValue;
                    }
                    return assetRegistry.updateAll(results);
                })
        });
}

/**
* Transaction for changing value of given stocks
* @param {org.acme.biznet.CreateStockBook} createstockbook - creating a new stockbook for firm
* @transaction
*/
function createStockBook(createstockbook){
	
    var distributedStocks = 0;
    for(var i = 0; i < createstockbook.distribution.length; i++){
    distributedStocks += createstockbook.distribution[i]
  }

    if (distributedStocks != createstockbook.numberOfStock) {
      throw new Error('Du har enten delt ut for mange eller for få aksjer i forhold til hva du ønsker å opprette!');
  }

    if(createstockbook.distribution.length != createstockbook.ownsNewStock.length){
    throw new Error('Du har delt ut aksjer til for få eller for mange nye eiere i forhold til hvor mange personer du har skrevet inn som eier av nye aksjer!');
  }

  var paalydende = createstockbook.capital / createstockbook.numberOfStock
  var factory = getFactory()
  var stockbook = factory.newResource('org.acme.biznet', 'RegisterOfShareholders', createstockbook.firm.orgnr)
  
 getAssetRegistry('org.acme.biznet.RegisterOfShareholders')
    .then(function(assetRegistry){
        stockbook.numberOfShares = createstockbook.numberOfStock
        stockbook.capital = createstockbook.capital
        stockbook.firstDenomination = paalydende
        stockbook.belongsTo = createstockbook.firm
        assetRegistry.add(stockbook)
 })

 return getAssetRegistry('org.acme.biznet.Stock')
                    .then(function(aksjeRegistry){
                       return query('selectHighestStockId')
                           .then(function(result){
                                var id;
                         
                                if(result.length > 0 && result != null && result.length != null){
                                    id = parseInt(result[0].id) + 1;
                                }else{
                                    id = 1;
                                }
                                 
                                id = parseInt(id);
                         
                                var factory = getFactory()
                                for(var n = 0; n < createstockbook.ownsNewStock.length; n++){
                                    
                                    for(var i = 0; i < createstockbook.distribution[n]; i++){
                                        var stockId = id.toString();
                                        var stock = factory.newResource('org.acme.biznet', 'Stock', stockId)
                              
                                        stock.value = paalydende
                                        stock.denomination = paalydende
                                        stock.marketValue = paalydende
                                        stock.registerOfShareholders = stockbook
                                        stock.type = "";
                                        stock.purchasedDate = createstockbook.timestamp
                                        stock.owner = createstockbook.ownsNewStock[n]
                                        aksjeRegistry.add(stock)
                                        id += 1
                                    }
                                }
                      
                    })
    })
                  

  
}

/** 
* Increasing the amount of aksjer in aksjebok and distributes among shareholders.
* @param {org.acme.biznet.AddStocks} addstocks - registerOfShareholders creates stock.
* @transaction
*/
function addStocks(addstocks) {
    var factory = getFactory();
    var uniqueOwners = [];
    var initialPrice;
    var price;
    var id;
    var queryStringStock = 'resource:org.acme.biznet.RegisterOfShareholders#' + addstocks.registerOfShareholders.orgnr

    // Get the asset registry for the asset.
    return getAssetRegistry('org.acme.biznet.Stock')
    .then(function(assetRegistry) {

        return query('selectAllStocks', {orgnr : queryStringStock})
        .then(function(stock) {

            initialPrice = stock[0].denomination;
            price = stock[0].value;

            for (var n = 0; n < stock.length; n++) {
                if (uniqueOwners.indexOf(stock[n].owner) == -1) {
                    uniqueOwners.push(stock[n].owner);
                }
        }
            return query('selectHighestStockId').then(function(highestId) {
                id = highestId;
                throw new Error('nå er du i sistefase');
                for (n = 0; n < dividedStock; n++) {
                    id += 1;

                    var stock = factory.newResource('org.acme.biznet', 'Stock', id)

                    stock.value = price
                    stock.denomination = initialPrice
                    stock.RegisterOfShareholders = registerOfShareholders.orgnr
                    stock.type = ""
                    stock.owner = uniqueOwners[n]

                    assetRegistry.add(stock);
                }                                
            })
        })
    })
}