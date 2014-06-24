(function() {
    function setup() {
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
    
    function render() {
        $.clearScreen();
        $.drawBottomBar()

        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }

    $.definitions.states['level_group_select'] = {
        setup: function() {setup();},
        render: function() {render();}
    }
})();
