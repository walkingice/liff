// very simple bride js implementation

var liff = {};
window._liff = window._liff ? window._liff : {};
window._liff.postMessage = window._liff.postMessage
    ? window._liff.postMessage
    : function() {console.error("No window._liff.postMessage")};

var callbackFn = null;
var readyCallbackFn = null;

liff.postMessage = function postMessage(
    type,
    featureToken,
    params,
    fn
) {
    let callbackId ="dummyCbId" + (new Date());
    callbackFn = fn;
    let paramsInString = JSON.stringify(params);
    let token = featureToken ? featureToken : "";

    window._liff.postMessage(type, token, callbackId, paramsInString);
}

liff.init = function (fn) {
    readyCallbackFn = fn;
}

function onReady(readyJson) {
    console.log('got ready event:', JSON.stringify(readyJson));
    if (readyCallbackFn !== null) {
        readyCallbackFn(readyJson);
    }
}

window._liff._dispatchEvent = function _dispatchEvent(message) {
    let json = JSON.parse(message);
    if (callbackFn != null) {
        callbackFn(json);
    } else if (json.type === 'ready') {
        onReady(json);
    } else {
        console.error("No callback function");
    }
};

liff._dispatchEvent = window._liff._dispatchEvent;

// export
window.liff = liff;
