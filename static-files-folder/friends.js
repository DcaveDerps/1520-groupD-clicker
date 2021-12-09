function checkFriend(){
    username = document.getElementById('username').value;
    document.getElementById('username').value='';
    if(userObj.uname==username){
        alert('You cannot add yourself!');
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
                    alert('Already added this user!')
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
        }
        else
            alert('User does not exist!');
            
        return result;
    });
    
}
