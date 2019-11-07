var urlConfig = require('./config/url')

var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')

var path = require('path')
var gulp = require('gulp');
var gulpMinifyHtml = require('gulp-minify-html')
var gulpMinifyCss = require('gulp-minify-css'),
  sass = require('gulp-sass')
var autoprefixer = require('autoprefixer');
var gulpUglify = require('gulp-uglify'),
  // sourcemaps = require('gulp-sourcemaps'),//简单讲就是文件转化后不利于查看与调试，但是有了sourcemap，出错的时候，除错工具将直接显示原始代码
  babel = require('gulp-babel')
var gulpClean = require('gulp-clean')
var gulpSequence = require('gulp-sequence') //执行同步操作
var postcss = require('gulp-postcss')
var gulpSequence = require('gulp-sequence'),
  browserSync = require('browser-sync').create(),
  gulpRename = require('gulp-rename')
gulp.task('clean', function (cb) {
  console.log('sdfa')
  return gulp.src('dist', {
      read: false
    })
    .pipe(gulpClean())
})
console.log(process.env.NODE_ENV)
//压缩代码
gulp.task('minCss', function () {
  return gulp.src('src/css/**/*.css')
    //开发环境中就已经加了前缀，所以这里不需要
    // .pipe(postcss([
    //   autoprefixer({
    //     browsers: ['last 2 version']
    //   })
    // ]))
    .pipe(gulpMinifyCss())
    // .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    // .pipe(rev.manifest())
    // .pipe(gulp.dest('rev/css'))
})
gulp.task('minHtml', function () {
  return gulp.src(['rev/**/*.json', 'src/html/**/*.html'])
    // .pipe(revCollector({
    //   replaceReved: true,
    //   dirReplacements: {
    //     'css': 'css',
    //     'js': 'js',
    //     'img': 'img' //这里对应的是路径
    //   }
    // }))
    .pipe(gulpMinifyHtml())
    .pipe(gulp.dest('dist/html'))
})
gulp.task('plugins',function(){
  return gulp.src('src/plugins/**/*')
  .pipe(gulp.dest('dist/plugins'))
})
gulp.task('minJs', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(gulpUglify({
      // mangle: {except: ['require' ,'exports' ,'module' ,'$']}
      mangle:false//不修改变量名
    }))
    // .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    // .pipe(rev.manifest())
    // .pipe(gulp.dest('rev/js'))
})
gulp.task('image', function () {
  return gulp.src('src/img/**/*')
    // .pipe(rev())
    .pipe(gulp.dest('dist/img'))
    // .pipe(rev.manifest())
    // .pipe(gulp.dest('rev/img'))
})

gulp.task('build', function () {
  gulpSequence(['clean'], ['minCss', 'minJs', 'minHtml', 'image','plugins'], function () {
  })
})

gulp.task('server', function () {
  browserSync.init({
    server: './',
    port: urlConfig.port,
    host: urlConfig.host,
    directory: true
    // proxy: "http://www.bbc.co.uk"
  }, function () {})

})
//把sass文件转为css
let sassToCss = function (e) {
  let dirname = path.dirname(e.path)
  return gulp.src(dirname + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 version',
          "> 1%",
          "not ie <= 8"
        ]
      })
    ]))
    .pipe(gulp.dest(dirname))
    .pipe(browserSync.reload({
      stream: true
    }))
}
//监听sass任务
gulp.task('sassWatch', function () {
  return gulp.watch('src/css/**/*.scss', function (e) {
    sassToCss(e)
  })
})
//转es6=》es5
/*这里做了处理，防止src/js的所有es6文件都重新编译*/
let es6ToEs5 = function (e) {
  let dirname = path.dirname(e.path)
  return gulp.src(dirname + '/**/*.js.es6')
    // .pipe(changed('src/js'))
    .pipe(babel({
      presets: ["env"]
    }))
    .pipe(gulpRename(function (path) {
      path.basename = path.basename.slice(0, -3) //去除后面的.js
    }))
    .pipe(gulp.dest(dirname))
    .pipe(browserSync.reload({
      stream: true
    }))
}
gulp.task('es6Watch', function () {
  return gulp.watch('src/js/**/*.js.es6', function (e) {
    es6ToEs5(e)
  })
})
gulp.task('htmlWatch', function () {
  return gulp.watch('src/html/**/*.html', function (e) {
    console.log(e)
    gulp.src(e.path)
      .pipe(browserSync.reload({
        stream: true
      }))

  })
})
gulp.task('dev', ['es6Watch', 'sassWatch', 'server', 'htmlWatch'], function () {
  // gulpSequence(['sassWatch'],function(){})
})

// gulp.task('default', ['es6Watch'],function () {})