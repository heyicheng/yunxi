(function () {

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


		//APP首页
		$(".pager-cover").on("click",function(){
			bridge.callHandler('goAppModule',{'target':'home'}, function(responseData) {
				if(typeof responseData=="string")responseData = JSON.parse(responseData);
				if(responseData.result) console.log("success");
			});
		});

	});
	//E-APP交互相关

	//参数处理,获取用户id
	function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return unescape(r[2]); return null;
	}
	var type = getUrlParam('type');
	if(type == 'h5'){
		$('.app-link').on('click', function () {
	    window.location.href = "https://www.qbm360.com/applink.html";
	   });
	}

    var preventDefaultEvent = function (e) {
        e.preventDefault();
    };
    //
    var dataReport = {
        coverShow: function () {
            $('.pager.cover .tit').each(function (i, n) {
                var $this = $(this);
                self.setTimeout(function () {
                    $this.addClass('active');
                }, 200 * i)
            });
        },

        totalUserInvestProfitChart: function () {//---第9页-第二个图
            $('#chart-tot-invest-profit').css({
                'width': $('body').width() + 'px',
                'height': ($('body').width() - 230) + 'px'
            });
            var totalInvestChart = echarts.init(document.getElementById('chart-tot-invest-profit'));
            //
            var option = {
                title: {
                    text: '单位：万笔',
                    textStyle: {
                        color: '#333',
                        fontWeight: '300',
                        fontSize: 12
                    },
                    left: '6%',
                    top: '5%'
                },
                tooltip: {
                    trigger: 'axis',
                    alwaysShowContent: true,
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: 'rgba(255,255,255,.5)',
                    textStyle: {
                        color: '#666'
                    },
                    formatter: '{b}<br/>当月累计成交笔数:{c}万笔'

                },
                grid: {
                    show: false,
                    left: '8%',
                    right: '8%',
                    bottom: '1%',
                    top: '24%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['2017年10月', '2016年10月'],
                        boundaryGap: ['20%', '20%'],
                        axisLabel: {
                            textStyle: {
                                color: '#666',
                                fontSize: 12,
                                fontWeight: 300
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                      type: 'value',
                      min: 0,
                      max: 4,
                      axisLabel: {
                          textStyle: {
                              color: '#666',
                              fontSize: 12,
                              fontWeight: 300
                          }
                      },
                      axisTick: {
                          show: false
                      },
                      axisLine: {
                          show: false
                      },
                      splitLine: {
                          show: true,
                          lineStyle: {
                              color: "#e1e1e1"
                          }
                      }

                    }
                ],
                series: [
                    {
                      type: 'bar',
                      barGap: '20%',
                      barWidth: '20%',
                      barMinHeight: 8.5,
                      itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['rgba(135,187,255,1)', 'rgba(135,187,255,1)', 'rgba(135,187,255,1)'];
                                return colorList[params.dataIndex];
                            },
                            borderColor: '#7682a1',
                            borderWidth: 0
                        }
                      },
                      label: {
                        normal: {
                            show: 'true',
                            position: 'top',
                            formatter: '{c}万笔',
                            textStyle: {
                                fontSize: 14,
                                color: '#87bbff'
                            }
                        }
                      },
                      data: [2.62, 2.54],
                      animationDelay: 1000,
                      yAxisIndex: 0
                    }
                ]
            };
            //
            totalInvestChart.setOption(option);
        },
        //累计为用户赚取
		totalUserInvestProfitChart2: function () {//---第9页-第一个图
            $('#chart-tot-invest-profit2').css({
                'width': $('body').width() + 'px',
                'height': ($('body').width() - 230) + 'px'
            });
            var totalInvestChart = echarts.init(document.getElementById('chart-tot-invest-profit2'));
            //
            var option = {
                title: {
                    text: '单位：万元',
                    textStyle: {
                        color: '#333',
                        fontWeight: '300',
                        fontSize: 12
                    },
                    left: '6%',
                    top: '5%'
                },
                tooltip: {
                    trigger: 'axis',
                    alwaysShowContent: true,
                    axisPointer: {
                        type: 'shadow'
                    },
                    backgroundColor: 'rgba(255,255,255,.5)',
                    textStyle: {
                        color: '#666'
                    },
                    formatter: '{b}<br/>当月累计为用户赚取:{c}万元'

                },
                grid: {
                    show: false,
                    left: '8%',
                    right: '8%',
                    bottom: '1%',
                    top: '24%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['2017年10月', '2016年10月'],
                        boundaryGap: ['20%', '20%'],
                        axisLabel: {
                            textStyle: {
                                color: '#666',
                                fontSize: 12,
                                fontWeight: 300
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                      type: 'value',
                      min: 200,
                      max: 600,
                      axisLabel: {
                        textStyle: {
                            color: '#666',
                            fontSize: 12,
                            fontWeight: 300
                        }
                      },
                      axisTick: {
                          show: false
                      },
                      axisLine: {
                          show: false
                      },
                      splitLine: {
                          show: true,
                          lineStyle: {
                              color: "#e1e1e1"
                          }
                      }

                    }
                ],
                series: [
                    {
                      type: 'bar',
                      barGap: '20%',
                      barWidth: '20%',
                      barMinHeight: 8.5,
                      itemStyle: {
                        normal: {
                            color: function (params) {
                                var colorList = ['rgba(135,187,255,1)', 'rgba(135,187,255,1)', 'rgba(135,187,255,1)'];
                                return colorList[params.dataIndex];
                            },
                            borderColor: '#7682a1',
                            borderWidth: 0
                        }
                      },
                      label: {
                        normal: {
                            show: 'true',
                            position: 'top',
                            formatter: '{c}万元',
                            textStyle: {
                                fontSize: 14,
                                color: '#87bbff'
                            }
                        }
                      },
                        data: [565.01, 503.77],
                      animationDelay: 1000,
                      yAxisIndex: 0
                    }
                ]
            };
            //
            totalInvestChart.setOption(option);
        },
        chartArea: function () {// page1 全国出借者占比
            $('#chart-area').css({
                'width': $('body').width() + 'px',
                'height': ($('body').width() - 100) + 'px'
            });
            var chartArea = echarts.init(document.getElementById('chart-area'));
            var option = {
                title: {
                    text: '10月全国出借者分布占比',
                    textStyle: {
                        color: '#333',
                        fontSize: '16',
                        fontWeight: '300'
                    },
                    top: '10',
                    x: 'center',
                    z: 1
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255,255,255,.5)',
                    textStyle: {
                        color: '#666'
                    },
                    position: 'top',
                    formatter: function (params, ticket, callback) {
                        var v = null;
                        if (params != undefined || params != null)
                            v = params.value.toFixed(2);

                        if (params.dataIndex == 14) {
                            return '<span style="color:#ff4040">NO. 1</span> <br>' + params.name + ' ' + v + '%';
                        } else if (params.dataIndex == 13) {
                            return '<span style="color:#ff4040">NO. 2</span> <br>' + params.name + ' ' + v + '%';
                        } else if (params.dataIndex == 11) {
                            return '<span style="color:#ff4040">NO. 3</span> <br>' + params.name + ' ' + v + '%';
                        } else {
                            return params.name + ' ' + v + '%';
                        }
                    }
                },
                visualMap: [{
                    show: false,
                    min: 0,
                    max: 20,
                    left: 'center',
                    align: 'left',
                    top: 'bottom',
                    itemWidth: 14,
                    orient: 'horizontal',
                    itemGap: 20,
                    inRange: {
                        color: ['#c5e5fd', '#a1cdf2', '#7eb2df', '#3789c1'],
                        symbolSize: [100, 0],
                        symbol: 'rect'
                    },
                    type: 'piecewise',
                    pieces: [
                        {min: 20, label: '20.00%以上'},
                        {min: 5, max: 20, label: '5.00%-20.00%'},
                        {min: 1, max: 5, label: '1.00%-5.00%'},
                        {max: 1, label: '1.00%以下'}
                    ]
                }],
                series: [{
                    name: '10月全国出借分布占比',
                    type: 'map',
                    map: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                                fontSize: 5,
                                color: '#fff'
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: 5,
                                color: '#fff'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff'
                        },
                        emphasis: {
                            areaColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#ff4040' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#ff4040' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            color: '#fff'
                        }
                    },
                    center: [105.97, 29.71],
                    scaleLimit: {
                        min: 1,
                        max: 5
                    },
                    z: 3,
                    top: 80,
                    data: [
                        {name: '北京', value: 1.11},
                        {name: '天津', value: 1.31},
                        {name: '上海', value: 5.65},
                        {name: '重庆', value: 0.56},
                        {name: '河北', value: 2.94},
                        {name: '河南', value: 4.44},
                        {name: '云南', value: 1.41},
                        {name: '辽宁', value: 2.20},
                        {name: '黑龙江', value: 1.67},
                        {name: '湖南', value: 5.17},
                        {name: '安徽', value: 4.32},
                        {name: '山东', value: 6.65},
                        {name: '新疆', value: 0.97},
                        {name: '江苏', value: 8.26},
                        {name: '浙江', value: 20.63},
                        {name: '江西', value: 6.45},
                        {name: '湖北', value: 4.88},
                        {name: '广西', value: 0.62},
                        {name: '甘肃', value: 0.89},
                        {name: '山西', value: 2.86},
                        {name: '内蒙古', value: 0.74},
                        {name: '陕西', value: 2.49},
                        {name: '吉林', value: 1.02},
                        {name: '福建', value: 2.31},
                        {name: '贵州', value: 0.36},
                        {name: '广东', value: 4.15},
                        {name: '青海', value: 0.33},
                        {name: '西藏', value: 0.0},
                        {name: '四川', value: 4.45},
                        {name: '宁夏', value: 0.92},
                        {name: '海南', value: 0.20},
                        {name: '台湾', value: 0.0},
                        {name: '香港', value: 0.0},
                        {name: '澳门', value: 0.0}
                    ],
                    animationDelay: 1000
                }]
            };

            //
            chartArea.setOption(option);
        },
        chartPreference: function () {//page2
            $('#chart-preference').css({
                'width': $('body').width() + 'px',
                'height': ($('body').width() - 120) + 'px'
            });
            var chartPreference = echarts.init(document.getElementById('chart-preference'));
            //
            var option = {
                title: {
                    text: '10月产品出借占比分布',
                    textStyle: {
                        color: '#333',
                        fontSize: '16',
                        fontWeight: '300'
                    },
                    itemGap: 235,
                    subtextStyle: {
                        color: '#333',
                        fontSize: 13,
                        fontWeight: '300'
                    },
                    z: 100,
                    x: 'center',
                    top: '0'
                },
                tooltip: {
                    show: false,
                    trigger: 'item',
                    formatter: ' {a} <br> {b} '
                },
                legend: {
                    show: false,
                    orient: 'horizontal',
                    x: 'center',
                    y: 'bottom',
                    itemHeight: 10,
                    itemWidth: 10,
                    left: '15%',
                    right: '15%',
                    itemGap: 4,
                    data: [
                        {icon: 'rect', name: '网宝强'},
                        {icon: 'rect', name: '网益宝'},
                        {icon: 'rect', name: '新手专享'},
                        {icon: 'rect', name: '假日宝'},
                        {icon: 'rect', name: '其他'},
                        {icon: 'rect', name: '车贷'}
                    ],
                    formatter: function (name) {
                        switch (name) {
                            case '网宝强':
                                return '网宝强      37.08% ';
                                break;
                            case '网益宝':
                                return '网益宝      29.33% ';
                                break;
                            case '新手专享':
                                return '新手专享    13.00% ';
                                break;
                            case '假日宝':
                                return '假日宝      19.94% ';
                                break;
                            case '其他':
                                return '其他         0.63% ';
                                break;
                            default:
                                return '车贷    0.02%';
                                break;
                        }
                    },
                    textStyle: {
                        color: '#666',
                        fontSize: 12,
                        fontWeight: '300'
                    }
                },
                calculable: true,
                series: [
                    {
                        name: '产品出借占比分布',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '60%'],
                        data: [
								{value: 37.08, name: '网宝强'},
								{value: 29.33, name: '网益宝'},
								{value: 13.00, name: '新手专享'},
								{value: 19.94, name: '假日宝'},
								{value: 0.63, name: '其他'},
								{value: 0.02, name: '车贷'}
                        ],
                        startAngle: 89,
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                textStyle: {
                                    color: '#323232'
                                },
                                formatter: '{c}%'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                position: 'inside',
                                length: 20,
                                lineStyle: {
                                    color: '#323232'
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 0,
                                color: function (params) {
                                    var colorList = ['#ff9872', '#88bfff', '#7d92ff', '#ff72e3', '#ff7777', '#ffc272'];
                                    return colorList[params.dataIndex];
                                }
                            },
                            emphasis: {
                                borderColor: '#fff'
                            }
                        },
                        animationDelay: 1000
                    }
                ]
            };
            //
            chartPreference.setOption(option);
        },
        chartFemaleAge: function () {//page3 女性出借年龄分布
            $('#chart-female-age').css({
                'width': $('body').width() + 'px',
                'height': '240px'
            });
            var chartAge = echarts.init(document.getElementById('chart-female-age'));
            var option = {
                title: {
                    text: '10月女性用户年龄分布',
                    textStyle: {
                        color: '#333',
                        fontSize: '16',
                        fontWeight: '300'
                    },
                    itemGap: 235,
                    subtextStyle: {
                        color: '#333',
                        fontSize: 13,
                        fontWeight: '300'
                    },
                    z: 100,
                    x: 'center',
                    top: '0',
                    padding: [5, 0, 400, 0]
                },
                tooltip: {
                    show: false,
                    trigger: 'item',
                    formatter: ' {a} <br> {b} '
                },
                calculable: true,
                series: [
                    {
                        name: '出借用户年龄占比',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '50%'],
                        data: [
                            {value: 4.36, name: '50'},
                            {value: 8.58, name: '60'},
                            {value: 18.68, name: '70'},
                            {value: 37.85, name: '80'},
                            {value: 29.65, name: '90'},
                            {value: 0.88, name: '其他'}
                        ],
                        label: {
                            normal: {
                                position: 'outside',
                                textStyle: {
                                    color: '#323232'
                                },
                                formatter: function (params) {
                                    if (params.name != '其他')
                                        return params.name + '后 ' + params.value.toFixed(2) + '%';
                                    else
                                        return params.name + ' ' + params.value.toFixed(2) + '%';
                                }
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                position: 'inside',
                                length: 20,
                                lineStyle: {
                                    color: '#323232'
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 0,
                                color: function (params) {
                                    var colorList = ['#ff6228', '#ff7541', '#ff8456', '#ff9872', '#ffaa8b', '#ff8456'];
                                    return colorList[params.dataIndex];
                                }
                            },
                            emphasis: {
                                borderColor: '#fff'
                            }
                        },
                        animationDelay: 1000
                    }
                ]
            };
            //
            chartAge.setOption(option);
        },
        chartFemalePeriod: function () {//page04  女性交易期限分布
            $('#chart-female-period').css({
                'width': ($('body').width()) + 'px',
                'height': '240px'
            });
            var chartPeriod = echarts.init(document.getElementById('chart-female-period'));
            var option = {
                title: {
                    text: '10月女性交易期限分布',
                    textStyle: {
                        color: '#333',
                        fontSize: '16',
                        fontWeight: '300'
                    },
                    itemGap: 235,
                    subtextStyle: {
                        color: '#333',
                        fontSize: 13,
                        fontWeight: '300'
                    },
                    z: 100,
                    x: 'center',
                    top: '10'
                },
                yAxis: {
                    show: false,
                    data: ['1个月', 'b', 'c', 'd'],
                    axisTick: {show: false},
                    axisLabel: {
                        show: false
                    }
                },
                xAxis: {
                    show: false,
                    splitLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {
                        show: false
                    }
                },
                animationDurationUpdate: 2200,
                series: [{
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#7cb8ff'
                        }
                    },
                    barWidth: 20,
                    z: 10,
                    data: [7.04, 18.48, 24.75, 49.73]

                }, {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#ddd'
                        }
                    },
                    silent: true,
                    barWidth: 1,
                    barGap: '0%',
                    data: [140, 140, 140, 140],
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            offset: [-75, -15],
                            textStyle: {
                                color: '#323232',
                                fontSize: 12
                            },
                            formatter: function (params) {
                                switch (params.dataIndex) {
                                    case 0:
                                        return '6-12个月 7.04%';
                                    case 1:
                                        return '3-6个月  18.48%';
                                    case 2:
                                        return '1-3个月  24.75%';
                                    case 3:
                                        return '1个月内  49.73%';
                                        break;
                                }
                            }
                        }
                    }
                }]
            };

            chartPeriod.setOption(option);

        },
        chartFemaleProperty: function () { //page04 女性出借额度分布
            $('#chart-female-property').css({
                'width': $('body').width() + 'px',
                'height': ($('body').width() - 150) + 'px'
            });
            var chartFemaleProperty = echarts.init(document.getElementById('chart-female-property'));
            //
            var option = {
                title: {
                    text: '10月女性出借额度分布',
                    textStyle: {
                        color: '#333',
                        fontSize: '16',
                        fontWeight: '300'
                    },
                    itemGap: 235,
                    subtextStyle: {
                        color: '#333',
                        fontSize: 13,
                        fontWeight: '300'
                    },
                    z: 100,
                    x: 'center',
                    top: '0',
                    padding: [0, 0, 20, 0]
                },
                tooltip: {
                    show: false,
                    trigger: 'item',
                    formatter: ' {a} <br> {b} '
                },
                legend: {
                    show: false,
                    orient: 'horizontal',
                    x: 'center',
                    y: 'bottom',
                    itemHeight: 10,
                    itemWidth: 10,
                    left: '10%',
                    right: '10%',
                    itemGap: 4,
                    data: [
                        {icon: 'rect', name: '1万以下'},
                        {icon: 'rect', name: '1万-5万'},
                        {icon: 'rect', name: '5万-10万'},
                        {icon: 'rect', name: '10万及以上'}
                    ],
                    formatter: function (name) {
                        switch (name) {
                            case '1万以下':
                                return name + '    57.19%';
                                break;
                            case '1万-5万':
                                return name + '    35.75%';
                                break;
                            case '5万-10万':
                                return name + '    4.84%';
                                break;
                            case '10万及以上':
                                return name + '    2.22%';
                                break;
                        }
                    },
                    textStyle: {
                        color: '#666',
                        fontSize: 12,
                        fontWeight: '300'
                    }
                },
                calculable: true,
                series: [
                    {
                        name: '女性出借额度分布',
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['50%', '50%'],
                        startAngle: 88,
                        data: [
                            {value: 57.19, name: '1万以下'},
                            {value: 35.75, name: '1万-5万'},
                            {value: 4.84, name: '5万-10万'},
                            {value: 2.22, name: '10万及以上'}
                        ],
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                textStyle: {
                                    color: '#323232'
                                },
                                formatter: '{c}%'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                position: 'outside',
                                length: 20,
                                lineStyle: {
                                    color: '#323232'
                                }
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 0,
                                color: function (params) {
                                    var colorList = ['#ff9770', '#ffb092', '#ffcfbd', '#ff7a48'];
                                    return colorList[params.dataIndex];
                                }
                            },
                            emphasis: {
                                borderColor: '#fff'
                            }
                        },
                        animationDelay: 1000
                    }
                ]
            };
            //
            chartFemaleProperty.setOption(option);
        },
        chartFemaleArea: function () {//page5
            $('#chart-female-area').css({
                'width': $('body').width() + 'px',
                'height': ($('body').width() - 80) + 'px'
            });
            var chartArea = echarts.init(document.getElementById('chart-female-area'));

            var option = {
                title: {
                    text: '10月女性全国财富分布',
                    textStyle: {
                        color: '#333',
                        fontSize: '16',
                        fontWeight: '300'
                    },
                    top: '10',
                    x: 'center',
                    z: 1,
                    padding: [5, 0, 30, 0]
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(255,255,255,.5)',
                    textStyle: {
                        color: '#666'
                    },
                    position: 'top',
                    formatter: function (params, ticket, callback) {
                        var v = params.value.toFixed(2);

                        if (params.dataIndex == 14) {
                            return '<span style="color:#ff4040">NO. 1</span> <br>' + params.name + ' ' + v;
                        } else if (params.dataIndex == 13) {
                            return '<span style="color:#ff4040">NO. 2</span> <br>' + params.name + ' ' + v;
                        } else if (params.dataIndex == 11) {
                            return '<span style="color:#ff4040">NO. 3</span> <br>' + params.name + ' ' + v;
                        } else {
                            return params.name + ' ' + v;
                        }
                    }
                },
                visualMap: [{
                    show: false,
                    min: 0,
                    max: 20000,
                    left: 'center',
                    align: 'left',
                    top: 'bottom',
                    itemWidth: 14,
                    orient: 'horizontal',
                    itemGap: 20,
                    inRange: {
                        color: ['#ffe7e0', '#ffcbc6', '#ffa488', '#ff8a5d'],
                        symbolSize: [100, 0],
                        symbol: 'rect'
                    },
                    type: 'piecewise',
                    pieces: [
                        {max: 2000000, label: '200万以下'},
                        {min: 2000000, max: 5000000, label: '200万-500万'},
                        {min: 5000000, max: 100000000, label: '500万-1亿'},
                        {min: 100000000, label: '1亿以上'}
                    ]
                }],
                series: [{
                    name: '10月全国出借分布占比',
                    type: 'map',
                    map: 'china',
                    roam: false,
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                                fontSize: 5,
                                color: '#fff'
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: 5,
                                color: '#fff'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderColor: '#fff'
                        },
                        emphasis: {
                            areaColor: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#ff4040' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#ff4040' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            color: '#fff'
                        }
                    },
                    center: [105.97, 29.71],
                    scaleLimit: {
                        min: 1,
                        max: 5
                    },
                    z: 3,
                    top: 100,
                    data: [
                        {name: '北京', value: 2333244.72},
                        {name: '天津', value: 2263807.08},
                        {name: '上海', value: 9487182.02},
                        {name: '重庆', value: 1173589.36},
                        {name: '河北', value: 4026395.49},
                        {name: '河南', value: 4706676.82},
                        {name: '云南', value: 1086785.88},
                        {name: '辽宁', value: 3164227.28},
                        {name: '黑龙江', value: 3211373.40},
                        {name: '湖南', value: 6328689.80},
                        {name: '安徽', value: 8158921.66},
                        {name: '山东', value: 9384095.95},
                        {name: '新疆', value: 3019064.63},
                        {name: '江苏', value: 13297783.76},
                        {name: '浙江', value: 113027883.89},
                        {name: '江西', value: 11498361.99},
                        {name: '湖北', value: 9829719.59},
                        {name: '广西', value: 1401096.47},
                        {name: '甘肃', value: 1193054.04},
                        {name: '山西', value: 2946284.79},
                        {name: '内蒙古', value: 985306.56},
                        {name: '陕西', value: 3933312.90},
                        {name: '吉林', value: 2629986.99},
                        {name: '福建', value: 3239475.57},
                        {name: '贵州', value: 602635.19},
                        {name: '广东', value: 4513033.63},
                        {name: '青海', value: 841959.50},
                        {name: '西藏', value: 0.00},
                        {name: '四川', value: 7874829.46},
                        {name: '宁夏', value: 2092997.74},
                        {name: '海南', value: 344388.79},
                        {name: '台湾', value: 0.00},
                        {name: '香港', value: 0.00},
                        {name: '澳门', value: 0.00}
                    ],
                    animationDelay: 1000
                }]
            };

            //
            chartArea.setOption(option);
        },
        slider: function () {
            var i = 0;
            //左滑动
            $('.slider').on('swipeLeft', function () {
                $('.slider-items').removeClass('toggle-animation-left');
                $('.slider-items').eq(i).addClass('toggle-animation-left');

                var removeActiveLeft = self.setTimeout(function () {
                    $('.slider-items').eq(i).removeClass('active');
                    $('.point').eq(i).removeClass('active');
                    if (i >= 2) {
                        $('.slider-items').eq(0).addClass('active');
                        $('.point').eq(0).addClass('active');
                        i = 0;
                    } else {
                        $('.slider-items').eq(i + 1).addClass('active');
                        $('.point').eq(i + 1).addClass('active');
                        i++;
                    }
                }, 500);
            });
            //右滑动
            $('.slider').on('swipeRight', function () {
                $('.slider-items').removeClass('toggle-animation-right');
                $('.slider-items').eq(i).addClass('toggle-animation-right');

                var removeActiveRight = self.setTimeout(function () {
                    $('.slider-items').eq(i).removeClass('active');
                    $('.point').eq(i).removeClass('active');
                    if (i <= 0) {
                        i = 2;
                        $('.slider-items').eq(i).addClass('active');
                        $('.point').eq(i).addClass('active');
                    } else {
                        $('.slider-items').eq(i - 1).addClass('active');
                        $('.point').eq(i - 1).addClass('active');
                        i--;
                    }
                }, 500);
            });
        },
        scrollNum: function (param) {
            var param = param || {}
            var elem = param.elem || '.cumulative-turnover';
            var val = $(elem).attr('data-val');//基数
            var integerSeparate;//整数小数分离

            if (val.indexOf('.') < 0) {
              integerSeparate = val.split('');
              for (var j = 0; j <= integerSeparate.length; j++) {
                  $(elem).find('.num-dot').removeClass('active');
                  $(elem).find('.num').eq(j).removeClass('num-' + integerSeparate[j]);
              }

              self.setTimeout(function () {
                  for (var j = 0; j <= integerSeparate.length; j++) {
                      $(elem).find('.num-dot').addClass('active');
                      $(elem).find('.num').eq(j).addClass('num-' + integerSeparate[j]);
                  }
              }, 1000)
            } else {
                integerSeparate = val.split('.').join('');
                integerSeparate = integerSeparate.split('');
                for (var j = 0; j <= integerSeparate.length; j++) {
                    $(elem).find('.num-dot').removeClass('active');
                    $(elem).find('.num').eq(j).removeClass('num-' + integerSeparate[j]);
                }
                self.setTimeout(function () {
                    for (var j = 0; j <= integerSeparate.length; j++) {
                        $(elem).find('.num-dot').addClass('active');
                        $(elem).find('.num').eq(j).addClass('num-' + integerSeparate[j]);
                    }
                }, 1000)
            }
        },
        nextColorWhite: function () {
            $('.next').css('color', 'white');
        },
        nextColorGray: function () {
            $('.next').css('color', 'lightgray');
        },
        //图标分页初始化
        initChart: function (i) {
            switch (i) {
                case 0:
                    this.coverShow();
                    this.nextColorGray();
                    break;
                case 1:
                    //地区
                    this.nextColorGray();
                    this.chartArea();
                    break;
                case 2:
                    this.chartPreference();
                    break;
                case 3:
                    this.chartFemaleAge();
                    break;
                case 4:
                    this.chartFemalePeriod();
                    this.chartFemaleProperty();
                    break;
                case 5:
                    this.chartFemaleArea();
                    break;
                /*                case 3:
                 //
                 this.scrollNum({elem: '.cumulative-user-month'});
                 //注册用户
                 this.totalUserChart();
                 break;*/
                case 6:
                    //总览
                    //this.totalInvestChart();
                    this.scrollNum({elem: '.cumulative-turnover'});
                    this.scrollNum({elem: '.cumulative-user'});
                    this.scrollNum({elem: '.cumulative-profit'});
                    break;
                case 7:
                    //
                    // this.modeShow();
                    break;
                case 8:
                    this.scrollNum({elem: '.cumulative-turnover-total-amount'});
                    this.scrollNum({elem: '.cumulative-turnover-total-profit'});
                    this.scrollNum({elem: '.cumulative-total-register-users'});
                    this.scrollNum({elem: '.cumulative-total-investment-users'});
                    break;
                case 9:                   

                    this.scrollNum({elem: '.cumulative-turnover-month-profit2'});
                    this.totalUserInvestProfitChart2();

                    this.scrollNum({elem: '.cumulative-turnover-month-profit'});
                    this.totalUserInvestProfitChart();

                    break;
                case 10:
					//this.scrollNum({elem: '.cumulative-turnover-month2'});
					//this.scrollNum({elem: '.cumulative-turnover-month-profit2'});

                    break;
                case 11:
                    break;
				case 12:
                    break;
                default:
                    break;

            }
        },
        //方法初始化
        init: function () {
            const totalPage = 14;

            var screenWidth = $(document).width(), screenHeight = $(window).height();
            var togglePager = new Array();
            var _this = this;
            for (var i = 0; i < $('.pager').length; i++) {
                togglePager[i] = screenHeight * i;
            }
            //单页高宽
            $('.pager').css({'width': screenWidth + 'px', 'height': screenHeight + 'px'});
            //容器高宽
            $('.container').css({
                'width': screenWidth + 'px',
                'height': (screenHeight * $('.pager').length) + 'px'
            });
            //禁止页面滑动
            document.addEventListener('touchmove', preventDefaultEvent, false);

            //上翻页
            $('.container').on("swipeUp", function (e) {
                var pagerCode = parseInt($(this).attr('data-pager-code'));

                if (pagerCode >= totalPage) {
                    //$(this).css({'transform': 'translateY(-'+togglePager[0]+'px)'}).attr('data-pager-code',0);
                } else {
                    if (pagerCode == totalPage - 1) {
                        $('.next').css({
                            'transform': 'rotate(180deg)',
                            'transition': 'all .5s',
                            '-webkit-transform': 'rotate(180deg)',
                            '-webkit-transition': 'all .5s'
                        });
                    }

                    $(this).css({
                        'transform': 'translateY(-' + togglePager[pagerCode + 1] + 'px)',
                        '-webkit-transform': 'translateY(-' + togglePager[pagerCode + 1] + 'px)'
                    }).attr('data-pager-code', pagerCode + 1);
                    _this.initChart(pagerCode + 1);
                }
            });
            //下翻页
            $('.container').on("swipeDown", function (e) {
                var pagerCode = parseInt($(this).attr('data-pager-code'));
                if (pagerCode <= 0) {

                    // $(this).css({'transform': 'translateY(-'+togglePager[8]+'px)'}).attr('data-pager-code',8);
                } else {
                    $('.next').css({
                        'transform': 'rotate(0)',
                        '-webkit-transform': 'rotate(0)',
                        'transition': 'all .5s',
                        '-webkit-transition': 'all .5s'
                    });
                    $(this).css({'transform': 'translateY(-' + togglePager[pagerCode - 1] + 'px)'}).attr('data-pager-code', pagerCode - 1);
                    _this.initChart(pagerCode - 1);
                }
            });

            //点击下翻按钮
            $('.pager-toggle').on("tap", function (e) {
                var container = $('.container');
                var pagerCode = parseInt(container.attr('data-pager-code'));
                if (pagerCode >= totalPage) {
                    $('.next').css({
                        'transform': 'rotate(0)',
                        'transition': 'all .5s',
                        '-webkit-transform': 'rotate(0)',
                        '-webkit-transition': 'all .5s'
                    });
                    container.css({
                        'transform': 'translateY(-' + togglePager[0] + 'px)',
                        '-webkit-transform': 'translateY(-' + togglePager[0] + 'px)'
                    }).attr('data-pager-code', 0);
                } else {
                    if (pagerCode == totalPage - 1) {
                        $('.next').css({
                            'transform': 'rotate(180deg)',
                            '-webkit-transform': 'rotate(180deg)',
                            'transition': 'all .5s',
                            '-webkit-transition': 'all .5s'
                        });
                    }
                    container.css({'transform': 'translateY(-' + togglePager[pagerCode + 1] + 'px)'}).attr('data-pager-code', pagerCode + 1);
                    _this.initChart(pagerCode + 1);
                }
            });
            //平台活动展示
            this.slider();
            //cover init
            this.coverShow();
            //next color
            $('.next').css('color', 'white');
        }
    };
    dataReport.init();
    window.onload = function () {
        document.getElementById('loading').style.display = 'none';
    }
})(window);
