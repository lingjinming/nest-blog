// user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  Param,
  Post,
  Put,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreateUserDTO,
  EditUserDTO,
  LoginUserDto,
  RegisterUserDto,
} from './dto/user.dto';
import { User } from '../interface/user/user.interface';
import { UserService } from './user.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtModule, JwtService } from '@nestjs/jwt';

interface UserResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @ApiOperation({
    summary: '用户注册',
  })
  @Post('register')
  register(@Body(ValidationPipe) data: RegisterUserDto) {
    return this.userService.register(data);
  }

  @ApiOperation({
    summary: '用户登录',
  })
  @Post('login')
  async login(
    @Body(ValidationPipe) user: LoginUserDto,
    @Res({ passthrough: true }) res,
  ) {
    const foundUser = await this.userService.login(user);

    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      res.setHeader('token', token);
      return 'login success';
    } else {
      return 'login fail';
    }
  }
}
