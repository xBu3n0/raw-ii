import { LoginUseCase } from "@auth/application/useCases/login/login.use-case";
import { RegisterUseCase } from "@auth/application/useCases/register/register.use-case";
import { RegisterRequest } from "@/services/auth/infrastructure/dtos/requests/register.request";
import { LoginRequest } from "@auth/infrastructure/dtos/requests/login.request";
import { RegisterResponse } from "@/services/auth/infrastructure/dtos/responses/register.response";
import { LoginResponse } from "@auth/infrastructure/dtos/responses/login.response";
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
} from "@nestjs/common";
import type { Request } from "express";
import { UserDto } from "@/common/dtos/user.dto";
import { Public } from "@/common/guards/auth/public.decorator";
import { AuthService } from "@auth/application/services/auth.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Tokens } from "@/services/auth/common/types/token.type";
import { RegisterInput } from "@auth/application/useCases/register/register.input";
import { LoginInput } from "@auth/application/useCases/login/login.input";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly authService: AuthService,
    ) {}

    @Public()
    @Post("register")
    async register(
        @Body() registerRequest: RegisterRequest,
    ): Promise<RegisterResponse> {
        return RegisterResponse.fromRegisterOutput(
            await this.registerUseCase.execute(
                new RegisterInput(
                    registerRequest.username,
                    registerRequest.email,
                    registerRequest.password,
                ),
            ),
        );
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
        return LoginResponse.fromLoginOutput(
            await this.loginUseCase.execute(
                new LoginInput(loginRequest.email, loginRequest.password),
            ),
        );
    }

    @Post("logout")
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async logout(): Promise<void> {}

    @Post("refresh")
    @ApiBearerAuth()
    refresh(@Req() req: Request): Tokens {
        const user = req.user!;

        return this.authService.refreshTokens(user);
    }

    @Get("me")
    @ApiBearerAuth()
    check(@Req() req: Request): UserDto {
        return req.user!;
    }
}
