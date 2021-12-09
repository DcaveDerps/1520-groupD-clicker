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
            list = userObj.friend_list.split();

            for (let index = 0; index < list.length; index++) {
                if(list[index] = result)
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
        return result;
    });
    
}

