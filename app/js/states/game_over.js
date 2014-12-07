(function() {
    function setup() {
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
            
        _scores.getLevelStats($.level.id, function(stats) {
            $.stats = stats;
        });
        _scores.levelComplete($.level.id, $.lt - $.st)
    }
    
    function render() {
        $.clearScreen();
        $.drawBottomBar()

        var levelTime = ($.lt - $.st) / 1000
            , fillStyle = 'hsla(0, 50%, 50%, 1)'
        $.util.renderText($.ctxmg, levelTime.toFixed(2), $.cw / 2, 100, 'bold 40pt Helvetica', fillStyle, 'center')
        
        if ($.stats !== null) {
            if ($.stats.tries > 0 && $.stats.worldAvg != 0) {
                var avgTime = ($.stats.worldAvg) / 1000
                $.util.renderText($.ctxmg, "Avg: " + avgTime.toFixed(2), $.cw / 2, 200, 'bold 40pt Helvetica', fillStyle, 'center')
            } else {
                $.util.renderText($.ctxmg, "No level stats ATM", $.cw / 2, $.ch / 2, 'bold 40pt Helvetica', fillStyle, 'center')
            }
        } else {
            // maybe spinner?
        }
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }

    $.definitions.states['game_over'] = {
        setup: function() {setup();},
        render: function() {render();}
    }
})();
