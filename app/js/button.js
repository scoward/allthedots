$.Button = function(opt) {
    for (var k in opt) {
        this[k] = opt[k]
    }
    
    this.width = this.lockedWidth
    this.height = this.lockedHeight
    
    this.sx = this.x - this.width / 2
    this.sy = this.y - this.height / 2
    this.cx = this.x;
    this.cy = this.y;
    this.ex = this.x + this.width / 2 // ending x
    this.ey = this.y + this.height / 2 // ending y
    this.hovering = 0
    this.ohovering = 0 // oldhovering
}

$.Button.prototype.update = function() {
    this.ohovering = this.hovering
    if ($.util.pointInRect($.mouse.sx, $.mouse.sy, this.sx, this.sy, this.width, this.height)) {
        this.hovering = 1;
        if (!this.ohovering) {
            // play hovering sound
        }
    } else {
        this.hovering = 0
    }
    
    if (this.hovering && $.mouse.click) {
        // play click sound
        this.action()
    }
}

$.Button.prototype.render = function(i) {
    if (this.type && this.type == "level") {
        if (this.hovering) {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 10%, 1)'
            $.util.fillCircle($.ctxmg, this.cx, this.cy, this.width / 1.5)
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 0%, 1)'
            $.util.strokeCircle($.ctxmg, this.cx, this.cy, this.width / 1.5)
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 100%, 0.2)'
            $.util.strokeCircle($.ctxmg, this.cx, this.cy, this.width / 1.5)
        } else {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 0%, 1)'
            $.util.fillCircle($.ctxmg, this.cx, this.cy, this.width / 2)
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 0%, 1)'
            $.util.strokeCircle($.ctxmg, this.cx, this.cy, this.width / 2)
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 100%, 0.15)'
            $.util.strokeCircle($.ctxmg, this.cx, this.cy, this.width / 2)
        }
    } else if (this.type) {
        if (this.hovering) {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 90%, 1)'
            $.ctxmg.fillRect(Math.floor(this.sx), Math.floor(this.sy), this.width, this.height);
        } else {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 1)'
            $.ctxmg.fillRect(Math.floor(this.sx), Math.floor(this.sy), this.width, this.height);
        }
        if (this.type == 'back') {
            $.util.drawBackArrow(this.sx, this.sy, this.cx, this.cy, this.ex, this.ey)
        }

        if (this.type == 'restart') {
            $.util.drawRestartSymbol($.ctxmg, this.sx, this.cx, this.cy)
        }
        
        if (this.type == 'next') {
            $.util.drawNextArrow(this.sx, this.sy, this.cx, this.cy, this.ex, this.ey)
        }
    } else {
        if (this.hovering) {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 10%, 1)'
            $.ctxmg.fillRect(Math.floor(this.sx), Math.floor(this.sy), this.width, this.height);
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 0%, 1)'
            $.ctxmg.strokeRect(Math.floor(this.sx) + 0.5, Math.floor(this.sy) + 0.5, this.width - 1, this.height - 1, 1)
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 100%, 0.2)'
            $.ctxmg.strokeRect(Math.floor(this.sx) + 1.5, Math.floor(this.sy) + 1.5, this.width - 3, this.height - 3, 1)
        } else {
            $.ctxmg.fillStyle = 'hsla(0, 0%, 0%, 1)'
            $.ctxmg.fillRect(Math.floor(this.sx), Math.floor(this.sy), this.width, this.height);
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 0%, 1)'
            $.ctxmg.strokeRect(Math.floor(this.sx) + 0.5, Math.floor(this.sy) + 0.5, this.width - 1, this.height - 1, 1)
            $.ctxmg.strokeStyle = 'hsla(0, 0%, 100%, 0.15)'
            $.ctxmg.strokeRect(Math.floor(this.sx) + 1.5, Math.floor(this.sy) + 1.5, this.width - 3, this.height - 3, 1)
        }
    }

    var fillStyle
    if (this.hovering) {
        fillStyle = 'hsla(0, 0%, 100%, 1)'
    } else {
        fillStyle = 'hsla(0, 0%, 100%, 0.7)'
    }
    if (this.title) $.util.renderText($.ctxmg, this.title, this.x, this.y, 'bold 30pt Helvetica', fillStyle, 'center')
    
    $.ctxmg.fillStyle = 'hsla(0, 0%, 100%, 0.07)';
    if (!this.type) $.ctxmg.fillRect(Math.floor(this.sx) + 2, Math.floor(this.sy) + 2, this.width - 4, Math.floor((this.height - 4) / 2));
}
