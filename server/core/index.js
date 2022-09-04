/**
 * 封装koa mvc基础架构初始化工作
 */
const path = require('path');
const Koa = require('koa');
const {
  initConfig,
  initController,
  initService,
  initModel,
  initRouter,
  initMiddleware,
  initExtend,
  initSchedule,
} = require('./loader');


class Application {
  constructor() {
    this.$app = new Koa();
    // 注册默认内置中间件
    this.initDefaultMiddleware();

    this.$config = initConfig(this);
    this.$controller = initController(this);
    this.$service = initService(this);
    this.$middleware = initMiddleware(this);
    this.$model = initModel(this);
    this.$router = initRouter(this);

    // this.$service.font.initFonts();
    initExtend(this);
    initSchedule(this);

    this.$app.use(async (ctx, next) => {
      this.ctx = ctx;
      await next();
    });
    this.$app.use(this.$router.routes());

    this.catchNodeError();
  }

  catchNodeError() {
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at:', p, 'reason:', reason);
    });

    process.stdout.on('error', function(err) {
      if (err.code == 'EPIPE') {
        console.log(err);
      }
    });
  }

  // 设置内置中间件
  initDefaultMiddleware() {
    const koaStatic = require('koa-static');
    const koaBody = require('koa-body');
    const cors = require('koa2-cors');
    const views = require('koa-views');

    // 配置静态web
    this.$app.use(koaStatic(path.resolve(__dirname, '../public')), {
      gzip: true,
      setHeaders: function(res) {
        res.header('Access-Control-Allow-Origin', '*');
      },
    });

    //跨域处理
    this.$app.use(cors());

    // body接口数据处理
    this.$app.use(
      koaBody({
        multipart: true,
        formidable: {
          maxFileSize: 3000 * 1024 * 1024, // 设置上传文件大小最大限制，默认30M
        },
      }),
    );

    //配置需要渲染的文件路径及文件后缀
    this.$app.use(
      views(path.join(__dirname, '../views'), {
        extension: 'ejs',
      }),
    );
  }

  // 启动服务
  start(port) {
    this.$app.listen(port, () => {
      console.log('server is starting........!');
    });
  }
}

module.exports = Application;
