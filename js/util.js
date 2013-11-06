$.util = {}
$.pi = Math.PI
$.twopi = $.pi * 2

/*==============================================================================
 * Calcs
 * ==============================================================================*/
$.util.pointInRect = function(px, py, rx, ry, rw, rh) {
    return (px >= rx && px <= rx + rw && py >= ry && py <= ry + rh)
}

/*==============================================================================
* Renders
* ==============================================================================*/
$.util.renderText = function(ctx, text, x, y, font, fillStyle) {
    ctx.fillStyle = fillStyle
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x, y)
}

/*==============================================================================
 * Shapes
 * ==============================================================================*/
$.util.circle = function( ctx, x, y, radius ) {
    var radius = radius <= 0 ? 1 : radius;
    ctx.beginPath();
    ctx.arc( x, y, radius, 0, $.twopi, false );
};

$.util.fillCircle = function( ctx, x, y, radius, fillStyle ) {  
    $.util.circle( ctx, x, y, radius );
    ctx.fillStyle = fillStyle;
    ctx.fill();
};

$.util.strokeCircle = function( ctx, x, y, radius, strokeStyle, lineWidth ) {
    $.util.circle( ctx, x, y, radius );
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
};
