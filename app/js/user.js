$.userid = "";

var createNewUserId = function() {
    var time_suffix = (Date.now()) % 1e8; // 8 digits from end of timestamp

    var alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = [];
    for (var i = 0; i < 8; i++) {
        var choice = Math.floor(Math.random() * alphabet.length);
        result.push(alphabet[choice]);
    }
    var theId = result.join('') + time_suffix;
    ls_set("userid", {id: theId, accepted: false});
    $.userid = theId;
}

var _registerUserId = function() {
    var currentUserId = ls_get('userid');
    if (currentUserId.accepted == false) {
        makeRequest('http://50.97.175.55:32619/register/user', 'POST', 
                {
                    id: currentUserId.id
                    , time: $.installTime
                    , version: $.definitions.version
                },
                function(response, error) {
                    if (error != false) {
                        console.log("Error making user register request");
                        return
                    } 
                    if (response.error != '') {
                        console.log("Userid already taken, making a new one");
                        createNewUserId();
                        // call again with new ID
                        _registerUserId();
                        return
                    }
                    currentUserId.accepted = true;
                    ls_set("userid", currentUserId);
                    $.registered = true;
                    _reportUserId();
                }
        );
    }
};

var _reportUserId = function() {
    makeRequest('http://50.97.175.55:32619/report/user', 'POST', 
            {
                id: $.userid
                , os: BrowserDetect.OS
                , browser: BrowserDetect.browser
                , bversion: BrowserDetect.version
                , mobile: $.mobile
                , version: $.definitions.version
            },
            function(response, error) {
                if (error != false) {
                    console.log("Error making user report request");
                    return
                } else {
                    $.reported = true;
                }
            }
    );
}

var installTime = ls_get('install_time');
if (installTime === null) {
    $.installTime = new Date().getTime(); 
    ls_set('install_time', {time: $.installTime});
} else {
    $.installTime = installTime.time;
}

$.reported = false;
$.registered = false;

var currentUserId = ls_get('userid');
if (currentUserId === null) {
    createNewUserId();
    _registerUserId();
} else if (currentUserId.accepted != true) {
    $.userid = currentUserId.id;
    _registerUserId();
} else {
    $.userid = currentUserId.id;
    $.registered = true;
    _reportUserId();
}
