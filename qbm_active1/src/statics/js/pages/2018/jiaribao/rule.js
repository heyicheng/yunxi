define(function(require,exports,module){

		require('zepto');
		require('fastclick');
		require('layer');
		require('layerCss');
		require('swiper');
		require("artTemplate4");
		require("artTemplateHelper");

		FastClick.attach(document.body);

		$(function() {

			var App = function(){

				this.url = {
					userId: getUrlParam('userId')
				};
				this.init();
			};

			App.prototype={

				init:function(){

					var self = this,
						userId = self.url.userId;
		            
			        //用户登录状态处理
			        if(userId == null || userId == "(null)"){
			        	userId = "";
	       			} 

					//S-APP交互相关
					function connectWebViewJavascriptBridge(callback) {//判断APP是否支持WebViewJavascriptBridge
						if (window.WebViewJavascriptBridge) {
							callback(WebViewJavascriptBridge)
						} else {
							document.addEventListener('WebViewJavascriptBridgeReady', function() {
								callback(WebViewJavascriptBridge)
							}, false)
						}
					}

					connectWebViewJavascriptBridge(function(bridge) {

						//加载页面后调用
						bridge.init(function(message, responseCallback) {
							var data = { 'Javascript Responds':'Wee!' }
							responseCallback(data);
						});
						
						bridge.registerHandler('goBackBtnHandler', function(data, responseCallback){
				            var backLink = webUrl + "/view/2018/jiaribao/index.html?interaction=1&userId=" + userId;
				            var responseData = {'title': "超值大红包随性领取→超值红包甜蜜升级",'href':backLink,'icon':1,'backBtn':1};
				            responseCallback(responseData);
				            if(typeof data=="string")data = JSON.parse(data);
				            if(data.result) location.href = backLink;
				        });

					});
					//E-APP交互相关
				},


			};

			var app =new App();

		});
});
