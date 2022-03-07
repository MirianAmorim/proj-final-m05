import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthRequest } from './models/AuthRequest';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async login(@Body() req: AuthRequest){
        return this.authService.login(req.user);
    } //autenticar o login

    @Get()
    @UseGuards(AuthGuard()) //endpoint para autenticacao
    async checkLogin(){
        return 'Usuário logado';
    } //confirmacao de autenticacao
}
