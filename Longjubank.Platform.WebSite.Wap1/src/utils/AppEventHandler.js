let token_expired_event_name = 'ljlc_token_expired';

var default_handlers = {};
var extra_handlers = {};

function addDefaultEventListener(event_name, handler) {
    window.addEventListener(event_name, defaultEventHandler)
    default_handlers[event_name] = handler
}

function removeDefaultEventListener(event_name) {
    if (event_name in default_handlers) {
        delete default_handlers[event_name]
    }
}

function defaultEventHandler(event) {
    if ('type' in event) {
        let handler = default_handlers[event.type]
        handler && handler(event)
    }
}

function addExtraEventListener(event_name, identifier, handler) {
    window.addEventListener(event_name, extraEventHandler)
    if (!(event_name in extra_handlers)) {
        extra_handlers[event_name] = {}
    }

    extra_handlers[event_name][identifier] = handler

}

function removeExtraEventListener(event_name, identifier) {
    if (event_name in extra_handlers) {
        delete extra_handlers[event_name][identifier]
    }
}

function extraEventHandler(event) {
    if ('type' in event) {
        let handlers = extra_handlers[event.type]
        handlers && Object.keys(handlers).forEach(key => {
            let handler = handlers[key]
            handler && handler(event)
        });
    }
}

function triggerAppEvent(event_name) {
    let appEvent = new Event(event_name)
    if (window.dispatchEvent) {
        window.dispatchEvent(appEvent);
    } else {
        window.fireEvent(appEvent);
    }
}

export default { triggerAppEvent, addDefaultEventListener, removeDefaultEventListener, addExtraEventListener, removeExtraEventListener, token_expired_event_name }