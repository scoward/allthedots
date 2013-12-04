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
                $.setState('level_group_select')
            },
        })
        $.buttons.push(levelsButton)
    }
    else if (state == 'level_group_select') {
        $.lastState = 'menu'

        // 4 x 4 Group Select Button
        var fourByFourButton = new $.Button({
            title: '4 x 4',
            x: $.cw / 2,
            y: $.ch / 2 - $.buttonHeight * 2.25,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.levelGroup = 0
                $.levelSet = 0
                $.setState('level_select')
            },
        })
        $.buttons.push(fourByFourButton)

        // 5 x 5 Group Select Button
        var fiveByFiveButton = new $.Button({
            title: '5 x 5',
            x: $.cw / 2,
            y: $.ch / 2 - $.buttonHeight * .75,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.levelGroup = 1
                $.levelSet = 0
                $.setState('level_select')
            },
        })
        $.buttons.push(fiveByFiveButton)

        // 6 x 6 Group Select Button
        var sixBySixButton = new $.Button({
            title: '6 x 6',
            x: $.cw / 2,
            y: $.ch / 2 + $.buttonHeight * .75,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.levelGroup = 2
                $.levelSet = 0
                $.setState('level_select')
            },
        })
        $.buttons.push(sixBySixButton)

        // 7 x 7 Group Select Button
        var sevenBySevenButton = new $.Button({
            title: '7 x 7',
            x: $.cw / 2,
            y: $.ch / 2 + $.buttonHeight * 2.25,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.levelGroup = 3
                $.levelSet = 0
                $.setState('level_select')
            },
        })
        $.buttons.push(sevenBySevenButton)

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
    else if (state == 'level_select') {
        $.lastState = 'level_group_select'
        var level
            , startingX = 30
            , padding = 50
            , x = startingX
            , y = $.gameScreen.y
            , levels = $.definitions.levels[$.levelGroup].levels
            , levelSets = Math.ceil(levels.length / 30) // Display up to 30 levels per page

        // Previous Level Page
        var button = new $.Button({
            type: 'back',
            x: ($.topBar.x + $.barButtonWidth / 2),
            y: ($.topBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                if ($.levelSet != 0 && $.levelSet - 1 > -1) {
                    $.levelSet--
                    $.setState('level_select')
                }
            },
        })
        $.buttons.push(button)

        // Next Level Page
        var button = new $.Button({
            type: 'next',
            x: ($.topBar.width - $.barButtonWidth / 2),
            y: ($.topBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                if ($.levelSet + 1 < levelSets) {
                    $.levelSet++
                    $.setState('level_select')
                }
            },
        })
        $.buttons.push(button)

        for (var i = 0; i < 30 && i + 30 * $.levelSet < levels.length; i++) {
            level = levels[i + 30 * $.levelSet]
            var button = new $.Button({
                title: i + 1 + 30 * $.levelSet,
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
        
        // back to Level Set Select
        var button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.barButtonWidth / 2),
            y: ($.bottomBar.y + $.barButtonHeight / 2),
            lockedWidth: $.barButtonWidth,
            lockedHeight: $.barButtonHeight,
            action: function() {
                $.setState('level_group_select')
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

    $.states['level_group_select'] = function() {
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
                if ($.lastNum != round) {
                    $.audioManager.play('countdown')
                    $.lastNum = round
                }
                var fillPercent = secLeft / round
                    //, fillStyle = 'hsla(0, 50%, 50%, ' + fillPercent.toFixed(1).toString() + ')'
                    , fillStyle = 'hsla(0, 50%, 50%, 1)'
                $.util.renderText($.ctxmg, round.toString(), $.cw / 2, $.ch / 2, 'bold 200pt Helvetica', fillStyle, 'center')
            } else {
                $.levelStarted = true
                $.audioManager.play('start')
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
                $.audioManager.play('win')
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

$.moveToIndex = function(currentIndex, newIndex) {
    if (newIndex < 0 || newIndex >= $.level.rows * $.level.cols) {
        return
    }
    if ((newIndex + 1)%$.level.cols == 1  && (currentIndex + 1)%$.level.cols == 0 || (newIndex + 1)%$.level.cols == 0 && (currentIndex + 1)%$.level.cols == 1) {
        return
    }
    var newCircle = $.circles[newIndex]
    if (newCircle && newCircle.end == true) {
        // check end condition
        $.goForward(newCircle)
        if (!$.checkWinCondition()) {
            // don't need to check because you can't attempt to go to the same circle twice
            // without letting go of the arrow button
            $.audioManager.play('wrong')
            $.goBack($.selectedCircle.prev)
        } else {
            // play winning sound
        }
    } else if (newCircle.next == $.selectedCircle) {
        // user pressed back to previously selected circle, so 
        // newCircle.next == selectedCircle
        $.goBack(newCircle)
        $.audioManager.play('connect')
    } else if (newCircle.next == null) {
        // user selects to go to unvisited circle
        if (newCircle.preset == true) {
            // special logic for presets:
            // - If not forced then make sure entering on start/stop
            // - If forced make sure entering from start
            if (newCircle.forced == true && newCircle.presetPrev == null) {
                $.goForward(newCircle)
                $.audioManager.play('connect')
            } else if (newCircle.forced == false && 
                    (newCircle.presetPrev == null || newCircle.presetNext == null)) {
                $.goForward(newCircle)
                $.audioManager.play('connect')
            } else {
                $.audioManager.play('wrong')
            }
        } else {
            $.goForward(newCircle)
            $.audioManager.play('connect')
        }
    } else {
        $.audioManager.play('wrong')
    }
    $.toCircle = newCircle
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
        , diff = Math.abs(to.index - from.index)

    // TODO: make movement possible across different diffs
    if (diff != 1 && diff != $.level.cols) {
        $.playIncorrectMoveSound(to)
    } else if ((to.index + 1)%$.level.cols == 1  && (from.index + 1)%$.level.cols == 0 || (to.index + 1)%$.level.cols == 0 && (from.index + 1)%$.level.cols == 1){
        $.playIncorrectMoveSound(to)
    } else if (to.end == true) {
        $.goForwardOneCircle(to)
        if (!$.checkWinCondition()) {
            $.goBackOneCircle(from)
            $.playIncorrectMoveSound(to)
        } else {
            // play winning sound
        }
    } else if (to.next == from) {
        // user pressed back to previously selected circle, so 
        // newCircle.next == selectedCircle
        $.goBackOneCircle(to)
        $.audioManager.play('connect')
    } else if (to.next == null) {
        var canMove = $.canMoveToCircle(from, to)
        if (canMove) {
            $.goForwardOneCircle(to)
            $.audioManager.play('connect')
        } else {
            $.playIncorrectMoveSound(to)
        }
    } else {
        $.playIncorrectMoveSound(to)
    }

    $.toCircle = to
}

$.playIncorrectMoveSound = function(to) {
    if (to == $.toCircle) {
        return
    }
    
    $.audioManager.play('wrong')
}

// Mouse has different movement handling than keyboard
$.handleEvents = function() {
    if ($.keys.pressed.up) {
        $.moveToIndex($.selectedCircle.index, $.selectedCircle.index - $.level.cols)
    } else if ($.keys.pressed.down) {
        $.moveToIndex($.selectedCircle.index, $.selectedCircle.index + $.level.cols)
    } else if ($.keys.pressed.left) {
        $.moveToIndex($.selectedCircle.index, $.selectedCircle.index - 1)
    } else if ($.keys.pressed.right) {
        $.moveToIndex($.selectedCircle.index, $.selectedCircle.index + 1)
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
