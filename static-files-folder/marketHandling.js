function iconHover(url){          
    if(document.getElementById(url).name == 'Claimed'){
        document.getElementById(url).src = '/s/unsaved_hover.png';
        document.getElementById("tool " + url).innerHTML = 'Unclaim Image';
        document.getElementById("tool " + url).style.visibility = 'visible';
    }else if(document.getElementById(url).name == 'Unclaimed'){
        document.getElementById(url).src = '/s/unsaved_hover.png';
        document.getElementById("tool " + url).innerHTML = 'Claim Image';
        document.getElementById("tool " + url).style.visibility = 'visible';
    }else if(document.getElementById(url).name == 'Share'){
        document.getElementById(url).src = '/s/share_hover.png';
        document.getElementById("tool " + url.substring(6)).innerHTML = 'Copy Image Link';
        document.getElementById("tool " + url.substring(6)).style.visibility = 'visible';
    }
    
}

function clearIconHover(url){
    if(document.getElementById(url).name == 'Claimed'){
        document.getElementById("tool " + url).style.visibility = 'hidden';
        document.getElementById(url).src = '/s/saved.png';
    }else if(document.getElementById(url).name == 'Unclaimed'){
        document.getElementById("tool " + url).style.visibility = 'hidden';
        document.getElementById(url).src = '/s/unsaved.png';
    }else if((document.getElementById(url).name == 'Share')){
        document.getElementById("tool " + url.substring(6)).style.visibility = 'hidden';
        document.getElementById(url).src = '/s/share.png';
    }
}

function copyLink(url){
    let newUrl = url.substring(6);
    navigator.clipboard.writeText(newUrl);
    document.getElementById("tool " + newUrl).innerHTML = 'Copied Image Link';
    document.getElementById("tool " + newUrl).style.visibility = 'visible';
}            

function addOrRemove(target){
    if(event.target.name=='Claimed'){
        remove(event.target.id);
    }else{
        add(event.target.id);
    }
}

function getHiddenClaim(url){
    //<img src = "/s/saved.png" class='icon' style = "visibility: hidden">
    new_copy = document.createElement("img");
    new_copy.classList.add("icon");
    new_copy.style.visibility = "hidden";
    return new_copy;
}

function getClaimedIcon(url){
    //<img src = "/s/unsaved.png" class='icon' onmouseover = "iconHover(this.id)" 
    //onmouseout="clearIconHover(this.id)" name = "Unclaimed" id = "{ {i['url']}}" 
    //onclick = "addOrRemove(this.id)">
            
    new_copy = document.createElement("img");
    new_copy.id = url;
    new_copy.src = "/s/saved.png";
    new_copy.classList.add("icon");
    new_copy.name = "Claimed";
    new_copy.onmouseover = function(){iconHover(this.id)};
    new_copy.onmouseout = function(){clearIconHover(this.id)};
    new_copy.onclick = function(){addOrRemove(this.id)};
    return new_copy;
}

function getUnclaimedIcon(url){
    //<img src = "/s/unsaved.png" class='icon' onmouseover = "iconHover(this.id)" 
    //onmouseout="clearIconHover(this.id)" name = "Unclaimed" id = "{ {i['url']}}" 
    //onclick = "addOrRemove(this.id)">
    
    new_copy = document.createElement("img");
    new_copy.id = url;
    new_copy.src = "/s/unsaved.png";
    new_copy.classList.add("icon");
    new_copy.name = "Unclaimed";
    new_copy.onmouseover = function(){iconHover(this.id)};
    new_copy.onmouseout = function(){clearIconHover(this.id)};
    new_copy.onclick = function(){addOrRemove(this.id)};
    return new_copy;
}

function getShareIcon(url){
    //<img src = "/s/share.png" class='icon' name = "Share" id ="share template" 
    //onmouseover = "iconHover(this.id)" onmouseout="clearIconHover(this.id)" onclick ="copyLink(this.id)">
    new_copy = document.createElement("img");
    new_copy.id = "share "+url;
    new_copy.src = "/s/share.png";
    new_copy.classList.add("icon");
    new_copy.name = "Share";
    new_copy.onmouseover = function(){iconHover(this.id)};
    new_copy.onmouseout = function(){clearIconHover(this.id)};
    new_copy.onclick = function(){copyLink(this.id)};
    return new_copy;
}

function getXImages(low,high){
    sendJsonRequest({ 'low': low,'high':high}, '/getXImages', function(result, targetUrl, params) {
        getXImagesCallback(result);
        return result;
    });
}

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
