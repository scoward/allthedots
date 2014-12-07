$.setupPresets = function() {
    var array = $.level.presets
    if (array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            var presetObject = array[i]
                , presetArray = presetObject.array
                , circle = presetArray[0]
                , from = $.circles[circle]
            for (var j = 1; j < presetArray.length; j++) {
                circle = presetArray[j] 
                var to = $.circles[circle]
                
                from.preset = true 
                from.forced = presetObject.forced
                to.preset = true 
                to.forced = presetObject.forced
                from.presetNext = to
                to.presetPrev = from
                $.presets.push(from)
                
                from = to
            }
        }
    }
}

$.drawPresets = function() {
    for (var i = 0; i < $.presets.length; i++) {
        var circle = $.presets[i]
        $.util.line($.ctxmg, circle.x, circle.y, circle.presetNext.x, circle.presetNext.y, $.presetStrokeStyle)
        if (circle.forced == true) {
            // draw arrows for forced preset
            $.drawArrow(circle.x, circle.y, circle.presetNext.x, circle.presetNext.y, $.arrowStrokeStyle)
        }
    }
}

$.drawArrow = function(startX, startY, endX, endY, stroke) {
    var x = 0, y = 0
    $.ctxmg.beginPath()
    if (startX != endX) {
        var left = true
        y = startY
        if (startX < endX) {
            x = startX + ($.colStep / 2)
            left = false
        } else {
            x = endX + ($.colStep / 2)
        }

        if (left) {
            $.ctxmg.moveTo(x + $.circleRadius, y - $.circleRadius)
            $.ctxmg.lineTo(x - $.circleRadius, y)
            $.ctxmg.lineTo(x + $.circleRadius, y + $.circleRadius)
        } else {
            $.ctxmg.moveTo(x - $.circleRadius, y - $.circleRadius)
            $.ctxmg.lineTo(x + $.circleRadius, y)
            $.ctxmg.lineTo(x - $.circleRadius, y + $.circleRadius)
        }
    } else {
        var up = true
        x = startX
        if (startY < endY) {
            y = startY + ($.rowStep / 2)
            up = false
        } else {
            y = endY + ($.rowStep / 2)
        }
        
        if (up) {
            $.ctxmg.moveTo(x - $.circleRadius, y + $.circleRadius)
            $.ctxmg.lineTo(x, y - $.circleRadius)
            $.ctxmg.lineTo(x + $.circleRadius, y + $.circleRadius)
        } else {
            $.ctxmg.moveTo(x - $.circleRadius, y - $.circleRadius)
            $.ctxmg.lineTo(x, y + $.circleRadius)
            $.ctxmg.lineTo(x + $.circleRadius, y - $.circleRadius)
        }
    }
    $.ctxmg.strokeStyle=stroke
    $.ctxmg.stroke()
}


