import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './filter';
import { TransformInterceptor } from './filter/interceptor';
import { ValidationPipe } from './pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as path from 'path';

const PORT = 3000;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //设置静态文件目录
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  // 设置全局api前缀
  app.setGlobalPrefix('api'); 
  // 设置session
  app.use(session({
    secret: 'ming',
    resave: false,
    saveUninitialized: false
  }));
  // 允许跨域
  app.enableCors()
  // 设置swaager
  const options = new DocumentBuilder()
    .setTitle('meeting-room')
    .setDescription('meeting-room API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalFilters(new ExceptionsFilter()); // 全局注册错误的过滤器(错误异常)
  app.useGlobalInterceptors(new TransformInterceptor()); // 全局注册成功过滤器
  app.useGlobalPipes(new ValidationPipe());//对请求体做校验

  console.log(`服务运行在${PORT}端口`);
  await app.listen(PORT);
}
bootstrap();
