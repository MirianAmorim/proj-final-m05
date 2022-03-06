import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

const moment = require("moment");

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Mirian Amorim',
    description: `O nome será utilizado para identificar o usuário.` ,
  })
  nome: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  senha: string;
}
