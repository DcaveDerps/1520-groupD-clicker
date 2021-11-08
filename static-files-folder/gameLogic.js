//import './ajaxRequests.js';

//console.log("gameLogic.js loaded");

// finish this so clicking the button doesn't take like 5 server requests
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

    this.currentPrice = function (num_owned){
        return Math.floor(this.base_price + (this.base_price * ((num_owned ** 2) / 8)));
    }

}

const FACTORY_ASSEMBLYLINE = new Factory("Assembly Line", 11, 100, 1, 1);

const FACTORIES = [null, FACTORY_ASSEMBLYLINE, null, null, null];

function getFactories(){
    return FACTORIES;
}

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

function updateAccountFromJson(userJson){

    let request = new XMLHttpRequest();
    if (!(request)) { alert("Browser doesn't support AJAX."); }

    request.onreadystatechange = function() {
        if(request.readyState == 4) {
            try {
                let response = JSON.parse(request.responseText);
                // console.log(userJson.uname + " | " + userJson.collectibles);
                // return userJson;
                if(response.success){
                    //console.log("updated user successfully");
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

    request.open("POST", "/updateAccountFromJson", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(params);
    
}

function updateCollectibleCounter(userJson){
    // update the collectible counter
    document.getElementById("total").textContent = userJson.collectibles;
}

function updateUI(userJson){

    // update the collectible counter
    document.getElementById("total").textContent = userJson.collectibles;

    // TO DO update cps when it's on the page

    // update the purchase buttons with the new prices
    document.getElementById("assemblyLineBuyButton").value = "Assembly Line - " + FACTORY_ASSEMBLYLINE.currentPrice(userJson.factories[FACTORY_ASSEMBLYLINE.ID]) + "c";
    document.getElementById("assemblyLineBuyButton").textContent = "Assembly Line - " + FACTORY_ASSEMBLYLINE.currentPrice(userJson.factories[FACTORY_ASSEMBLYLINE.ID]) + "c";

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