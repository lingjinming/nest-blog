import { IsString, IsInt, MinLength, MaxLength,IsEmail, IsNotEmpty, Length, Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
// user.dto.ts
export class CreateUserDTO {
  @ApiProperty()
  readonly _id: number;

  @IsString()
  @ApiProperty({ type: 'string', example: '用户名称' })

  @MinLength(10, {
    message: "Name is too short"
  })
  @MaxLength(50, {
    message: "Name is too long"
  })
  @ApiProperty()
  readonly user_name: string;

  @ApiProperty()
  readonly password: string;
}

export class EditUserDTO {
  @ApiProperty()
  readonly user_name: string;
  @ApiProperty()
  readonly password: string;
}
export class RegisterUserDto {
  @IsString()
  @Length(6, 30)
  @Matches(/^[a-zA-Z0-9#$%_-]+$/, {
      message: '用户名只能是字母、数字或者 #、$、%、_、- 这些字符'
  })
  @IsNotEmpty({
      message: "用户名不能为空"
  })
  username: string;
  
  @IsNotEmpty({
      message: '昵称不能为空'
  })
  nickName: string;
  
  @IsNotEmpty({
      message: '密码不能为空'
  })
  @MinLength(6, {
      message: '密码不能少于 6 位'
  })
  password: string;
  
  @IsNotEmpty({
      message: '邮箱不能为空'
  })
  @IsEmail({}, {
      message: '不是合法的邮箱格式'
  })
  email: string;
  
  @IsNotEmpty({
      message: '验证码不能为空'
  })
  captcha: string;
}


export class LoginUserDto {

  @IsNotEmpty({
      message: "用户名不能为空"
  })
  username: string;
  
  @IsNotEmpty({
      message: '密码不能为空'
  })
  password: string;
  
}
