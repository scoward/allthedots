$.setState = function(state) {
    $.buttons.length = 0;

    if (state == 'menu') {
        $.mouse.down = 0

        var levelsButton = new $.Button({
            title: 'LEVELS',
            x: $.cw / 2,
            y: $.ch / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.setState('levels')
            },
        })
        $.buttons.push(levelsButton)
    } 
    else if (state == 'levels') {
        $.drawBottomBar()
        $.mouse.down = 0
        var level
            , startingX = 30
            , padding = 10
            , x = startingX
            , y = 30

        for (var key in $.definitions.levels) {
            level = $.definitions.levels[key]
            var button = new $.Button({
                title: key,
                x: x + $.buttonWidth / 2,
                y: y + $.buttonHeight / 2,
                lockedWidth: $.buttonWidth,
                lockedHeight: $.buttonHeight,
                action: function() {
                    $.levelGroup = this.title
                    $.setState('level_select')
                },
            })
            $.buttons.push(button)

            if (x + padding + 2 * $.buttonWidth < $.cw) {
                x += padding + $.buttonWidth
            } else {
                x = startingX
                y += padding + $.buttonHeight
            }
        }
        
        // back to Menu
        var button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.bottomButtonWidth / 2),
            y: ($.bottomBar.y + $.bottomButtonHeight / 2),
            lockedWidth: $.bottomButtonWidth,
            lockedHeight: $.bottomButtonHeight,
            action: function() {
                $.setState('menu')
            },
        })
        $.buttons.push(button) 
    } 
    else if (state == 'level_select') {
        $.mouse.down = 0
        var level
            , startingX = 30
            , padding = 50
            , x = startingX
            , y = 30
            , levels = $.definitions.levels[$.levelGroup]

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
        
        // back to Levels
        var button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.bottomButtonWidth / 2),
            y: ($.bottomBar.y + $.bottomButtonHeight / 2),
            lockedWidth: $.bottomButtonWidth,
            lockedHeight: $.bottomButtonHeight,
            action: function() {
                $.setState('levels')
            },
        })
        $.buttons.push(button)
    }
    else if (state == 'play') {
        $.countdownStart = Date.now()
        $.levelStarted = false
        
        var x = 30
            , padding = 10
            , y = $.ch - padding - $.buttonHeight

        // back to Level Select
        var button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.bottomButtonWidth / 2),
            y: ($.bottomBar.y + $.bottomButtonHeight / 2),
            lockedWidth: $.bottomButtonWidth,
            lockedHeight: $.bottomButtonHeight,
            action: function() {
                $.setState('level_select')
            },
        })
        $.buttons.push(button)

        // Restart level
        var button = new $.Button({
            type: 'restart',
            x: ($.bottomBar.x + $.bottomButtonWidth * 1.5),
            y: ($.bottomBar.y + $.bottomButtonHeight / 2),
            lockedWidth: $.bottomButtonWidth,
            lockedHeight: $.bottomButtonHeight,
            action: function() {
                $.countdownStart = Date.now()
                $.loadLevel($.level)
            },
        })
        $.buttons.push(button)
    }
    else if (state == 'game_over') {
        $.mouse.down = 0
        var level
            , padding = 10
            , x = $.cw / 2
            , y = $.ch - 3 * (padding + $.buttonHeight)
        
        // Restart level
        var button = new $.Button({
            type: 'restart',
            x: ($.bottomBar.x + $.bottomButtonWidth * 1.5),
            y: ($.bottomBar.y + $.bottomButtonHeight / 2),
            lockedWidth: $.bottomButtonWidth,
            lockedHeight: $.bottomButtonHeight,
            action: function() {
                $.loadLevel($.level)
                $.setState('play')
            },
        })
        $.buttons.push(button)
        
        // Back to Level Select
        button = new $.Button({
            type: 'back',
            x: ($.bottomBar.x + $.bottomButtonWidth / 2),
            y: ($.bottomBar.y + $.bottomButtonHeight / 2),
            lockedWidth: $.bottomButtonWidth,
            lockedHeight: $.bottomButtonHeight,
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
    }
    
    $.states['game_over'] = function() {
        $.clearScreen();
                $.drawBottomBar()


        var levelTime = ($.elapsed * (1000 / 60)) / 1000
            , fillStyle = 'hsla(0, 50%, 50%, 1)'
        $.util.renderText($.ctxmg, levelTime.toFixed(2), $.cw / 2, 100, 'bold 40pt Helvetica', fillStyle)
        
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
                $.util.renderText($.ctxmg, round.toString(), $.cw / 2, $.ch / 2, 'bold 200pt Helvetica', fillStyle)
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
                $.util.renderText($.ctxmg, timerSeconds.toFixed(2), $.cw / 2, 100, 'bold 40pt Helvetica', fillStyle)
            }
        }

        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
}
