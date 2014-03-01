$.StartScene = function() {
    return this
}

$.StartScene.prototype = {
    director: null,
    scene: null,
    index: 0,

    createMenuButtons: function() {

    },

    create: function(director) {
        var self = this
        self.director = director
        self.scene = director.createScene()

        var levels = new CAAT.Actor()
            .setLocation(20, 20)
            .setAsButton(director.getImage('levels'), 0, 0, 0, 0, 
                function() { 
                    var toScene = self.director.getSceneIndex($.groupSelScene.scene)
                        , fromScene = self.director.getSceneIndex(self.scene)

                    director.setScene(toScene)
                }
            )

        self.scene.addChild(levels)
        
        return this
    }
}
