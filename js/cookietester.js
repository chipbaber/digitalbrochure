/*function log sends actions from the webpage back to the server.*/

devmode=true;

function log(operation,machine) {

var p_url="add url to push log";
var params = p_url+machine+"&p_id2=&p_user_layout="+operation;

if (devmode){
console.log( operation+ '  '+machine);
}
else {
var http = new XMLHttpRequest();
http.open("GET", params, true);
http.onreadystatechange = function() {
	if(http.readyState == 4 && http.status == 200) {
		//alert(http.responseText);
	}
}
http.send(null);
}

}
