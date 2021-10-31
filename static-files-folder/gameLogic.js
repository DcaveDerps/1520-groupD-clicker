//import './ajaxRequests.js';

console.log("gameLogic.js loaded");

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

const FACTORIES = [null, FACTORY_ASSEMBLYLINE];

function buyFactory(username, buildingId){

    console.log("in buyFactory()");

    //let user = getUserJson(username);

    sendJsonRequest( { 'uname':username }, '/getAccountJson', function(user, targetUrl, params){

        let factory = FACTORIES[buildingId];

        console.log("user received from server: ");
        console.log(user);

        user = cleanAccountJson(user);

        // convert the list string into a usable array
        //user.factories = factories.split(',');

        let cur_price = factory.currentPrice(user.factories[factory.ID]);
        console.log("current price is: " + cur_price);
        if(user.collectibles >= cur_price){
            user.collectibles -= cur_price;
            user.cps = user.cps + factory.cps_boost;
            user.factories[factory.ID] = user.factories[factory.ID] + 1;
            console.log("Bought a factory: " + factory.name);
            // save changes in the datastore
            updateAccountFromJson(user);
            // update the UI
            updateUI(user);
        }
        else{
            console.log("Can't afford the factory!");
        }

    });   

}

function getUserJson(username){
    
    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(result, targetUrl, params) {
        console.log("result from getUserJson (before cleaning): ");
        console.log(result);

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

}