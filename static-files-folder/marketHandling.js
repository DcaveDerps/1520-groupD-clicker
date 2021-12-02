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
    }else if(document.getElementById(url).name == 'Global'){
        document.getElementById(url).src = '/s/MyImages_hover.png';
        document.getElementById("mode-info").innerHTML = 'View Claimed Images Only';
        document.getElementById("mode-info").style.visibility = 'visible';
    }else if(document.getElementById(url).name == 'MyImages'){
        document.getElementById(url).src = '/s/Global_hover.png';
        document.getElementById("mode-info").innerHTML = 'View Global Images';
        document.getElementById("mode-info").style.visibility = 'visible';
    }else if(url=="clearsearch"){
        document.getElementById(url).style.color="#f52020";   
        document.getElementById(url).style.fontWeight = "900";      
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
    }else if(document.getElementById(url).name == 'Global'){
        document.getElementById(url).src = '/s/Global.png';
        document.getElementById("mode-info").style.visibility = 'hidden';
    }else if(document.getElementById(url).name == 'MyImages'){
        document.getElementById(url).src = '/s/MyImages.png';
        document.getElementById("mode-info").style.visibility = 'hidden';
    }else if(url=="clearsearch"){
        document.getElementById(url).style.color="initial";   
        document.getElementById(url).style.fontWeight = "initial";      
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

function getXImages(low,high,search, claimSearch){
    if(search && claimSearch){
        sendJsonRequest({ 'low': low,'high':high,'search':search,'selections':claimSearch}, '/searchClaimedImages', function(result, targetUrl, params) {
            getXImagesCallback(result);
            return result;
        });
    }else if(search){
        sendJsonRequest({ 'low': low,'high':high,'search':search}, '/searchXImages', function(result, targetUrl, params) {
            getXImagesCallback(result);
            return result;
        });
    }else if(claimSearch){
        sendJsonRequest({ 'low': low,'high':high,'search':claimSearch}, '/claimedImages', function(result, targetUrl, params) {
            getXImagesCallback(result);
            return result;
        });
    }else{
        sendJsonRequest({ 'low': low,'high':high}, '/getXImages', function(result, targetUrl, params) {
            getXImagesCallback(result);
            return result;
        });
    }
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
        if(lookingClaimed||claimMode){
            document.getElementById("div " + url).style.display='none';
        }
        updateAccountFromJson(result);
        updateClaimedImages(result.saved_imgs);
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
        updateClaimedImages(result.saved_imgs);
    });
}

function getClaimedImages(){
    endGeneration = false;
    lookingClaimed = true;         
    if(!isSearching){ 
        isSearching = true;
        document.getElementById("imagedisplay").innerHTML="Your Claimed Images";
        
        let img_space = document.getElementById("images");
        let cNodes = img_space.children;
        for(let i =cNodes.length-1;i>0;i--){
            cNodes[i].remove();
            low-=1;
        }

        let high = low + searchLen;

        getXImages(low,high,userObj.saved_imgs);                
    }

}

function updateSearch(){
    endGeneration = false;
    lookingClaimed = false;            
        isSearching = true;
        search = document.getElementById("search-bar").value;
        document.getElementById("search-bar").value = "";
        document.getElementById("search-bar").blur();
        if(search==""){
            if(claimMode){
                document.getElementById("imagedisplay").innerHTML="Your Claimed Images";
            }else{
                document.getElementById("imagedisplay").innerHTML="All Images";
            }
        }else{
            if(claimMode){
                document.getElementById("imagedisplay").innerHTML="Claimed Search Results For: \"" + search + "\"";
            }else{
                document.getElementById("imagedisplay").innerHTML="Global Search Results For: \"" + search + "\"";
            }
        }
        let img_space = document.getElementById("images");
        let cNodes = img_space.children;
        for(let i =cNodes.length-1;i>0;i--){
            cNodes[i].remove();
            low-=1;
        }

        let high = low + searchLen;
        if(claimMode){
            getXImages(low,high,search,userObj.saved_imgs);  
        }else{
            getXImages(low,high,search);  
        }              
}

function switchMode(url){
    //alert("isSearching = " + isSearching + " endGeneration = " +endGeneration + " lookingClaimed = " +lookingClaimed + " claimMode = " +claimMode + " endGeneration = " + endGeneration);
    lookingClaimed = false;
    isSearching = false;
    if(claimMode){//is in local mode
        claimMode = false;
        document.getElementById(url).name = 'Global';
        document.getElementById(url).src = '/s/Global.png';
        document.getElementById('inputElement').innerHTML = 'Search Global Images:&nbsp;';
        document.getElementById("mode-info").innerHTML = 'View Claimed Images Only';
        updateSearch("");
    }else{
        claimMode = true;
        document.getElementById(url).name = 'MyImages';
        document.getElementById(url).src = '/s/MyImages.png';
        document.getElementById('inputElement').innerHTML = 'Search Your Claimed Images:&nbsp;';
        document.getElementById("mode-info").innerHTML = 'View Global Images';

        let img_space = document.getElementById("images");
        let cNodes = img_space.children;
        for(let i =cNodes.length-1;i>0;i--){
            cNodes[i].remove();
            low-=1;
        }

        getClaimedImages();
    }
}

function getClaimedImages(){
    endGeneration = false;
    lookingClaimed = true;          
    if(!isSearching){ 
        isSearching = true;

        let img_space = document.getElementById("images");
        let cNodes = img_space.children;
        for(let i =cNodes.length-1;i>0;i--){
            cNodes[i].remove();
            low-=1;
        }

        if(userObj.saved_imgs==""){
            document.getElementById("imagedisplay").innerHTML="No Images Found";
            endGeneration = true;
            isSearching = false;
            return;
        }
        document.getElementById("imagedisplay").innerHTML="Your Claimed Images";

        let high = low + searchLen;

        getXImages(low,high,null,userObj.saved_imgs);                
    }
}

function grabNextXClaimedSearch(x,search){
    if(!isSearching&&!endGeneration){                
        isSearching = true;
        let high = low + x;

        getXImages(low,high,search,userObj.saved_imgs);                
    }
}

function grabNextXClaimed(x){
    if(!isSearching&&!endGeneration){                
        isSearching = true;
        let high = low + x;

        getXImages(low,high,null,userObj.saved_imgs);                
    }
}

function grabNextXSearch(x,search){
    if(!isSearching&&!endGeneration){                
        isSearching = true;
        let high = low + x;

        getXImages(low,high,search);                
    }
}


function grabNextX(x){
    if(!isSearching&&!endGeneration){                
        isSearching = true;
        let high = low + x;

        getXImages(low,high);                
    }
}

function updateAccountFromJson(rslt){
    //updateAccountFromJson(userObj); < deprecated
    // convert the JSON into a string, sendBeacon doesn't take JSON objects
    let userStr = JSON.stringify(rslt);
    // sendBeacon makes a POST request, but tells the browser to make it whenever it can
    // Allows the POST request to be sent even if the page that requested it isn't loaded
    alert(userStr)
    navigator.sendBeacon("/updateAccountFromJson", userStr);
}