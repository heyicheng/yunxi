1. 项目中你最值得骄傲的地方
  骄傲的话应该是在工作半年之后，在李管家，当时有个员工离职，但是这个项目主要是他负责，
  然后这个项目就交给了我
  而我是当时工作经验是半年，对于我来说很多都是没有接触过，然后自己整天网上
  查找相关资料，学习各式各样的问题，最后吧项目完成


跨域{
//   1.jsonp
//   2.access-control,设置为允许跨域
//   3.nginx中设置反向代理
//   4.proxy设置代理(适合开发环境)
//   5.websocket
// }



var let const

// 变量提升，可以在没有声明之前使用
// 不允许重复声明
// 暂时性死区，只要用let声明了变量a,那么在该块级作用域前都不可以使用

// let 块级作用域
// const 声明常量且有初始化的值，其指的是内存指针不能变


// 2. css布局，剩余空间自适应有几种方法
//     {
        // 利用width：auto
//       flex:设置flex：1会自动撑开剩余空间，
//       position:fixed,通过设置上下左右来自动撑开中间区域
//       box-sizing:border-box,把高度宽度设置百分之百，再设置padding来实现
//     }

2.  cookie\session\sotrage:{
//       cookie,请求接口是会发送，体积4kb，一般用于和后段做交互时，需要自己封装
//       session,
//       sessionStorage:同源同窗口，关闭就没有了
//       localstorage:同源，5m左右
//     }

3. amd\cmd\common.js:{
//   amd{require.js在推广过程中对模块定义的规范产出
//   可以异步加载,
//   由define定义函数、require导入}
//   cmd：sea.js
//   由difine定义，export导出，回调函数参数为导出内容
//     common.js:{
//       是用在服务器端模块规范，
//       用module.exports导出，require导入，
//       同步的，
//     }
//   }



// 3. 除了px单位，还知道哪些css像素相关的单位。并具体说明下（rem，em，vw，vh）

calc()

// 4. js主要问了es6。

// 5. let\const\和var的区别:{
//     概念，
//     区别:{
//       暂时性死去，
//       不存在变量提升，
//       不允许重复声明，
//     }
//     let:{
//       存在块级作用域
//       在块级作用域内外声明的互不干扰
//       如果是var的话内层的会替代外层的同名变量
//     }
//     const:{
//       必须有初始值
//       保证指向内存的指针不发生变化,
//     }
//   }
6. promise、async、await
    异步编程很好的方法
    promise：{
      异步的内部的错误，不会终止外部程序
      状态改变就无法再次改变
    }
    promise看的差不多了，其中promise的一些方法还需要再看

// 7. 箭头函数和普通函数的区别{
//     首先写法上的简洁
//     在某些还是不能替代普通函数
//     1.this指向问题，定义的时候this的指向，而不是指向调用对象主体
//     2.不能使用new、构造函数
//     3.不用使用yield 、generate函数
//   }

// 8. 从html，css，js方面去考虑做性能优化，都有什么点能优化的。{
//     减少体积{
//       1.压缩css、js、html，
//       2.js公用组建封装，
//       3.多利用公用样式
//       4.多利用样式继承
//     }
//     减少http请求，因为同样的大小{
//       1.精灵图
//       2.图片懒加载、把小的图标打包进js
//       3.吧public.css和pubcli.js分离出来放到单独的文件，利用缓存机制
//     }
//     浏览器工作机制:{
//       1.html：{
//         语义化标签,
//         书写代码是减少dom节点，
//       }
//       2.js:{
//         减少dom节点的访问和操作：{
//           1.访问dom节点就比较耗费资源，js和dom是不同的东西，js用的是js引擎，dom和渲染是通过webcore
//           2.操作dom借点往往伴随这页面的reflow，而refolow也是比较占用资源的
//         }
//         json数据格式对js语言相对友好
//         能定于局部变量就定于局部变量，局部变量查找更加迅速
//         减少定时器的使用，好几个地方需要定时器，我们可以只创建一个来做，
//       }
//       3.css:{
//         1.link\style标签放在head中因为，当js没加载完就可以开始渲染页面,
//         4.css查找是从右往左查找，所以后代选择器并没有提升效率，反而更加消耗资源
//         2.class命名尽量具体，最好能依次性找到，
//         3.給img加上宽高，减少页面reflow
//       }
//     }
//     浏览器渲染过程：构建dom树》构建渲染树》布局渲染树（flow）》绘制渲染树（paint）》在此期间如果有需要则会repaint和reflow 
//       reflow相当于整个页面从新绘制
//   }


// 9. vue项目中遇到过哪些问题。{
//       多页面出现{{}} ： 用v-html，
//       创建数组对象深层次的属性，数据没有双向绑定：$set
//       scoped问题：就算没有加scoped当该组件是处于destroyed状态，样式也是不生效的
      vuex中数据绑定input表单，简单方法直接在computed中加上set方法，后面知道vue定义属性是通过
    // }
// 10. vue路由点钩子函数有哪些。{
  //   {
  //     全局：[beforeEach、beforeResolve、aftereEach],
  //     路由独享守卫：[beforeEnter],
  //     组件内：[beforeRouteEnter、beforeRouterUpdata、beforeRouteLeave],
  //   },
  //   {
  //     beforeCreate:实例初始化
  //     created:完成data、methods、watch还没挂载
  //     beforeMount:render函数首次被调用，挂载之前
  //     mounted:挂载之后，不保证所有子组件都已挂载
  //     beforeDestroy:
  //     destroyed:
  //   },
  //   {
  //     beforeUpdata:数据更新，在虚拟dom和打补丁之前
  //     updated:数据重新渲染之后（不保证所有子组件也）
  //   }
  //   {
  //     activated:keep-alive组件激活
  //     deactivated:失效
  //   }
  // }

11. vuex的优缺点{
   有点：{
	集中管理，代码简洁明了，
	解决了同级组建之间的信息传递，属性传递只能在父子组建中
	在处理多组建共享同一个数据的时候，会非常方便，
    }
    缺点：{
	小型项目比较冗余，
	试用面比较窄，在vue中可以
	不适合组建的封装
    }
  }


12. webpack的原理。webpack的基本配置有哪些。{
    1.一切皆模块，每个模块都有相应的id，从0开始依次往后，打包之后生成一个自执行函数，参数为许多函数组成的数组，每个函数，代表一个模块
    2.有一个入口文件，入口文件会引入格式各样的模块，webpack通过安装不同的模块加载器loader来对不同的模块进行识别，并把这些模块转化成bundler.js
    基本配置：{
      mode，
      entry，
      output，
    }
  }
  
// 13. 浏览器输入url之后，都发生了什么。详细描述下:{
// 域名解析 --> 发起TCP的3次握手 --> 建立TCP连接后发起http请求 --> 服务器响应http请求，浏览器得到html代码 --> 浏览器解析html代码-->构建dom，并请求html代码中的资源（如js、css、图片等） --> 浏览器对页面进行渲染呈现给用户；
// 域名解析：先从浏览器中和window中有一个host文件下中的缓存中查找该域名对应的IP地址，如果没有则从domain name system DNS中查询ip地址
// Tcp3次握手：确认客户端和服务器之间是能连通的
// http请求报文：{
// 	请求行：{
// 	方法：get\post\put\delete
// 	请求地址：‘’
//   }，
//   请求头部：{
//     Accept-language\encoding\charset(编码格式),
//     User-agent
//     Token
//     Cookie
//   },
//   空行表示结束，以下就是请求请求数据,
//   请求数据：{
//   }
// }
// http响应报文：{
// 	状态行：{
//     状态码：{
//       1xx：请求已接受继续处理
//       2xx：成功，
//       3xx：重定向-完成请求需要进一步操作,
//       4xx : 客户端错误  403服务器收到请求，拒绝服务  400客户端语法错误，不能被服务器识别,
//       5xx : 服务器错误
//     }，
//     版本协议
//   }，
//   响应头部：{
//     Content-type\length\charset\encoding\language
//   }
//   响应数据：{
//   }
// }
// 浏览器拿到数据后，根据内部机制进行相应的渲染
// }

es6:{
  1：{
    fetch结合promise封装，
  }
  2：{
    Object.assign
  }
  3:{

  }
}
// vue首屏渲染优化，先搞清楚哪方面优化{
//   1.减少体积：{
//     wepack打包时的配置：{
//       比如图片本来10k之内打包，现在改为5k
//       css分离，
//     }
//     ui框架按需引入，
//     vue-router的按需加载，
//     对于只用到一次的代码尽量写在局部组建中，而不是main.js中，
//   }，
//   4.吧一些体积比较大的比如vue.js\axios.js\ui框架用cdn的形势剥离出来，这样在第二次加载的时候就有缓存
//   3.采用ssr（服务器端渲染）
// }


// 闭包
// 定义：有权访问函数作用域中的变量
// 内存泄漏
// 函数内的变量在函数执行完之后并不会被销毁
// 作用：{
//   1.访问到函数内的变量
//   2.可以做缓存
//   3.模块化开发，防止污染全局变量
// }


// 定义对象的方法
// 1.构造函数
// 2.字面量直接接定义
// 3.Object.create()

继承：{
  // 1.原型链继承
  // 2.构造函数继承
  // 3.原型和构造函数组合
  // 4.工厂模式实现继承
  // 5.call、apply、bind，apply只接受两个参数，都是通过改变this的指向，call、apply是立马就调用，bind返回的是函数
  // 6.Object.assign 是浅拷贝
  // 7.es6中的calss
// }

  
// js执行事件顺序
// script、settimeout、setinterval 属于宏任务，
// promise属于微任务

// 1.有一个主线程，当碰到异步的代码时，会放入event loop中，等待主线程完成再执行event loop事件
// 2.当第一轮宏任务执行完，会去看是否有微任务，如果有则执行微任务，微任务执行完毕，继续执行宏任务，



// js解决异步的方法
{
  1：回调函数function f1(callback){
    setTimeout(() => {
      callback()
    }, 1000);
  }
  f1(f2)
  2.事件监听
  3.发布/订阅
  4.promise
  5.async、await
  6.genarator

}


es6{
  1.async await
  2.genarator
  3.proxy
  4.Map、Set数据类型(还有其原型下的许多方法)
  5.
}


对象的遍历{
  1：for in
  2.Object.keys()
  3.Object.getOwnPropertyNames(obj)
  4.如果事map对象则可以事for of
}


// http2.0
{
  1:二进制格式
  2.多路复用
  3：header压缩
  4.请求优先级
  5.服务器推送
}

网络安全
{
  常见的网络攻击：{
    http劫持,
    CSRF,
    XSS,
    SQL
  }，
  网络安全得怎么做：{
    
  }
}

递归


面试心态是非常重要的，首先听清楚题目，自己心里默念一遍吧，搞清楚面试官想问什么问题，
如果不是很明白可以让面试官说的更加清楚些。



