$.getWidthHeight = function() {
    if ($.mobile) {
        return {width: window.innerWidth, height: window.innerHeight}
    } else {
        return {width: 600, height: 900}
    }
}

$.getCircleDiameter = function() {
    return Math.ceil(($.colStep / 2 + $.rowStep / 2) / 3)
}
