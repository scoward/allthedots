$.setState = function(state) {
    $.buttons.length = 0;

    if (state == 'menu') {
        var levelsButton = new $.Button({
            title: 'LEVELS',
            x: $.cw / 2,
            y: $.ch / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.levelGroup = 0
                $.setState('level_select')
            },
        })
        $.buttons.push(levelsButton)
    } 
    else if (state == 'level_select') {
        $.lastState = 'menu'
        var level
            , startingX = 30
            , padding = 50
            , x = startingX
            , y = $.gameScreen.y
            , levels = $.definitions.levels[$.levelGroup].levels

        // back to Levels
        var button = new $.Button({
            type: 'back',
            x: ($.topBar.x + $.barButtonWidth / 2),
            y: ($.topBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                if ($.levelGroup != 0 && $.levelGroup - 1 > -1) {
                    $.levelGroup--
                    $.setState('level_select')
                }
            },
        })
        $.buttons.push(button)

        // back to Levels
        var button = new $.Button({
            type: 'next',
            x: ($.topBar.width - $.barButtonWidth / 2),
            y: ($.topBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                if ($.levelGroup + 1 < $.definitions.levels.length) {
                    $.levelGroup++
                    $.setState('level_select')
                }
            },
        })
        $.buttons.push(button)

        for (var i = 0; i < levels.length; i++) {
            level = levels[i]
            var button = new $.Button({
                title: i+1,
                type: "level",
                level: level,
                x: x + $.circleButtonWidth / 2,
                y: y + $.circleButtonHeight / 2,
                lockedWidth: $.circleButtonWidth,
                lockedHeight: $.circleButtonHeight,
                action: function() {
                    $.loadLevel(this.level)
                    $.setState('play')
                },
            })
            $.buttons.push(button)

            if (x + padding + 2 * $.circleButtonWidth < $.cw) {
                x += padding + $.circleButtonWidth
            } else {
                x = startingX
                y += padding + $.circleButtonHeight
            }
        }
        
        // back to Menu
        var button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.barButtonWidth / 2),
            y: ($.bottomBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                $.setState('menu')
            },
        })
        $.buttons.push(button)
    }
    else if (state == 'play') {
        $.lastState = 'level_select'
        $.countdownStart = Date.now()
        $.levelStarted = false
        
        var x = 30
            , padding = 10
            , y = $.ch - padding - $.buttonHeight

        // back to Level Select
        var button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.barButtonWidth / 2),
            y: ($.bottomBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                $.setState('level_select')
            },
        })
        $.buttons.push(button)

        // Restart level
        var button = new $.Button({
            type: 'restart',
            x: ($.bottomBar.x + $.barButtonWidth * 1.5),
            y: ($.bottomBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                $.countdownStart = Date.now()
                $.loadLevel($.level)
            },
        })
        $.buttons.push(button)
    }
    else if (state == 'game_over') {
        $.lastState = 'level_select'
        var level
            , padding = 10
            , x = $.cw / 2
            , y = $.ch - 3 * (padding + $.buttonHeight)
        
        // Restart level
        var button = new $.Button({
            type: 'restart',
            x: ($.bottomBar.x + $.barButtonWidth * 1.5),
            y: ($.bottomBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                $.loadLevel($.level)
                $.setState('play')
            },
        })
        $.buttons.push(button)
        
        // Back to Level Select
        button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.barButtonWidth / 2),
            y: ($.bottomBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                $.setState('level_select')
            },
        })
        $.buttons.push(button)

        y += padding + $.buttonHeight
        button = new $.Button({
            title: 'MAIN',
            x: x,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.setState('menu')
            },
        })
        $.buttons.push(button)
    }
        
    $.state = state
}

