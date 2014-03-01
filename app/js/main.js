$.init = function() {
    $.wrap = document.getElementById("wrap")
    $.wrapInner = document.getElementById("wrap-inner")
    $.canvas = document.getElementById("main")
    $.ctxmg = $.canvas.getContext("2d")
    var dims = $.getWidthHeight()
    $.cw = dims.width
    $.ch = dims.height
    $.wrap.style.width = $.wrapInner.style.width = $.cw + 'px'
    $.wrap.style.height = $.wrapInner.style.height = $.ch + 'px'
    $.wrap.style.marginLeft = (-$.cw / 2) - 10 + 'px'
    $.wrap.style.marginTop = (-$.ch / 2) - 10 + 'px'
    $.gameScreen = {
        x: 0
        , y: ($.ch - $.cw) / 2
        , height: $.cw
        , width: $.cw
    }
    $.bottomBar = {
        x: 0
        , y: Math.ceil($.ch - $.ch * .075) // 7.5% of screen
        , height: Math.ceil($.ch * .075)
        , width: $.cw
    }
    $.topBar = {
        x: 0
        , y: $.gameScreen.y - Math.ceil($.ch * .075)
        , height: Math.ceil($.ch * .075)
        , width: $.cw
    }
    $.barButtonWidth = $.bottomBar.height
    $.barButtonHeight = $.bottomBar.height

    // let's setup parse
    // TODO: Disable class creation before launch
    Parse.initialize('quDSRgEzAUVoCiAMZUmGJHcE32pb1BavT1QgH0KZ',
                     '9rEPleAPExWkHVIB5i8tjkX6hR2aqqhXXMBnse99')

    var devInfo = CocoonJS.App.getDeviceInfo()
    if (devInfo) {
        console.log("Device info", devInfo.imei, devInfo.odin, devInfo.openudid)
    }
    
    CAAT.setCoordinateClamping(false)
    CAAT.DEBUG = 1
    $.director = new CAAT.Foundation.Director()
    $.director.initialize(dims.width, dims.height, document.getElementById('main')).setClear(false)
    $.director.enableResizeEvents(CAAT.Director.prototype.RESIZE_PROPORTIONAL)
    $.director.audioManager.setAudioFormatExtensions(['wav', 'ogg', 'x-wav', 'mp3']) 
    // TODO take this out
    $.director.setClear(true)
    
    new CAAT.ImagePreloader().loadImages(
        [
            {id: 'levels', url: 'images/levelstest.png'}
            , {id: '4x4', url: 'images/4x4.png'}
            , {id: '5x5', url: 'images/5x5.png'}
            , {id: '6x6', url: 'images/6x6.png'}
            , {id: '7x7', url: 'images/7x7.png'}
            , {id: 'numbers', url: 'images/numbers.png'}
            , {id: 'blackcircle', url: 'images/circle.png'}
            , {id: 'backbutton', url: 'images/arrow.png'}
            , {id: 'nextbutton', url: 'images/nextarrow.png'}
        ],
        function (counter, images) {
            if (counter == images.length) {
                $.director.
                    addAudio("connect", "sounds/blip.wav").
                    addAudio('wrong', 'sounds/wrong.wav').
                    addAudio('win', 'sounds/win.wav').
                    addAudio('countdown', 'sounds/countdown.wav').
                    addAudio('start', 'sounds/start.wav')

                $.director.setImagesCache(images)

                $.startScene = new $.StartScene().create($.director)
                $.levelSelScene = new $.LevelSelectScene().create($.director)
                $.groupSelScene = new $.GroupSelectScene().create($.director)
            }
        }
        
    )
    
    CAAT.loop(60)
}

window.addEventListener('load', function() {
    $.init()
})
