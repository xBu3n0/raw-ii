import { Inject, Injectable } from "@nestjs/common";
import { UserDto } from "@/common/dtos/user.dto";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { InvalidCredentialsException } from "@auth/domain/exceptions/invalid-credentials.exception";
import { IAuthJwtService } from "@/common/jwt/iauth-jwt.service";
import { Email } from "@/common/primitives/user/email.primitive";
import { Tokens } from "@/services/auth/common/types/token.type";
import { LoginInput } from "./login.input";
import { LoginOutput } from "./login.output";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        @Inject("AUTH_JWT_SERVICE")
        private readonly authJwtService: IAuthJwtService,
    ) { }

    async execute(login: LoginInput): Promise<LoginOutput> {
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

        return new LoginOutput(
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
