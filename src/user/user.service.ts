import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './../auth/dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/jwt.strategy';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> { //criando user com o prisma
    data.senha = await bcrypt.hash(data.senha,10)
    try {
      const createdUser = await this.prisma.user.create({data});
      createdUser.senha = undefined;
      return createdUser;
    } catch (error) {
      console.log(error)
      throw new HttpException('Verifique os dados e tente novamente.', HttpStatus.BAD_REQUEST);
    }
    
  //pegando a senha e passando pelo bcrypt embaralhando 10x  
    // return await this.prisma.user.create({ data });
  }
          //se der erro voltar para CreateUserDto
  async findByLogin(login: LoginDto): Promise<User>{ //criando login
    const user = await this.prisma.user.findFirst({
      where: {
        email: login.email,
      },
    }); //testando o dado com o primeiro item encontrado
    
    const senhaIgual = await bcrypt.compare(login.senha,user.senha); //comparando a senha inserida com a senha no banco criptografada com bcryot
    
    if(!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND,)
    }//parando o login quando nao encontrado o user

    if(!senhaIgual) {
      throw new HttpException('Senha inválida.', HttpStatus.UNAUTHORIZED,)
    } //parando o login quando senha nao confere

    return user; //retornando user quando validado
  }

  async validateUser(payload: JwtPayload): Promise<User> { //validacao do user pelo payload
    const user = await this.prisma.user.findFirst({
      where: 
      { email: payload.email,
      }
    })

    if(!user) {
      throw new HttpException('Token inválido.', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  findAll():Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUnique({where: {id}});
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    data.senha = await bcrypt.hash(data.senha,10)
    return await this.prisma.user.update({data, where: {id}});
  }

  async remove(id: number): Promise<User> {
    return await this.prisma.user.delete({where: {id}});
  }
}