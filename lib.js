window.onLoadFuncs = [];

window.formatedTime = function () {
    //var now = new Date();
    //return now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getUTCMilliseconds();
    return new Date().toISOString().slice(11)
}

function init() {
    window.onLoadFuncs.forEach(function (f) {
        if (f !== undefined && !!f && typeof f === "function") {
            f.apply();
        }
    });
}

window.onload = function () {
    init();
};

