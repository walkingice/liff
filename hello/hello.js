window.onLoadFuncs = [];

function init() {
    window.appendLog = (function() {
        var p = document.getElementById('logs');
        var logs = p.getElementsByTagName('li');
        var array = [];

        return function(newMsg) {
            var now = new Date();
            var prefix = "<span class='time'>"
                + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getUTCMilliseconds()
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
        appendLog("init LIFF....");
        liff.init({"liffId": "1564460433-w30g6zmn"})
        .then(function(msg) {
            appendLog("LIFF initialized", msg);
            initializeApp(liff.getLanguage(), liff.getContext());
        })
        .catch(function(e) {
            appendLog(e.toString());
        });
    }
};

