
function removeImgMarketplace(username, url){
    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(result, targetUrl, params) {
        cleanAccountJson(result);
        result.saved_imgs = result.saved_imgs.replace(url,"");
        result.saved_imgs = result.saved_imgs.replace(",,",",");
        if(result.saved_imgs.substring(0,1)==","){
            result.saved_imgs = result.saved_imgs.substring(1);
        }
        len = result.saved_imgs.length;
        if(result.saved_imgs.substring(len-1,len)==","){
            result.saved_imgs = result.saved_imgs.substring(0,len-1);
        }
        document.getElementById(url).name = 'Unclaimed';
        document.getElementById(url).src = '/s/unsaved.png';
        updateAccountFromJson(result);
    });
}

function claimImg(username, url){
    sendJsonRequest({ 'uname': username }, '/getAccountJson', function(result, targetUrl, params) {
        cleanAccountJson(result);
        if(result.saved_imgs === null||result.saved_imgs.length==0){
            result.saved_imgs= url;
        }else{
            result.saved_imgs+= "," + url;
        }        
        document.getElementById(url).name = 'Claimed';
        document.getElementById(url).src = '/s/saved.png';
        updateAccountFromJson(result);
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
