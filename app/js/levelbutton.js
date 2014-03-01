$.LevelButton = function() {
    $.LevelButton.superclass.constructor.call(this)
    this.setGlobalAlpha(true)
    return this
}

$.LevelButton.prototype = {
    container: null,
    digits: null,
    digitsContainer: null,
    levelNumber: null,
    numbers: null,
    scale: null,
    callback: null,
    
    initialize: function(levelNumber, numbersImage, circleImage) {
        var self = this
            
        self.setBackgroundImage(circleImage)
        self.numbersImage = numbersImage
        self.levelNumber = levelNumber
        self.digitsContainer = new CAAT.ActorContainer()
            .setBounds(0, 0, self.width, self.height)
        self.addChild(self.digitsContainer)
        
        self.setNumber(levelNumber) 
        
        self.enableEvents(true)
        self.mouseClick = function(mouseEvent) {
            self.clicked()
        }
        
        return self
    },
    
    clicked: function(mouseEvent) {
        if (self.callback != null) {
            self.callback()
        }
    },
    
    setCallback: function(func) {
        self.callback = func
    },
    
    setNumber: function(levelNumber) {
        var self = this
            
        self.digitsContainer.emptyChildren()
        self.digits = []

        var numString = levelNumber + ""
        // TODO: fix 3 as it's nothing particular
        var startX = self.width / 2 - (self.numbersImage.singleWidth / 3) * numString.length
        var startY = self.height / 2 - (self.numbersImage.singleHeight / 2)
        var stepX = self.numbersImage.singleWidth / 2

        for (var i = 0; i < numString.length; i++) {
            var digit = new CAAT.Actor()
                .setBackgroundImage(self.numbersImage.getRef(), true)
                .setLocation(startX, startY)

            digit.setSpriteIndex(parseInt(numString[i]))
            self.digits.push(digit)
            self.digitsContainer.addChild(digit)
            startX += stepX
        }
        
        return self
    },
    
    setScale: function(x, y) {
        var self = this
        self.scale = x
        $.LevelButton.superclass.setScale.call(self, x, y)
    },
    
    mouseEnter: function(mouseEvent) {

    },

    mouseExit: function(mouseEvent) {

    },
    
    mouseDown: function(mouseEvent) {

    },
}

extend($.LevelButton, CAAT.ActorContainer)
