// only send if not in end condition or going backward
$.canMoveToCircle = function(from, to) {
    if (from.preset == true) {
        if (from.forced == true) {
            // end of forced string
            if (from.presetNext != null && from.presetNext != to) {
                return false
            }
        } else {
            if (from.presetNext != null && from.presetPrev != null) {
                if (from.prev != null) {
                    if (from.presetNext == from.prev) {
                        return from.presetPrev == to
                    } else {
                        return from.presetNext == to
                    }
                } else if (from.next != null) {
                    if (from.presetNext == from.next) {
                        return from.presetPrev == to
                    } else {
                        return from.presetNext == to
                    }
                }
            } else if (from.presetNext != null) {
                if (from.presetNext != from.prev) {
                    return from.presetNext == to
                }
            } else if (from.presetPrev != null) {
                if (from.presetPrev != from.prev) {
                    return from.presetPrev == to
                }
            }
        }
    } else if (to.preset == true) {
        if (to.forced == true) {
            // must hit beginning of forced array
            if (to.presetPrev != null) {
                return false
            }
        } else {
            // can't enter middle of preset array
            if (to.presetPrev != null && to.presetNext != null) {
                return false
            }
        }
    }
    return true
}

$.goBackOneCircle = function(backCircle) {
    backCircle.selected = true
    $.selectedCircle.selected = false
    $.selectedCircle.prev = null
    backCircle.next = null
    $.selectedCircle = backCircle
}

$.goBack = function(backCircle) {
    var startingFrom = $.selectedCircle
    $.goBackOneCircle(backCircle)
    // Only go back on presets if pressing back at the beginning of a preset
    while ($.selectedCircle.preset != null && startingFrom.preset != null &&
            (startingFrom == $.selectedCircle.presetNext ||
             startingFrom == $.selectedCircle.presetPrev)) {
        startingFrom = $.selectedCircle
        $.goBackOneCircle($.selectedCircle.prev)
    }
}

$.goForwardOneCircle = function(forwardCircle) {
    forwardCircle.prev = $.selectedCircle
    $.selectedCircle.next = forwardCircle
    $.selectedCircle.selected = false
    forwardCircle.selected = true
    $.selectedCircle = forwardCircle
}

$.goForward = function(forwardCircle) {
    $.goForwardOneCircle(forwardCircle)
    var direction
    while ($.selectedCircle.preset != null && forwardCircle != null) {
        forwardCircle = null
        if ($.selectedCircle.presetNext != null && (direction == null || direction == 1)) {
            forwardCircle = $.selectedCircle.presetNext
            direction = 1
        } else if ($.selectedCircle.presetPrev != null && (direction == null || direction == -1)) {
            forwardCircle = $.selectedCircle.presetPrev
            direction = -1
        }
        
        if (forwardCircle) {
            $.goForwardOneCircle(forwardCircle)
        }
    }
}

$.moveToIndex = function(currentIndex, newIndex) {
    if (newIndex < 0 || newIndex >= $.level.rows * $.level.cols) {
        return
    }
    if ((newIndex + 1)%$.level.cols == 1  && (currentIndex + 1)%$.level.cols == 0 || (newIndex + 1)%$.level.cols == 0 && (currentIndex + 1)%$.level.cols == 1) {
        return
    }
    var newCircle = $.circles[newIndex]
    if (newCircle && newCircle.end == true) {
        // check end condition
        $.goForward(newCircle)
        if (!$.checkWinCondition()) {
            // don't need to check because you can't attempt to go to the same circle twice
            // without letting go of the arrow button
            $.audioManager.play('wrong')
            $.goBack($.selectedCircle.prev)
        } else {
            // play winning sound
        }
    } else if (newCircle.next == $.selectedCircle) {
        // user pressed back to previously selected circle, so 
        // newCircle.next == selectedCircle
        $.goBack(newCircle)
        $.audioManager.play('connect')
    } else if (newCircle.next == null) {
        // user selects to go to unvisited circle
        if (newCircle.preset == true) {
            // special logic for presets:
            // - If not forced then make sure entering on start/stop
            // - If forced make sure entering from start
            if (newCircle.forced == true && newCircle.presetPrev == null) {
                $.goForward(newCircle)
                $.audioManager.play('connect')
            } else if (newCircle.forced == false && 
                    (newCircle.presetPrev == null || newCircle.presetNext == null)) {
                $.goForward(newCircle)
                $.audioManager.play('connect')
            } else {
                $.audioManager.play('wrong')
            }
        } else {
            $.goForward(newCircle)
            $.audioManager.play('connect')
        }
    } else {
        $.audioManager.play('wrong')
    }
    $.toCircle = newCircle
}
