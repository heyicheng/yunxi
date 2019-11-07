function init(){
    // 屏幕宽度/750=1/100
    // 要使1rem对应设计图纸的100px;
    // 当屏幕为375时  设计图纸大小750   375/屏幕字体大小=750/设计图纸字体大小=》 375/rem=750/100
    var screenW=document.documentElement.clientWidth
    var rem=screenW*100/750
    document.documentElement.style.fontSize=rem+'px'
    // docume
}
window.addEventListener('resize',init)
init()