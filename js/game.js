$.clearScreen = function() {
    $.ctxmg.clearRect(0, 0, $.cw, $.ch)
    $.ctxmg.fillStyle = "white"
    $.ctxmg.fillRect(0, 0, $.cw, $.ch)
}

$.createCircles = function() {
    var y = $.gameScreen.y + $.rowStep / 2
    for (var row = 0; row < $.level.rows; row++) {
        var x = $.colStep / 2
        for (var col = 0; col < $.level.columns; col++) {
            $.circles.push({x: x
                        , y: y
                        , row: row
                        , col: col
            })
            x += $.colStep
        }
        y += $.rowStep
    }
}

$.drawCircles = function() {
    var circle
    for (var i = 0; i < $.circles.length; i++) {
        circle = $.circles[i]
        if (circle.selected) {
            $.util.fillCircle($.ctxmg, circle.x, circle.y, $.circleRadius, $.selectedFillStyle)
        } else if (circle.start) {
            $.util.fillCircle($.ctxmg, circle.x, circle.y, $.circleRadius, $.startingFillStyle)
        } else if (circle.end) {
            $.util.fillCircle($.ctxmg, circle.x, circle.y, $.circleRadius, $.endingFillStyle)
        } else {
            $.util.fillCircle($.ctxmg, circle.x, circle.y, $.circleRadius, $.defaultFillStyle)
        }
    }
}

$.drawBottomBar = function() {
    $.ctxmg.beginPath()
    $.ctxmg.rect($.bottomBar.x, $.bottomBar.y, $.bottomBar.width, $.bottomBar.height)
    $.ctxmg.fillStyle = "#FFFFFF"
    $.ctxmg.fill()
}

$.drawLine = function(startX, startY, endX, endY, stroke) {
    $.ctxmg.beginPath()
    $.ctxmg.moveTo(startX, startY)
    $.ctxmg.lineTo(endX, endY)
    $.ctxmg.strokeStyle=stroke
    $.ctxmg.stroke()
}

$.drawLines = function() {
    var circle = $.startingCircle
    while (circle.next != null) {
        $.drawLine(circle.x, circle.y, circle.next.x, circle.next.y, $.lineStrokeStyle)
        circle = circle.next
    }
}

$.drawArrow = function(startX, startY, endX, endY, stroke) {
    var x = 0, y = 0
    $.ctxmg.beginPath()
    if (startX != endX) {
        var left = true
        y = startY
        if (startX < endX) {
            x = startX + ($.colStep / 2)
            left = false
        } else {
            x = endX + ($.colStep / 2)
        }

        if (left) {
            $.ctxmg.moveTo(x + $.circleRadius, y - $.circleRadius)
            $.ctxmg.lineTo(x - $.circleRadius, y)
            $.ctxmg.lineTo(x + $.circleRadius, y + $.circleRadius)
        } else {
            $.ctxmg.moveTo(x - $.circleRadius, y - $.circleRadius)
            $.ctxmg.lineTo(x + $.circleRadius, y)
            $.ctxmg.lineTo(x - $.circleRadius, y + $.circleRadius)
        }
    } else {
        var up = true
        x = startX
        if (startY < endY) {
            y = startY + ($.rowStep / 2)
            up = false
        } else {
            y = endY + ($.rowStep / 2)
        }
        
        if (up) {
            $.ctxmg.moveTo(x - $.circleRadius, y + $.circleRadius)
            $.ctxmg.lineTo(x, y - $.circleRadius)
            $.ctxmg.lineTo(x + $.circleRadius, y + $.circleRadius)
        } else {
            $.ctxmg.moveTo(x - $.circleRadius, y - $.circleRadius)
            $.ctxmg.lineTo(x, y + $.circleRadius)
            $.ctxmg.lineTo(x + $.circleRadius, y - $.circleRadius)
        }
    }
    $.ctxmg.strokeStyle=stroke
    $.ctxmg.stroke()
}

