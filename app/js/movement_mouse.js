$.playIncorrectMoveSound = function(to) {
    if (to == $.toCircle) {
        return
    }
    $.audioManager.play('wrong')
}

$.touchMoveToCircle = function(to) {
    var from = $.selectedCircle
        , diff = Math.abs(to.index - from.index)

    // TODO: make movement possible across different diffs
    if (diff != 1 && diff != $.level.cols) {
        $.playIncorrectMoveSound(to)
    } else if ((to.index + 1)%$.level.cols == 1  && (from.index + 1)%$.level.cols == 0 || (to.index + 1)%$.level.cols == 0 && (from.index + 1)%$.level.cols == 1){
        $.playIncorrectMoveSound(to)
    } else if (to.end == true) {
        $.goForwardOneCircle(to)
        if (!$.checkWinCondition()) {
            $.goBackOneCircle(from)
            $.playIncorrectMoveSound(to)
        } else {
            // play winning sound
        }
    } else if (to.next == from) {
        // user pressed back to previously selected circle, so 
        // newCircle.next == selectedCircle
        $.goBackOneCircle(to)
        $.audioManager.play('connect')
    } else if (to.next == null) {
        var canMove = $.canMoveToCircle(from, to)
        if (canMove) {
            $.goForwardOneCircle(to)
            $.audioManager.play('connect')
        } else {
            $.playIncorrectMoveSound(to)
        }
    } else {
        $.playIncorrectMoveSound(to)
    }

    $.toCircle = to
}
