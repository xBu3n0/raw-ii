import { LoginUseCase } from "@auth/application/useCases/login.use-case";
import { RegisterUseCase } from "@auth/application/useCases/register.use-case";
import { CreateUserRequest } from "@auth/dtos/requests/create-user.request";
import { LoginRequest } from "@auth/dtos/requests/login.request";
import { CreateUserResponse } from "@auth/dtos/responses/create-user.response";
import { LoginResponse, Tokens } from "@auth/dtos/responses/login.response";
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
        @Body() createUserRequest: CreateUserRequest,
    ): Promise<CreateUserResponse> {
        return this.registerUseCase.execute(createUserRequest);
    }

    @Public()
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
        return this.loginUseCase.execute(loginRequest);
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
