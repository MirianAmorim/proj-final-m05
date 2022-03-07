import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; //token
import { UnauthorizedError } from './errors/unauthorized.error';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService: UserService, //importando service para metodo de login
        private readonly jwtService: JwtService, //criador do token de acesso
        ) {}

    async login(loginUserDto: LoginDto) {
        const user = await this.userService.findByLogin(loginUserDto);
            //procurar usuario no banco de dados com a informacao vinda do BODY
        const token = this._createToken(user);
        return {
            email: user.email,
            ...token
        };
    } //criando processo de login
    private _createToken ({email}: LoginDto): any {
        const user: JwtPayload = { email }; //instanciando user pelo email
        const accessToken = this.jwtService.sign(user); //criando token
        return {
            expiresIn: process.env.EXPIRESIN, //tempo de expiracao do token vindo do .env
            accessToken, 
        } //criando token para usuario validado
    }
    async validateUser(email: string, senha: string): Promise<User> {
        const user = await this.userService.findByEmail(email);
    
        if (user) {
        const senhaValid = await bcrypt.compare(senha, user.senha);
    
        if (senhaValid) {
            return {
            ...user,
            senha: undefined,
            };
        }
        }
    
        throw new UnauthorizedError(
        'Email address or password provided is incorrect.',
        );
    }
}
