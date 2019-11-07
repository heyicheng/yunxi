import vue from 'vue'

import App from './encore.vue'

new vue({
    render: h => h(App),
}).$mount('#app')