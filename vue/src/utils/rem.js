function getRem(){
    let HTML=document.documentElement
    let screenWidth=HTML.clientWidth;
    log(screenWidth,'屏幕宽度')
    // 如果设计图纸为750px，要让设计图纸直接除100，就是1rem
    let rem=HTML.style.fontSize=screenWidth*100/750//100位设计图纸除以100就为1rem、750为设计图纸的宽度
    log(rem)
}
getRem()
window.addEventListener('resize',getRem)

