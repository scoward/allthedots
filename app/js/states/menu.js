(function() {
    function setup() {
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
    
    function render() {
        $.clearScreen();
        $.drawBottomBar()
        
        var i = $.buttons.length; while (i--) {$.buttons[i].update(i)}
            i = $.buttons.length; while (i--) {$.buttons[i].render(i)}
    }

    $.definitions.states['menu'] = {
        setup: function() {setup();},
        render: function() {render();}
    }
})();
