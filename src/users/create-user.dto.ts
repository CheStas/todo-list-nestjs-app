import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ required: false })
  name: string;
}

export class CreateUserDto extends PartialType(UserDto) {}
