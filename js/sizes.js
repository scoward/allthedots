$.getWidthHeight = function() {
    if ($.mobile) {
        return {width: window.innerWidth, height: window.innerHeight}
    } else {
        return {width: 600, height: 900}
    }
}
