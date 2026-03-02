import { LoginRequest } from "@auth/dtos/requests/login.request";
import { LoginResponse, Tokens } from "@auth/dtos/responses/login.response";
import { Inject, Injectable } from "@nestjs/common";
import { UserDto } from "@/common/dtos/user.dto";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { InvalidCredentialsException } from "@auth/domain/exceptions/invalid-credentials.exception";
import { IAuthJwtService } from "@/common/jwt/iauth-jwt.service";
import { Email } from "@/common/primitives/user/email.primitive";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        @Inject("AUTH_JWT_SERVICE")
        private readonly authJwtService: IAuthJwtService,
    ) {}

    async execute(login: LoginRequest): Promise<LoginResponse> {
        const userEntity = await this.authUserRepository.findByEmail(
            Email.create(login.email),
        );

        if (
            !userEntity ||
            !(await this.authJwtService.verifyPassword(
                userEntity.password.value,
                login.password,
            ))
        ) {
            throw new InvalidCredentialsException("Email e/ou senha invalidos");
        }

        return new LoginResponse(
            new UserDto(userEntity),
            new Tokens(
                this.authJwtService.sign(
                    Object.assign({}, new UserDto(userEntity)),
                ),
                this.authJwtService.sign(
                    Object.assign({}, new UserDto(userEntity)),
                    {
                        expiresIn: "7d",
                    },
                ),
            ),
        );
    }
}
