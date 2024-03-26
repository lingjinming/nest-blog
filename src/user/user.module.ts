import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { CacheModule } from 'src/common/cache/cache.module';

// 引入typeorm和Enetiy实例
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Module({
  // imports: [MongooseModule.forFeature([{ name: 'Users', schema: userSchema }])],
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
