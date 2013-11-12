$.clearScreen = function() {
    $.ctxmg.clearRect(0, 0, $.cw, $.ch)
    $.ctxmg.fillStyle = $.whiteFillStyle
    $.ctxmg.fillRect(0, 0, $.cw, $.ch)
}

$.createCircles = function() {
    var y = $.gameScreen.y + $.rowStep / 2
    for (var row = 0; row < $.level.rows; row++) {
        var x = $.colStep / 2
            , circle
        for (var col = 0; col < $.level.columns; col++) {
            circle = new $.Circle({
                        x: x
                        , y: y
                        , row: row
                        , col: col
                        , radius: $.circleRadius
            })
            $.circles.push(circle)
            x += $.colStep
        }
        y += $.rowStep
    }
}

$.drawCircles = function() {
    var circle
    for (var i = 0; i < $.circles.length; i++) {
        circle = $.circles[i]
        $.circles[i].render()
    }
}

$.drawBottomBar = function() {
    $.ctxmg.beginPath()
    $.ctxmg.rect($.bottomBar.x, $.bottomBar.y, $.bottomBar.width, $.bottomBar.height)
    $.ctxmg.fillStyle = "#FFFFFF"
    $.ctxmg.fill()
}

$.drawLines = function() {
    var circle = $.startingCircle
    while (circle.next != null) {
        $.util.line($.ctxmg, circle.x, circle.y, circle.next.x, circle.next.y, $.lineStrokeStyle)
        circle = circle.next
    }
}

$.setStartingCircle = function(row, col) {
    var num = $.getIndexForRowCol(row, col)
    $.circles[num].selected = true
    $.circles[num].start = true
    $.selectedCircle = $.circles[num]
    $.startingCircle = $.circles[num]
}

$.setEndingCircle = function(row, col) {
    var num = $.getIndexForRowCol(row, col)
    $.circles[num].end = true
}

$.getIndexForRowCol = function(row, col) {
    return row * $.level.columns + col
}

$.checkWinCondition = function() {
    var set = {}
        , circle = $.startingCircle
        , error
        , index
        // start at one because end won't be counted
        , length = 1
    while (circle.next != null && error == null) {
        index = $.getIndexForRowCol(circle.row, circle.col)
        if (index in set) {
            error = true
            continue
        }
        set[index] = true
        length++
        if (circle.end) {
            continue
        }
        circle = circle.next
    }
    // same row gone to twice
    if (error) {
        return false
    }
    // not enough values in set
    if (length < $.level.rows * $.level.columns) {
        return false
    }
    // not actually on end value
    if (circle.end != true) {
        return false
    }
    
    return true
}

$.resetMouse = function() {
    $.mouse.down = 0
    $.mouse.touchClick = 0
    $.pushMouseOffScreen()
}

$.reset = function() {
    $.resetMouse()
    $.dt = 1
    $.lt = 0
    $.elapsed = 0
    $.tick = 0
    
    $.levelStarted = false
}

$.updateDelta = function() {
    var now = Date.now()
    $.dt = (now - $.lt) / (1000  / 60)
    $.dt = ($.dt < 0) ? 0.001 : $.dt
    $.dt = ($.dt > 10) ? 10 : $.dt
    $.lt = now
    $.elapsed += $.dt
}

$.loadLevel = function(level) {
    $.reset()
    $.level = level
    $.colStep = $.gameScreen.width / level.columns
    $.rowStep = $.gameScreen.height / level.rows
    $.circleDiam = $.getCircleDiameter()
    $.circleRadius = $.circleDiam / 2
    $.circles = []
    $.presets = []
    $.levelStarted = false

    $.createCircles()
    $.setStartingCircle(level.start.row, level.start.col)
    $.setEndingCircle(level.end.row, level.end.col)
    $.setupPresets()
}

