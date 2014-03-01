$.GenericButton = function() {
    $.GenericButton.superclass.constructor.call(this)
    return this
}

$.GenericButton.prototype = {
    bgImage: null,
    
    /*
     * Just set bgImage and apply action as the click callback
     */
    initialize: function(bgImage, action) {
        var self = this
        self.setBackgroundImage(bgImage)
        self.setAsButton(null, null, null, null, null, action)
        
        return this
    },
}

extend($.GenericButton, CAAT.Actor)
