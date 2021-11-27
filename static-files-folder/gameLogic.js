//import './ajaxRequests.js';

//console.log("gameLogic.js loaded");

// finish this so clicking the button doesn't take like 5 server requests
// deprecated
function incCollectibles(username){

    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(result, targetUrl, params) {
        //console.log("result from getUserJson (before cleaning): ");
        //console.log(result);

        cleanAccountJson(result)

        result.collectibles += 1;
        updateCollectibleCounter(result);
        updateAccountFromJson(result);

        return result.collectibles;
    });

}

function Factory(name, cps_boost, base_price, scale_factor, ID) {

    this.name = name;
    this.cps_boost = cps_boost;
    this.base_price = base_price;
    this.scale_factor = scale_factor;
    this.ID = ID;

    // current price scales the price of the factory to ensure it gets gradually more expensive as the player buys more of them
    this.currentPrice = function (num_owned){
        return Math.floor(this.base_price + (this.base_price * ((num_owned ** 2) / 8)));
    }

}

const FACTORY_SOMETHINGTREE = new Factory("Something Tree", 1, 25, 1, 0);
const FACTORY_3DPRINTER = new Factory("3D Printer", 10, 500, 1, 1);
const FACTORY_ASSEMBLYLINE = new Factory("Assembly Line", 80, 8000, 1, 2);
//const FACTORY_


const FACTORIES = [FACTORY_SOMETHINGTREE, FACTORY_3DPRINTER, FACTORY_ASSEMBLYLINE, null, null, null];

function getFactories(){
    return FACTORIES;
}

// deprecated, see buyFactoryLocal in game.html
function buyFactory(username, buildingId){

    //console.log("in buyFactory()");

    //let user = getUserJson(username);

    sendJsonRequest( { 'uname':username }, '/getAccountJson', function(user, targetUrl, params){

        let factory = FACTORIES[buildingId];

        //console.log("user received from server: ");
        //console.log(user);

        user = cleanAccountJson(user);

        let cur_price = factory.currentPrice(user.factories[factory.ID]);
        //console.log("current price is: " + cur_price);
        if(user.collectibles >= cur_price){
            //user.collectibles -= cur_price;
            //user.cps = user.cps + factory.cps_boost;
            //user.factories[factory.ID] = user.factories[factory.ID] + 1;
            //console.log("Bought a factory: " + factory.name);
            // save changes in the datastore
            updateAccountFromJson(user);
            // update the UI
            updateUI(user);
        }
        else{
            //console.log("Can't afford the factory!");
            return false;
        }

    });   

    return true;

}

function getAccountJson(username){
    
    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(result, targetUrl, params) {
        //console.log("result from getUserJson (before cleaning): ");
        //console.log(result);

        return cleanAccountJson(result);
    });

}

// possibly deprecated, see saveAndUpdateLocal in game.html for an alternative
// still works, but it's too slow for updating when a user switches pages
function updateAccountFromJson(userJson){

    console.log("in updateAccountFromJson");

    cleanAccountJson(userJson);

    console.log(userJson);
    
    let request = new XMLHttpRequest();
    if (!(request)) { alert("Browser doesn't support AJAX."); }

    request.onreadystatechange = function() {
        if(request.readyState == 4) {
            try {
                let response = JSON.parse(request.responseText);
                // console.log(userJson.uname + " | " + userJson.collectibles);
                // return userJson;
                if(response.success){
                    console.log("updated user successfully");
                }

                // update the local copy in the HTML to update stuff on the UI

            }
            catch (exc) {
                console.log("Error in updateAccountFromJson(), couldn't update account json");
            }
        }
    }

    // assemble params (data from the userJson)
    let params = "";
    for (let i in userJson){
        params += encodeURIComponent(i) + '=' +encodeURIComponent(userJson[i]) + '&';
    }
    alert(params)
    console.log("about to create the post request in gameLogic.js")
    request.open("POST", "/updateAccountFromJson", false);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(params);
    console.log("sent the params");
    
}

function updateCollectibleCounter(userJson){
    // update the collectible counter
    document.getElementById("total").textContent = userJson.collectibles;
}

function updateUI(userJson){

    // update the collectible counter
    document.getElementById("total").textContent = userJson.collectibles.toLocaleString();

    // update cps
    document.getElementById("cpsVal").textContent = userJson.cps.toLocaleString();

    // update the purchase buttons with the new prices
    document.getElementById("somethingTreeBuyButton").value = "Something Tree - " + FACTORY_SOMETHINGTREE.currentPrice(userJson.factories[FACTORY_SOMETHINGTREE.ID]).toLocaleString() + "c";
    document.getElementById("somethingTreeBuyButton").textContent = "Something Tree - " + FACTORY_SOMETHINGTREE.currentPrice(userJson.factories[FACTORY_SOMETHINGTREE.ID]).toLocaleString() + "c";
    
    document.getElementById("3DPrinterBuyButton").value = "3D Printer - " + FACTORY_3DPRINTER.currentPrice(userJson.factories[FACTORY_3DPRINTER.ID]).toLocaleString() + "c";
    document.getElementById("3DPrinterBuyButton").textContent = "3D Printer - " + FACTORY_3DPRINTER.currentPrice(userJson.factories[FACTORY_3DPRINTER.ID]).toLocaleString() + "c";

    document.getElementById("assemblyLineBuyButton").value = "Assembly Line - " + FACTORY_ASSEMBLYLINE.currentPrice(userJson.factories[FACTORY_ASSEMBLYLINE.ID]).toLocaleString() + "c";
    document.getElementById("assemblyLineBuyButton").textContent = "Assembly Line - " + FACTORY_ASSEMBLYLINE.currentPrice(userJson.factories[FACTORY_ASSEMBLYLINE.ID]).toLocaleString() + "c";

}

function updateUIOnLoad(username){
    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(result, targetUrl, params) {
        //console.log("result from getUserJson (before cleaning): ");
        //console.log(result);

        updateUI(cleanAccountJson(result));
    });
}

function addCPS(username){
    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(acc, targetUrl, params) {
        //console.log("result from getUserJson (before cleaning) in addCPS: ");
        //console.log(acc);

        cleanAccountJson(acc);

        let total = 0;

        for(let i = 0; i < acc.factories.length; i++){
            if(acc.factories[i] > 0){
                total += FACTORIES[i].cps_boost * acc.factories[i];
            }
        }

        //console.log("planning to add " + total + " collectibles this second");

        acc.collectibles += total;

        updateAccountFromJson(acc);
        updateUI(acc);

    });
}