$.setupStates = function() {
    $.states['menu'] = function() {
        $.clearScreen();
        $.drawBottomBar()
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
    
    $.states['levels'] = function() {
        $.clearScreen();
        $.drawBottomBar()
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }

    $.states['level_select'] = function() {
        $.clearScreen();
        $.drawBottomBar()
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}

        // draw level name
        $.util.renderText($.ctxmg, $.definitions.levels[$.levelGroup].title, $.topBar.width / 2, 
                $.topBar.y + ($.topBar.height / 2), 'bold 32pt Helvetica', $.blackFillStyle, 'center')
    }
    
    $.states['game_over'] = function() {
        $.clearScreen();
        $.drawBottomBar()

        var levelTime = ($.elapsed * (1000 / 60)) / 1000
            , fillStyle = 'hsla(0, 50%, 50%, 1)'
        $.util.renderText($.ctxmg, levelTime.toFixed(2), $.cw / 2, 100, 'bold 40pt Helvetica', fillStyle, 'center')
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
    
    $.states['play'] = function() {
        $.clearScreen()
        $.drawBottomBar()

        if ($.levelStarted == false) {
            var now = Date.now()
                , diff = (now - $.countdownStart) / 1000
                , secLeft = 3 - diff
                , round = Math.ceil(secLeft)
            // draw other stuff first so that countdown is on top
            $.drawLines()
            $.drawPresets()
            $.drawCircles()
            // draw countdown stuff
            if (round > 0) {
                var fillPercent = secLeft / round
                    //, fillStyle = 'hsla(0, 50%, 50%, ' + fillPercent.toFixed(1).toString() + ')'
                    , fillStyle = 'hsla(0, 50%, 50%, 1)'
                $.util.renderText($.ctxmg, round.toString(), $.cw / 2, $.ch / 2, 'bold 200pt Helvetica', fillStyle, 'center')
            } else {
                $.levelStarted = true
            }
        } else {
            $.updateDelta()
            $.handleEvents()
            $.drawLines()
            $.drawPresets()
            $.drawCircles()
            if ($.checkWinCondition()) {
                // stop timer
                $.levelEndTime = Date.now()
                $.levelStarted = false
                $.setState('game_over')
            } else {
                // draw timer
                var timerSeconds = ($.elapsed * (1000 / 60)) / 1000
                    , fillStyle = 'hsla(0, 50%, 50%, 1)'
                $.util.renderText($.ctxmg, timerSeconds.toFixed(2), $.bottomBar.width - 20, 
                        $.bottomBar.y + ($.bottomBar.height / 2), 'bold 40pt Helvetica', fillStyle, 'right')
            }
        }

        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
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

// only send if not in end condition or going backward
$.canMoveToCircle = function(from, to) {
    if (from.preset == true) {
        if (from.forced == true) {
            // end of forced string
            if (from.presetNext != null && from.presetNext != to) {
                return false
            }
        } else {
            if (from.presetNext != null && from.presetPrev != null) {
                if (from.prev != null) {
                    if (from.presetNext == from.prev) {
                        return from.presetPrev == to
                    } else {
                        return from.presetNext == to
                    }
                } else if (from.next != null) {
                    if (from.presetNext == from.next) {
                        return from.presetPrev == to
                    } else {
                        return from.presetNext == to
                    }
                }
            } else if (from.presetNext != null) {
                if (from.presetNext != from.prev) {
                    return from.presetNext == to
                }
            } else if (from.presetPrev != null) {
                if (from.presetPrev != from.prev) {
                    return from.presetPrev == to
                }
            }
        }
    } else if (to.preset == true) {
        if (to.forced == true) {
            // must hit beginning of forced array
            if (to.presetPrev != null) {
                return false
            }
        } else {
            // can't enter middle of preset array
            if (to.presetPrev != null && to.presetNext != null) {
                return false
            }
        }
    }

    return true
}

$.touchMoveToCircle = function(to) {
    var from = $.selectedCircle
        , diff = Math.abs(to.col - from.col) 
                 + Math.abs(to.row - from.row)
    // TODO: make movement possible across different diffs
    if (diff != 1) {
        return
    }
    
    if (to.end == true) {
        $.goForwardOneCircle(to)
        if (!$.checkWinCondition()) {
            $.goBackOneCircle(from)
        }
    } else if (to.next == from) {
        // user pressed back to previously selected circle, so 
        // newCircle.next == selectedCircle
        $.goBackOneCircle(to)
    } else if (to.next == null) {
        var canMove = $.canMoveToCircle(from, to)
        if (canMove) {
            $.goForwardOneCircle(to)
        }
    }
}

// Mouse has different movement handling than keyboard
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
    
    if ($.mouse.down == 1) {
        var circle
            , diff = 0
        for (var i = 0; i < $.circles.length; i++) {
            circle = $.circles[i]
            if (circle.pointIntersects($.mouse.sx, $.mouse.sy)) {
                $.touchMoveToCircle(circle)
                
                break // break loop, can only be over one circle at a time
            }
        }
    }
}
