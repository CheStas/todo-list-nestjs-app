import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;
}

export class CreateUserDto extends PartialType(UserDto) {}
