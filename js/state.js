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
        
        x = startingX
        y = $.ch - padding - $.buttonHeight
        var button = new $.Button({
            title: 'MAIN',
            x: x + $.buttonWidth / 2,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
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
            , padding = 10
            , x = startingX
            , y = 30
            , levels = $.definitions.levels[$.levelGroup]

        for (var i = 0; i < levels.length; i++) {
            level = levels[i]
            var button = new $.Button({
                title: '',
                level: level,
                x: x + $.buttonWidth / 2,
                y: y + $.buttonHeight / 2,
                lockedWidth: $.buttonWidth,
                lockedHeight: $.buttonHeight,
                action: function() {
                    $.reset()
                    $.loadLevel(this.level)
                    $.setState('play')
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
        
        x = startingX
        y = $.ch - padding - $.buttonHeight
        var button = new $.Button({
            title: 'LEVELS',
            x: x + $.buttonWidth / 2,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
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

        var button = new $.Button({
            title: 'QUIT',
            x: x + $.buttonWidth / 2,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.reset()
                $.setState('level_select')
            },
        })
        $.buttons.push(button)

        x = $.cw - 30 - $.buttonWidth
        var button = new $.Button({
            title: 'RESTART',
            x: x + $.buttonWidth / 2,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.reset()
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
            
        var button = new $.Button({
            title: 'REPLAY',
            x: x,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.reset()
                $.loadLevel($.level)
                $.setState('play')
            },
        })
        $.buttons.push(button)
            
        y += padding + $.buttonHeight
        button = new $.Button({
            title: 'LEVELS',
            x: x,
            y: y + $.buttonHeight / 2,
            lockedWidth: $.buttonWidth,
            lockedHeight: $.buttonHeight,
            action: function() {
                $.reset()
                $.setState('levels')
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
                $.reset()
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
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
    
    $.states['levels'] = function() {
        $.clearScreen();
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }

    $.states['level_select'] = function() {
        $.clearScreen();
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
    
    $.states['game_over'] = function() {
        $.clearScreen();

        var levelTime = ($.elapsed * (1000 / 60)) / 1000
            , fillStyle = 'hsla(0, 50%, 50%, 1)'
        $.util.renderText($.ctxmg, levelTime.toFixed(2), $.cw / 2, 100, 'bold 40pt Helvetica', fillStyle)
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }
    
    $.states['play'] = function() {
        $.clearScreen()
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
