import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './filter';
import { TransformInterceptor } from './filter/interceptor';
import { ValidationPipe } from './pipe';
const PORT = 3000
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  console.log(`服务运行在${PORT}端口`)
  await app.listen(PORT);
}
bootstrap();
