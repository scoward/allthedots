$.LevelSelectScene = function() {
    return this
}

$.LevelSelectScene.prototype = {
    director: null,
    scene: null,
    levelButtons: [],
    backButton: null,
    nextSetButton: null,
    prevSetButton: null,

    setButtonNumbers: function() {
        var self = this
            , level = null
            , button = null
            , levels = $.definitions.levels[$.levelGroup].levels
        for (var i = 0; i < 5; i++) {
            // TODO: this doesn't need to be a loop, use mod
            for (var j = 0; j < 5 && i * 5 + j + 25 * $.levelSet < levels.length; j++) {
                level = i * 5 + j + 1 + 25 * $.levelSet
                button = self.levelButtons[i * 5 + j]
                button.setNumber(level)        
            }
        }
    },
    
    buttonPressed: function(levelNumber) {
        console.log("Pressed: " + levelNumber)
    },
    
    drawButtons: function() {
        var self = this
            , numbersImage = new CAAT.SpriteImage().initialize(self.director.getImage('numbers'), 1, 10)
            , circleImage = self.director.getImage('blackcircle')
            , backImage = self.director.getImage('backbutton')
            , nextImage = self.director.getImage('nextbutton')
            , levels = $.definitions.levels[$.levelGroup].levels
            , level = null
            , rowStep = $.gameScreen.height / 5
            , colStep = $.gameScreen.width / 5
            , y = $.gameScreen.y + rowStep / 2 - circleImage.height / 2
            , scale = ($.gameScreen.width / 5) / circleImage.width
            
        // draw level buttons
        for (var i = 0; i < 5; i++) {
            var x = colStep / 2 - circleImage.width / 2
            // TODO: this doesn't need to be a loop, use mod
            for (var j = 0; j < 5 && i * 5 + j + 25 * $.levelSet < levels.length; j++) {
                level = i * 5 + j + 1 + 25 * $.levelSet
                var button = new $.LevelButton()
                button.initialize(level, numbersImage, circleImage)
                button.setLocation(x, y)
                button.setScale(scale, scale)
                button.setCallback(self.buttonPressed)
                self.scene.addChild(button)
                self.levelButtons.push(button)
                x += colStep
            }
            y += rowStep
        }
        
        // draw back button
        backButton = new CAAT.Actor().setAsButton(backImage, 0, 0, 0, 0, function() {
            var toScene = self.director.getSceneIndex($.groupSelScene.scene)
                , fromScene = self.director.getSceneIndex(self.scene)

            self.reset()
            self.director.setScene(toScene)
        })
        backButton.setLocation($.bottomBar.x, $.bottomBar.y)
        self.scene.addChild(backButton)
        
        // draw direction buttons
        prevSetButton = new CAAT.Actor().setAsButton(backImage, 0, 0, 0, 0, function() {
            if ($.levelSet != 0 && $.levelSet - 1 > -1) {
                $.levelSet--
                self.setButtonNumbers()
            }
        })
        prevSetButton.setLocation($.topBar.x, $.topBar.y)
        self.scene.addChild(prevSetButton)

        var levelSets = Math.ceil(levels.length / 25) // Display up to 25 levels per page
        nextSetButton = new CAAT.Actor().setAsButton(nextImage, 0, 0, 0, 0, function() {
            if ($.levelSet + 1 < levelSets) {
                $.levelSet++
                self.setButtonNumbers()
            }
        })
        nextSetButton.setLocation($.topBar.width - nextImage.width, $.topBar.y)
        self.scene.addChild(nextSetButton)
    },

    reset: function() {
        var self = this
        self.levelButtons = []
        self.scene.emptyChildren()
    },
    
    create: function(director) {
        var self = this
        self.director = director
        self.scene = director.createScene()

        self.scene.activated = function() {
            self.drawButtons()
        }

        return this
    },
}
