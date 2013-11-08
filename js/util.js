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

$.util.line = function(ctx, sx, sy, ex, ey, stroke) {
    ctx.beginPath()
    ctx.moveTo(sx, sy)
    ctx.lineTo(ex, ey)
    ctx.lineWidth = 2
    ctx.strokeStyle = stroke
    ctx.stroke()
}

/*==============================================================================
 * Symbols
 * ==============================================================================*/
$.util.drawBackArrow = function (sx, cx, ex, sy, cy, ey) {
    var startX = (sx + cx) / 2
        , endX = (cx + ex) / 2
        , startY = (sy + cy) / 2
        , endY = (cy + ey) / 2
    $.util.line($.ctxmg, startX, cy, endX, cy, "black")
    $.util.line($.ctxmg, startX, cy, cx, startY, "black")
    $.util.line($.ctxmg, startX, cy, cx, endY, "black")
};

$.util.drawRestartSymbol = function (ctx, sx, cx, cy) {
    var radius = (cx - sx) / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, $.pi * .5, 0, false);
    ctx.strokeStyle = "black";
    ctx.stroke();

    $.util.line($.ctxmg, cx + radius, cy, cx + radius / 2, cy - radius / 2, "black")
    $.util.line($.ctxmg, cx + radius, cy, cx + radius * 1.25, cy - radius / 2, "black")
};
