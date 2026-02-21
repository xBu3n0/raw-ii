import { LoginRequest } from "@auth/dtos/requests/login.request";
import { LoginResponse, Tokens } from "@auth/dtos/responses/login.response";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@/common/dtos/user.dto";
import { verify } from "argon2";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { InvalidCredentialsException } from "@auth/domain/exceptions/invalid-credentials.exception";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(login: LoginRequest): Promise<LoginResponse> {
        const userEntity = await this.authUserRepository.findByEmail(
            login.email,
        );

        if (
            !userEntity ||
            !(await verify(userEntity.password.value, login.password))
        ) {
            throw new InvalidCredentialsException("Email e/ou senha invalidos");
        }

        return new LoginResponse(
            new UserDto(userEntity),
            new Tokens(
                this.jwtService.sign(
                    Object.assign({}, new UserDto(userEntity)),
                ),
                this.jwtService.sign(
                    Object.assign({}, new UserDto(userEntity)),
                    {
                        expiresIn: "7d",
                    },
                ),
            ),
        );
    }
}
