import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; //token
import { UnauthorizedError } from './errors/unauthorized.error';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/UserPayload';
import { UserService } from '../user/user.service';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
    constructor (
        private readonly userService: UserService, //importando service para metodo de login
        private readonly jwtService: JwtService, //criador do token de acesso
        ) {}

        async login(user: User): Promise<UserToken> {
            const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            };
        
            return {
            access_token: this.jwtService.sign(payload),
            };
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
        'Email ou senha incorretos.',
        );
    }
}