$.drawPresets = function() {
    for (var i = 0; i < $.presets.length; i++) {
        var circle = $.presets[i]
        $.drawLine(circle.x, circle.y, circle.presetNext.x, circle.presetNext.y, $.presetStrokeStyle)
        if (circle.forced == true) {
            // draw arrows for forced preset
            $.drawArrow(circle.x, circle.y, circle.presetNext.x, circle.presetNext.y, $.arrowStrokeStyle)
        }
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

$.goBackOneCircle = function(backCircle) {
    backCircle.selected = true
    $.selectedCircle.selected = false
    $.selectedCircle.prev = null
    backCircle.next = null
    $.selectedCircle = backCircle
}

$.goBack = function(backCircle) {
    var startingFrom = $.selectedCircle
    $.goBackOneCircle(backCircle)
    // Only go back on presets if pressing back at the beginning of a preset
    while ($.selectedCircle.preset != null && startingFrom.preset != null &&
            (startingFrom == $.selectedCircle.presetNext ||
             startingFrom == $.selectedCircle.presetPrev)) {
        startingFrom = $.selectedCircle
        $.goBackOneCircle($.selectedCircle.prev)
    }
}

$.goForwardOneCircle = function(forwardCircle) {
    forwardCircle.prev = $.selectedCircle
    $.selectedCircle.next = forwardCircle
    $.selectedCircle.selected = false
    forwardCircle.selected = true
    $.selectedCircle = forwardCircle
}

$.goForward = function(forwardCircle) {
    $.goForwardOneCircle(forwardCircle)
    var direction
    while ($.selectedCircle.preset != null && forwardCircle != null) {
        forwardCircle = null
        if ($.selectedCircle.presetNext != null && (direction == null || direction == 1)) {
            forwardCircle = $.selectedCircle.presetNext
            direction = 1
        } else if ($.selectedCircle.presetPrev != null && (direction == null || direction == -1)) {
            forwardCircle = $.selectedCircle.presetPrev
            direction = -1
        }
        
        if (forwardCircle) {
            $.goForwardOneCircle(forwardCircle)
        }
    }
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

$.moveToRowCol = function(newRow, newCol) {
    if (newRow < 0 || newRow > $.level.rows - 1 || newCol < 0 || newCol > $.level.columns - 1) {
        return
    }
    var newCircle = $.circles[$.getIndexForRowCol(newRow, newCol)]
    if (newCircle.end == true) {
        // check end condition
        $.goForward(newCircle)
        if (!$.checkWinCondition()) {
            $.goBack($.selectedCircle.prev)
        }
    } else if (newCircle.next == $.selectedCircle) {
        // user pressed back to previously selected circle, so 
        // newCircle.next == selectedCircle
        $.goBack(newCircle)
    } else if (newCircle.next == null) {
        // user selects to go to unvisited circle
        if (newCircle.preset == true) {
            // special logic for presets:
            // - If not forced then make sure entering on start/stop
            // - If forced make sure entering from start
            if (newCircle.forced == true && newCircle.presetPrev == null) {
                $.goForward(newCircle)
            } else if (newCircle.forced == false && 
                    (newCircle.presetPrev == null || newCircle.presetNext == null)) {
                $.goForward(newCircle)
            }
        } else {
            $.goForward(newCircle)
        }
    }
}

$.setupPresets = function() {
    var array = $.level.presets
    if (array.length > 1) {
        for (var i = 0; i < array.length; i++) {
            var presetObject = array[i]
                , presetArray = presetObject.array
                , circle = presetArray[0]
                , from = $.circles[$.getIndexForRowCol(circle.row, circle.col)]
            for (var j = 1; j < presetArray.length; j++) {
                circle = presetArray[j] 
                var to = $.circles[$.getIndexForRowCol(circle.row, circle.col)]
                
                from.preset = true 
                from.forced = presetObject.forced
                to.preset = true 
                to.forced = presetObject.forced
                from.presetNext = to
                to.presetPrev = from
                $.presets.push(from)
                
                from = to
            }
        }
    }
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

// TODO figure out what this is doing
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
    $.circleDiam = ($.cw) / 24
    $.circleRadius = $.circleDiam / 2
    $.circles = []
    $.presets = []
    $.levelStarted = false

    $.createCircles()
    $.setStartingCircle(level.start.row, level.start.col)
    $.setEndingCircle(level.end.row, level.end.col)
    $.setupPresets()
}

$.handleEvents = function() {
    if ($.keys.pressed.up) {
        $.moveToRowCol($.selectedCircle.row - 1, $.selectedCircle.col)
    } else if ($.keys.pressed.down) {
        $.moveToRowCol($.selectedCircle.row + 1, $.selectedCircle.col)
    } else if ($.keys.pressed.left) {
        $.moveToRowCol($.selectedCircle.row, $.selectedCircle.col - 1)
    } else if ($.keys.pressed.right) {
        $.moveToRowCol($.selectedCircle.row, $.selectedCircle.col + 1)
    }
}

$.init = function() {
    $.wrap = document.getElementById("wrap")
    $.wrapInner = document.getElementById("wrap-inner")
    $.canvas = document.getElementById("main")
    $.ctxmg = $.canvas.getContext("2d")
    var dims = $.getWidthHeight()
    $.cw = $.canvas.width = dims.width
    $.ch = $.canvas.height = dims.height
    $.wrap.style.width = $.wrapInner.style.width = $.cw + 'px'
    $.wrap.style.height = $.wrapInner.style.height = $.ch + 'px'
    $.wrap.style.marginLeft = (-$.cw / 2) - 10 + 'px'
    $.wrap.style.marginTop = (-$.ch / 2) - 10 + 'px'
    $.buttonWidth = 250
    $.buttonHeight = 40
    $.gameScreen = {
        x: 0
        , y: ($.ch - $.cw) / 2
        , height: $.cw
        , width: $.cw
    }
    $.bottomBar = {
        x: 0
        , y: $.ch - $.ch * .05 // 5% of screen
        , height: $.ch * .05
        , width: $.cw
    }
    $.bottomButtonWidth = $.bottomBar.height
    $.bottomButtonHeight = $.bottomBar.height
    
    $.defaultFillStyle = "#000000"
    $.selectedFillStyle = "#FF0000"
    $.startingFillStyle = "#006600"
    $.endingFillStyle = "#00CC00"
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
    $.buttons = []
    
    $.resizecb() // to set initial cOffset
    $.bindEvents()
    $.setupStates()
    $.setState('menu')
    $.loop()
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
