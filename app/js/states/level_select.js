(function() {
    function setup() {
        var level
            , levelNumber
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
            levelNumber = i + 1 + 30 * $.levelSet
            var button = new $.Button({
                title: levelNumber,
                type: "level",
                level: level,
                x: x + $.circleButtonWidth / 2,
                y: y + $.circleButtonHeight / 2,
                lockedWidth: $.circleButtonWidth,
                lockedHeight: $.circleButtonHeight,
                action: function() {
                    $.loadLevel(this.level)
                    $.levelNumber = levelNumber
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
