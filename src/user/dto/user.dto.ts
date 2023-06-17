import { IsString, IsInt, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
// user.dto.ts
export class CreateUserDTO {
  @ApiProperty()
  readonly _id: number;

  @IsString()
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
