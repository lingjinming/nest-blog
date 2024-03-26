import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  public client;
  constructor(private readonly configService: ConfigService) {
    this.getClient();
  }

  async getClient() {
    const client = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'), // 主机，默认为localhost
      port: this.configService.get<number>('REIDS_PORT', 6379), // 端口号
      password: this.configService.get('REIDS_PASSWD', ''), // 密码
      db: this.configService.get<number>('REIDS_DB', 3),
    });
    // 连接成功提示
    client.on('connect', () =>
      Logger.log(
        `redis连接成功，端口${this.configService.get<number>(
          'REIDS_PORT',
          3306,
        )}`,
      ),
    );
    client.on('error', (err) => Logger.error('Redis Error', err));

    this.client = client;
  }

  public async set(key: string, val: string, second?: number) {
    const res = await this.client.set(key, val, 'EX', second);
    return res === 'OK';
  }

  public async get(key: string) {
    const res = await this.client.get(key);
    return res;
  }
}
