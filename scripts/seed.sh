
# Firm Acme
    echo "Creating participant Firm Acme"
    composer participant add -c adminbusiness@altinn-network -d '{"$class":"org.acme.biznet.Firm","orgnr":"123456789","firmName":"Acme"}'
    #sleep 5

    echo "Issue id Firm Acme"
    composer identity issue -c adminbusiness@altinn-network -u "Acme" -a "org.acme.biznet.Firm#123456789"
    #sleep 5

    echo "Imprting card"
    composer card import --file Acme@altinn-network.card
    #sleep

# StockOwner Frank
    echo "Creating participant StockOwner Frank"
    composer participant add -c adminbusiness@altinn-network -d '{"$class":"org.acme.biznet.StockOwner","socialSecurityNr":"1234","name":"Frank"}'
    #sleep 5

    echo "Issue id StockOwner Frank"
    composer identity issue -c adminbusiness@altinn-network -u "Frank" -a "org.acme.biznet.StockOwner#1234"
    #sleep 5

    echo "Imprting card"
    composer card import --file Frank@altinn-network.card
    #sleep


# StockOwner Eva
    echo "Creating participant StockOwner Eva"
    composer participant add -c adminbusiness@altinn-network -d '{"$class":"org.acme.biznet.StockOwner","socialSecurityNr":"4321","name":"Eva"}'
    #sleep 5

    echo "Issue id StockOwner Eva"
    composer identity issue -c adminbusiness@altinn-network -u "Eva" -a "org.acme.biznet.StockOwner#4321"
    #sleep 5

    echo "Imprting card"
    composer card import --file Eva@altinn-network.card
    #sleep

# Brønnøysund
    echo "Creating participant BrSund"
    composer participant add -c admin@altinn-network -d '{"$class":"org.acme.biznet.BRREG","id":"0327"}'
    #sleep 5

    echo "Issue id BrSund"
    composer identity issue -c admin@altinn-network -u "Bronnoysund" -a "org.acme.biznet.BRREG#0327"
    #sleep 5

    echo "Imprting card"
    composer card import --file Bronnoysund@altinn-network.card
    #sleep


# Journalist
    echo "Creating participant Journalist"
    composer participant add -c admin@altinn-network -d '{"$class":"org.acme.biznet.Journalist","socialSecurityNr":"2533"}'
    #sleep 5

    echo "Issue id Journalist"
    composer identity issue -c admin@altinn-network -u "Journalist" -a "org.acme.biznet.Journalist#2533"
    #sleep 5

    echo "Imprting card"
    composer card import --file Journalist@altinn-network.card
    #sleep

# Offentlig"
    echo "Creating participant Offentlig"
    composer participant add -c admin@altinn-network -d '{"$class":"org.acme.biznet.Offentlig","id":"3009"}'
    #sleep 5

    echo "Issue id Offentlig"
    composer identity issue -c admin@altinn-network -u "Offentlig" -a "org.acme.biznet.Offentlig#3009"
    #sleep 5

    echo "Imprting card"
    composer card import --file Offentlig@altinn-network.card
    #sleep

composer card list
