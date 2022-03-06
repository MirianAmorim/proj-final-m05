import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const moment = require("moment");

export class CreateUserDto extends User {
  @IsString()
  @ApiProperty({
    example: 'Mirian Amorim',
    description: `O nome será utilizado para identificar o usuário.` ,
  })
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Senha fraca',
  })
  senha: string;
}
