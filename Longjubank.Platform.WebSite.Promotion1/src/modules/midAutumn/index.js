import vue from 'vue'
import './midAutumn.scss'
import App from './midAutumn.vue'

new vue({
    render: h => h(App),
}).$mount('#app')