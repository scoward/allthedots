makeRequest = function(url, verb, object, callback) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        console.log("Error creating XMLHttpRequest")
        return false;
    }

    function handleReturn() {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status === 200) {
                callback(JSON.parse(httpRequest.responseText), false);
            } else {
                console.log("Error with request: " + httpRequest.status);
                callback('', true);
            }
        }
    }
    
    sendString = JSON.stringify(object)
    httpRequest.onreadystatechange = handleReturn;
    httpRequest.open(verb, url);
    httpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    httpRequest.send(sendString);
}
