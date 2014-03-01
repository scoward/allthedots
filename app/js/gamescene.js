$.GameScene = function() { 
    return this
}

$.GameScene.prototype = {
    director: null,
    scene: null,
    
    create: function(director) {
        var self = this
        self.director = director
        self.scene = director.createScene()

        return this
    }
}
