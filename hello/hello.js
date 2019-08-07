window.onLoadFuncs = [];

window.formatedTime = function() {
    //var now = new Date();
    //return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getUTCMilliseconds();
    return new Date().toISOString().slice(11)
}

function init() {
    window.appendLog = (function() {
        var p = document.getElementById('logs');
        var logs = p.getElementsByTagName('li');
        var array = [];

        return function(newMsg) {
            var now = new Date();
            var prefix = "<span class='time'>"
                + formatedTime()
                + "</span>";
            array.push(prefix + newMsg);
            while(array.length > logs.length) {
                array.shift();
            }

            for (var i = 0; i < array.length; ++i) {
                logs[i].innerHTML = array[i];
            }
        }
    })();

    window.onLoadFuncs.forEach(function(f) {
        if (f !== undefined && !!f && typeof f === "function") {
            f.apply();
        }
    });
}

function initializeApp(lang, context) {
    document.getElementById('languagefield').textContent = lang;
    document.getElementById('viewtypefield').textContent = context.viewType;
    document.getElementById('useridfield').textContent = context.userId;
    document.getElementById('utouidfield').textContent = context.utouId;
    document.getElementById('roomidfield').textContent = context.roomId;
    document.getElementById('groupidfield').textContent = context.groupId;
}

window.onload = function() {
    init();

    if (liff === undefined || !liff) {
        alert('No LIFF SDK ?!');
    } else {
        appendLog("init simple LIFF bridge....");
    }
};

