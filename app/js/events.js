$.bindEvents = function() {
    window.addEventListener('mousemove', $.mousemovecb)
    window.addEventListener('mousedown', $.mousedowncb)
    window.addEventListener('mouseup', $.mouseupcb)
    window.addEventListener('touchmove', $.touchmovecb)
    window.addEventListener('touchend', $.touchendcb)
    window.addEventListener('touchstart', $.touchstartcb)
    window.addEventListener('keydown', $.keydowncb)
    window.addEventListener('keyup', $.keyupcb)
    window.addEventListener('resize', $.resizecb)
}

$.mousemovecb = function(e) {
    e.preventDefault()
    $.mouse.ax = e.pageX
    $.mouse.ay = e.pageY
    $.mousescreen()
}

$.mousescreen = function() {
    $.mouse.sx = $.mouse.ax - $.cOffset.left
    $.mouse.sy = $.mouse.ay - $.cOffset.top
    $.mouse.x = $.mouse.sx 
    $.mouse.y = $.mouse.sy
}

$.mousedowncb = function( e ) {
    e.preventDefault()
    $.mouse.down = 1
}

$.mouseupcb = function( e ) {
    e.preventDefault()
    $.mouse.down = 0
}

$.touchmovecb = function(e) {
    e.preventDefault()
    if (e.touches.length > 0) {
        // Only deal with first touch
        $.mouse.ax = e.touches[0].pageX
        $.mouse.ay = e.touches[0].pageY
    } else {
        $.mouse.ax = -1
        $.mouse.ay = -1
    }
    $.mousescreen()
}

$.touchstartcb = function( e ) {
    e.preventDefault()
    $.mouse.down = 1
}

$.touchendcb = function( e ) {
    e.preventDefault()
    $.mouse.down = 0
}

$.pushMouseOffScreen = function() {
    $.mouse.ax = -1
    $.mouse.ay = -1
    $.mousescreen()
}

$.keydowncb = function(e) {
    var e = ( e.keyCode ? e.keyCode : e.which )
    if( e === 38 || e === 87 ){ $.keys.state.up = 1 }
    if( e === 39 || e === 68 ){ $.keys.state.right = 1 }
    if( e === 40 || e === 83 ){ $.keys.state.down = 1 }
    if( e === 37 || e === 65 ){ $.keys.state.left = 1 }
}

$.keyupcb = function(e) {
    var e = ( e.keyCode ? e.keyCode : e.which )
    if( e === 38 || e === 87 ){ $.keys.state.up = 0 }
    if( e === 39 || e === 68 ){ $.keys.state.right = 0 }
    if( e === 40 || e === 83 ){ $.keys.state.down = 0 }
    if( e === 37 || e === 65 ){ $.keys.state.left = 0 }
}

$.resizecb = function( e ) {
    var rect = $.canvas.getBoundingClientRect();
    $.cOffset = {
        left: rect.left,
        top: rect.top
    }
}
