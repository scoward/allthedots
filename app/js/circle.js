$.Circle = function(opt) {
    for (var k in opt) {
        this[k] = opt[k]
    }
    
    this.boundingDiam = this.radius * 2
    this.boundingDiam += this.boundingDiam / 2
    this.sx = this.x - this.radius
    this.sy = this.y - this.radius
}

$.Circle.prototype.pointIntersects = function(px, py) {
    return $.util.pointInRect(px, py, this.sx, this.sy, this.boundingDiam, this.boundingDiam)
}

$.Circle.prototype.render = function() {
    if (this.selected) {
        $.util.fillCircle($.ctxmg, this.x, this.y, this.radius, $.selectedFillStyle)
    } else if (this.start) {
        $.util.fillCircle($.ctxmg, this.x, this.y, this.radius, $.startingFillStyle)
    } else if (this.end) {
        $.util.fillCircle($.ctxmg, this.x, this.y, this.radius, $.endingFillStyle)
    } else {
        $.util.fillCircle($.ctxmg, this.x, this.y, this.radius, $.defaultFillStyle)
    }
}
