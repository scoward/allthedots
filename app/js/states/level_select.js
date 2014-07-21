(function() {
    function setup() {
        var level
            , levelNumber
            , levels = $.definitions.levels[$.levelGroup].levels
            , levelSets = Math.ceil(levels.length / 30) // Display up to 30 levels per page
            , colStep = $.gameScreen.width / 6
            , rowStep = $.gameScreen.height / 5

        var index = 0
            , y = $.gameScreen.y + rowStep / 2 - rowStep / 8
            , diameter = $.getCircleDiameter(colStep, rowStep) * 1.8
        for (var row = 0; row < 5; row++) {
            var x = colStep / 2
            for (var col = 0; col < 6; col++) {
                index = 6 * row + col
                level = levels[index + 30 * $.levelSet]
                levelNumber = index + 1 + 30 * $.levelSet
                button = new $.Button({
                    title: levelNumber,
                    type: "level",
                    level: level,
                    x: x,
                    y: y + rowStep / 2,
                    lockedWidth: diameter,
                    lockedHeight: diameter,
                    action: function() {
                        $.loadLevel(this.level)
                        $.levelNumber = levelNumber
                        $.setState('play')
                    },
                })
                $.buttons.push(button)
                x += colStep
            }
            y += rowStep
        }

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
    
    function render() {
        $.clearScreen();
        $.drawBottomBar()
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}

        // draw level name
        $.util.renderText($.ctxmg, $.definitions.levels[$.levelGroup].title, $.topBar.width / 2, 
                $.topBar.y + ($.topBar.height / 2), 'bold 32pt Helvetica', $.blackFillStyle, 'center')
    }
    
    $.definitions.states['level_select'] = {
        setup: function() {setup();},
        render: function() {render();}
    }
})();
