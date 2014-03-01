$.GroupSelectScene = function() {
    return this
}

$.GroupSelectScene.prototype = {
    director: null,
    scene: null,

    createMenuButtons: function() {

    },

    create: function(director) {
        var self = this
            , backImage = director.getImage('backbutton')
        self.director = director
        self.scene = director.createScene()

        var button = new CAAT.Actor()
            .setLocation(20, 40)
            .setAsButton(director.getImage('4x4'), 0, 0, 0, 0, function() { 
                var toScene = self.director.getSceneIndex($.levelSelScene.scene)
                    , fromScene = self.director.getSceneIndex(self.scene)
                $.levelGroup = 0
                $.levelSet = 0

                director.setScene(toScene)
            })
        self.scene.addChild(button)
            
        button = new CAAT.Actor()
            .setLocation(20, 80)
            .setAsButton(director.getImage('5x5'), 0, 0, 0, 0, function() { 
                var toScene = self.director.getSceneIndex($.levelSelScene.scene)
                    , fromScene = self.director.getSceneIndex(self.scene)
                $.levelGroup = 1
                $.levelSet = 0
                
                director.setScene(toScene)
            })
        self.scene.addChild(button)

        button = new CAAT.Actor()
            .setLocation(20, 120)
            .setAsButton(director.getImage('6x6'), 0, 0, 0, 0, function() { 
                var toScene = self.director.getSceneIndex($.levelSelScene.scene)
                    , fromScene = self.director.getSceneIndex(self.scene)
                $.levelGroup = 2
                $.levelSet = 0

                director.setScene(toScene)
            })
        self.scene.addChild(button)
        
        button = new CAAT.Actor()
            .setLocation(20, 160)
            .setAsButton(director.getImage('7x7'), 0, 0, 0, 0, function() { 
                var toScene = self.director.getSceneIndex($.levelSelScene.scene)
                    , fromScene = self.director.getSceneIndex(self.scene)
                $.levelGroup = 3
                $.levelSet = 0

                director.setScene(toScene)
            })
        self.scene.addChild(button)

        // draw back button
        button = new CAAT.Actor().setAsButton(backImage, 0, 0, 0, 0, function() {
            var toScene = self.director.getSceneIndex($.startScene.scene)
                , fromScene = self.director.getSceneIndex(self.scene)

            self.director.setScene(toScene)
        })
        button.setLocation($.bottomBar.x, $.bottomBar.y)
        self.scene.addChild(button)

        
        return this
    }
}
