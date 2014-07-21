ls_get = function(key) {
    var item = localStorage.getItem(key);
    if (key == null) {
        return undefined;
    }
    try {
        return JSON.parse(item);
    } catch (e) {
        console.log("Couldn't parse JSON: " + key + ": " + item)
    }
    return undefined;
}

ls_set = function(key, value) {
    if (value === undefined) {
        localStorage.removeItem(key);
        return
    }
    localStorage.setItem(key, JSON.stringify(value));
}
