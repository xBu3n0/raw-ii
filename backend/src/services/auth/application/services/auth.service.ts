import { Inject, Injectable } from "@nestjs/common";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { Tokens } from "@auth/dtos/responses/login.response";
import { UserDto } from "@/common/dtos/user.dto";
import { AuthJwtService } from "@/common/jwt/auth-jwt.service";

@Injectable()
export class AuthService {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly authJwtService: AuthJwtService,
    ) {}

    refreshTokens(user: UserDto): Tokens {
        return new Tokens(
            this.authJwtService.sign(Object.assign({}, user)),
            this.authJwtService.sign(Object.assign({}, user), {
                expiresIn: "7d",
            }),
        );
    }
}
