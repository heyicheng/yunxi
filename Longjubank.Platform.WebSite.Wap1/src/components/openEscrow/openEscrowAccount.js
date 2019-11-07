import vue from 'vue'
import openEscrowAccount from '@@/openEscrow/openEscrowAccount.vue'

let callbacks = null
let instance = null

function showWindow() {
    const openConstructor = vue.extend(openEscrowAccount)
    instance = new openConstructor({
        el: document.createElement('div')
    })

    instance.cancelCallback = windowCancelCallback
    instance.sureCallback = sureCallback

    document.body.appendChild(instance.$el)

    return new Promise((resolve, reject) => {
        callbacks = { resolve, reject }
    })
}

function closeWindow() {
    document.body.removeChild(instance.$el)
}

function sureCallback() {
    closeWindow()
    // callbacks.resolve && callbacks.resolve()
}

function windowCancelCallback() {
    closeWindow()
    // callbacks.reject && callbacks.reject()
}

export default showWindow