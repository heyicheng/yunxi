let url = {
	//webUrl: 'http://localhost:3001',
	webUrl: 'http://test-manage.qbm360.com/api',
	fileSever: 'http://test-file.qbm360.com/FileServerServlet',
	imageSeverPath: 'http://test-web.qbm360.com/zaimages/data/upload/zizhi/qbmimg',
	wapUrl: 'http://test-wap.qbm360.com/'
};
if ("production" == process.env.NODE_ENV) {
	if ("prod" != process.env.PATH_ENV) {
		/*测试环境*/
		url = {
			webUrl: 'http://test-manage.qbm360.com/api',
			fileSever: 'http://test-file.qbm360.com/FileServerServlet',
			imageSeverPath: 'http://test-web.qbm360.com/zaimages/data/upload/zizhi/qbmimg',
			wapUrl: 'http://test-wap.qbm360.com/'
		};
	} else {
		url = {
			webUrl: 'http://manage.qbm360.com/api',
			fileSever: 'http://file.qbm360.com/FileServerServlet',
			imageSeverPath: 'http://www.qbm360.com/zaimages/data/upload/zizhi/qbmimg',
			wapUrl: 'http://m.qbm360.com/'
		};
	}
}
export default url;
