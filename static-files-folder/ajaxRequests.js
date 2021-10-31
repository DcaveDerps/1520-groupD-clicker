// code taken from step13 script001.js from tjames
function createXmlHttp() {
    let xmlhttp = new XMLHttpRequest();
    if (!(xmlhttp)) {
        alert("Your browser does not support AJAX!");
    }
    return xmlhttp;
}

// this function converts a simple key-value object to a parameter string.
function objectToParameters(obj) {
    let text = '';
    for (let i in obj) {
        // encodeURIComponent is a built-in function that escapes to URL-safe values
        text += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&';
    }
    return text;
}

function postParameters(xmlHttp, target, parameters) {
    if (xmlHttp) {
        xmlHttp.open("POST", target, true); // XMLHttpRequest.open(method, url, async)
        let contentType = "application/x-www-form-urlencoded";
        xmlHttp.setRequestHeader("Content-type", contentType);
        xmlHttp.send(parameters);
    }
}

function sendJsonRequest(parameterObject, targetUrl, callbackFunction) {
    let xmlHttp = createXmlHttp();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            //console.log(xmlHttp.responseText);
            let myObject = JSON.parse(xmlHttp.responseText);
            callbackFunction(myObject, targetUrl, parameterObject);
        }
    }
    //console.log(targetUrl);
    //console.log(parameterObject);
    postParameters(xmlHttp, targetUrl, objectToParameters(parameterObject));
}

function cleanAccountJson(accJson){
    // convert all of the numbers back into integers from strings
    accJson.collectibles = parseInt(accJson.collectibles);
    accJson.cps = parseInt(accJson.cps);

    accJson.factories = accJson.factories.split(',');

    for(let i = 0; i < accJson.factories.length; i++){
        accJson.factories[i] = parseInt(accJson.factories[i]);
    }

    return accJson;

}