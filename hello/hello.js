window.onLoadFuncs.push(() => {
    window.appendLog = (function () {
        var p = document.getElementById('logs');
        var logs = p.getElementsByTagName('li');
        var array = [];

        return function (newMsg) {
            var now = new Date();
            var prefix = "<span class='time'>"
                + formatedTime()
                + "</span>";
            array.push(prefix + newMsg);
            while (array.length > logs.length) {
                array.shift();
            }

            for (var i = 0; i < array.length; ++i) {
                logs[i].innerHTML = array[i];
            }
        }
    })();
});

window.onLoadFuncs.push(() => {
    if (liff === undefined || !liff) {
        alert('No LIFF SDK ?!');
    } else {
        appendLog("init simple LIFF bridge....");
    }

    document.getElementById('actionBtn').onclick = function () {
        var liffId = (window.liff && window.liff.id) ? window.liff.id : "NO_LIFF_ID";
        liff.postMessage(
            'shareMessage',
            'dummy_feature_token_' + liffId,
            {
                "messages": "share this message, " + liffId,
                "referrer": {
                    "liffId": liffId,
                    "url": "https://foo.bar.com"
                }
            },
            function (result) {
                console.log(result);
            }
        );
    }
});
