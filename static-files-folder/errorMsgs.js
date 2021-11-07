function checkCreateFields(){
    user = document.getElementById("uname").value;
    pass = document.getElementById("password").value;
    check = document.getElementById("password-confirm").value;
    if(user==""||pass==""||check==""){
        updateErrorMessage("At least one field has been left blank");
        return false;
    }else if()
}

function checkLoginFields(user,pass){

}

function updateErrorMessage(errString){
    document.getElementById("status").textContent = "Error: " + errString;
}

function updateStatusMessage(statString){
    document.getElementById(status).textContent = "Status: " + statString;
}