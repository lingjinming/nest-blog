import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  Session,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { existsSync, cpSync, mkdirSync, rmSync } from 'fs';
import * as fs from 'fs';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './login.guard';
const OSS = require('ali-oss');

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('session')
  getSession(@Session() session): string {
    console.log(session);
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }
  @Get('token')
  @UseGuards(LoginGuard)

  getToken() {
    return 'token'
  }
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadFiles(@UploadedFiles() files, @Body() body) {
    console.log('body', body);
    console.log('files', files);
    const fileName = body.name.match(/(.+)\-\d+$/)[1];
    const chunkDir = 'uploads/chunks_' + fileName;
    console.log('chunkDir', chunkDir);
    if (!existsSync(chunkDir)) {
      mkdirSync(chunkDir);
    }
    cpSync(files[0].path, chunkDir + '/' + body.name);
    rmSync(files[0].path);
  }
  @Get('merge')
  merge(@Query('name') name: string) {
    const chunkDir = 'uploads/chunks_' + name;

    const files = fs.readdirSync(chunkDir);
    let count = 0;
    let startPos = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream
        .pipe(
          fs.createWriteStream('uploads/' + name, {
            start: startPos,
          }),
        )
        .on('finish', () => {
          count++;

          if (count === files.length) {
            fs.rm(
              chunkDir,
              {
                recursive: true,
              },
              () => {},
            );
          }
        });

      startPos += fs.statSync(filePath).size;
    });
  }

  @Post('oss')
  async oss(@Body() body) {
    console.log('body', body);
    let config = body;
    const client = new OSS(config);

    const date = new Date();

    date.setDate(date.getDate() + 1);

    const res = client.calculatePostSignature({
      expiration: date.toISOString(),
      conditions: [
        ['content-length-range', 0, 1048576000], //设置上传文件的大小限制。
      ],
    });

    console.log(res);

    const location = await client.getBucketLocation();

    const host = `http://${config.bucket}.${location.location}.aliyuncs.com`;

    return host;
  }
}
