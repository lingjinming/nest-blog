import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async register(user: RegisterUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });
    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }
    let newUser = new User();
    newUser.username = user.username;
    newUser.nickName = user.nickName;
    newUser.email = user.email;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.userRepository.findOneBy({
        username: user.username,
      });
  
      if(!foundUser) {
        throw new HttpException('用户名不存在', 200);
      }
      if(foundUser.password !== md5(user.password)) {
        throw new HttpException('密码错误', 200);
      }
      return foundUser;
  }
}