$.init = function() {
    $.wrap = document.getElementById("wrap")
    $.wrapInner = document.getElementById("wrap-inner")
    $.canvas = document.getElementById("main")
    $.ctxmg = $.canvas.getContext("2d")
    var dims = $.getWidthHeight()

    $.audioManager = new CAAT.Module.Audio.AudioManager().initialize(8)
    $.audioManager.setAudioFormatExtensions(['wav', 'ogg', 'x-wav', 'mp3']) 
    $.audioManager.addAudioFromURL('connect', 'sounds/blip.wav')
    $.audioManager.addAudioFromURL('wrong', 'sounds/wrong.wav')
    $.audioManager.addAudioFromURL('win', 'sounds/win.wav')
    $.audioManager.addAudioFromURL('countdown', 'sounds/countdown.wav')
    $.audioManager.addAudioFromURL('start', 'sounds/start.wav')
    
    $.cw = $.canvas.width = dims.width
    $.ch = $.canvas.height = dims.height
    $.wrap.style.width = $.wrapInner.style.width = $.cw + 'px'
    $.wrap.style.height = $.wrapInner.style.height = $.ch + 'px'
    $.wrap.style.marginLeft = (-$.cw / 2) - 10 + 'px'
    $.wrap.style.marginTop = (-$.ch / 2) - 10 + 'px'
    $.buttonWidth = 250
    $.buttonHeight = 40
    $.circleButtonWidth = 60
    $.circleButtonHeight = 60
    $.gameScreen = {
        x: 0
        , y: ($.ch - $.cw) / 2
        , height: $.cw
        , width: $.cw
    }
    $.bottomBar = {
        x: 0
        , y: Math.ceil($.ch - $.ch * .075) // 7.5% of screen
        , height: Math.ceil($.ch * .075)
        , width: $.cw
    }
    $.topBar = {
        x: 0
        , y: $.gameScreen.y - Math.ceil($.ch * .075)
        , height: Math.ceil($.ch * .075)
        , width: $.cw
    }
    $.barButtonWidth = $.bottomBar.height
    $.barButtonHeight = $.bottomBar.height
    
    $.defaultFillStyle = "#000000"
    $.selectedFillStyle = "#FF0000"
    $.startingFillStyle = "#006600"
    $.endingFillStyle = "#00CC00"
    $.whiteFillStyle = "#FFFFFF"
    $.blackFillStyle = "#000000"
    $.lineStrokeStyle = "#87E1F5"
    $.presetStrokeStyle = "#000FFF"
    $.arrowStrokeStyle = "#CCC"
    
    $.keys = {
        state: {
            up: 0,
            down: 0,
            left: 0,
            right: 0, 
        },
        pressed: {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        }
    }
    $.okeys = {}
    $.mouse = {
        x: $.width / 2,
        y: $.height / 2,
        sx: 0,
        sy: 0,
        down: 0
    }
    $.cOffset = {
        left: 0,
        top: 0
    }
    
    $.states = {}
    $.state = ''
    $.lastState = ''
    $.buttons = []
    
    $.resizecb() // to set initial cOffset
    $.bindEvents()
    $.setupStates()
    $.setState('menu')
    $.loop()

    CocoonJS.App.setAppShouldFinishCallback(function() {
        if ($.state == 'menu') return true
        $.setState($.lastState)
        return false
    })
}

$.loop = function() {
    requestAnimFrame($.loop)

    // setup the pressed state for all keys
    // pressed is basically first keydown event
    for (var k in $.keys.state) {
        if ($.keys.state[k] && !$.okeys[k]) {
            $.keys.pressed[k] = 1
        } else {
            $.keys.pressed[k] = 0
        }
    }
    
    if ($.mouse.odown == 1 && $.mouse.down == 0) {
        $.mouse.click = true
    } else {
        $.mouse.click = false
    }
    $.mouse.odown = $.mouse.down
    
    // run current state for delta
    $.states[$.state]();

    // move current keys into old keys
    $.okeys = {}
    for (var k in $.keys.state) {
        $.okeys[k] = $.keys.state[k]
    }
    
    if ($.mobile && $.mouse.click) {
        // reset mouse on mobile to clear x/y after click happens
        // do this so because x/y isn't cleared on PC with mouse/keyboard 
        // and the click button
        $.resetMouse()
        $.mouse.click = false
    }
}

window.addEventListener('load', function() {
    $.init()
})
