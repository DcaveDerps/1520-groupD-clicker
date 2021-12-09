function checkFriend(){
    username = document.getElementById('username').value;
    document.getElementById('username').value='';
    if(userObj.uname==username){
        document.getElementById('friend-stat').innerHTML = 'Error: Cannot add yourself!';
        return;
    }
    document.getElementById('username').blur();


    //blur the search value
    //alert('result');

    sendJsonRequest({'username': username}, '/searchFriend', function(result, targetUrl, params) {
        if(result != '')
        {

            //alert(result);
            listing = userObj.friend_list.split(',');

                //alert(list[0]);
                //alert(list[1]);
                
            
            for (let index = 0; index < listing.length; index++) {
                if(listing[index] == result)
                {
                    document.getElementById('friend-stat').innerHTML = 'Error: Already added this user!';
                    return;
                }
                
            }
            
            if(userObj.friend_list == '')
            {
                userObj.friend_list += result;
            }
            else
            {
                userObj.friend_list += ',' + result;
            }
            document.getElementById('friend-stat').innerHTML = "Successfully added " + result + " to your friend list!";
            //friend-list
            
            document.getElementById('friend-list').innerHTML+="<span class = 'visit-flow' id = 'span friend "+result+"'><a class = 'visit-links' href = 'visit/"+result+"'>"+result+"</a><p class = 'friend-rm' id = 'friend "+result+"' onclick='removeFriend(this.id)'>Remove</p></span>";

        }else{
            document.getElementById('friend-stat').innerHTML = "Error: User not found!";
        
        }
        return result;
    });
    
}

function removeFriend(id){
    document.getElementById('span '+id).remove();


    userObj.friend_list = userObj.friend_list.replace(id.substring(7),"");
    userObj.friend_list = userObj.friend_list.replace(",,",",");
    if(userObj.friend_list.substring(0,1)==","){
        userObj.friend_list = userObj.friend_list.substring(1);
    }
    len = userObj.friend_list.length;
    if(userObj.friend_list.substring(len-1,len)==","){
        userObj.friend_list = userObj.friend_list.substring(0,len-1);
    }

    let userStr = JSON.stringify(userObj);
            // sendBeacon makes a POST request, but tells the browser to make it whenever it can
            // Allows the POST request to be sent even if the page that requested it isn't loaded
    navigator.sendBeacon("/updateAccountFromJson", userStr);
}