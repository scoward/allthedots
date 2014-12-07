var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "U";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "Unknown";
        this.OS = this.searchString(this.dataOS) || "U";
        if (this.OS == "Android" || this.OS == "iPhone/iPod") {
            $.mobile = true
        } else {
            $.mobile = false
        }
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        var version = parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        if (isNaN(version)) {
            return version;
        } else {
            return version.toString();
        }
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "C",
            versionSearch: "Chrome"
        },
        {   string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "H"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "S",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "O",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "H",
            versionSearch: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "K",
            versionSearch: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "F",
            versionSearch: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "B",
            versionSearch: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "N",
            versionSearch: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "E",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "N",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "N",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "Android",
            identity: "Android"
        },
        {
            string: navigator.userAgent,
            subString: "android",
            identity: "Android"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};
BrowserDetect.init();
