(function() {
    function setup() {
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
    
    function drawLevelId() {
        var levelId = $.definitions.levels[$.levelGroup].title + " - " + $.levelNumber,
            fillStyle = 'hsla(0, 50%, 50%, 1)'
        $.util.renderText($.ctxmg, levelId, $.bottomBar.width / 2,
                $.bottomBar.y + ($.bottomBar.height / 2), 'bold 40pt Helvetica', fillStyle, 'center')
    }
    
    function render() {
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
            drawLevelId();
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

    $.definitions.states['play'] = {
        setup: function() {setup();},
        render: function() {render();}
    }
})();
