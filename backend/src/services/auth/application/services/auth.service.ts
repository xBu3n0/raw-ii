import { Inject, Injectable } from "@nestjs/common";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { Tokens } from "../../dtos/responses/login.response";
import { UserDto } from "@/common/dtos/user.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    refreshTokens(user: UserDto): Tokens {
        return new Tokens(
            this.jwtService.sign(Object.assign({}, user)),
            this.jwtService.sign(Object.assign({}, user), {
                expiresIn: "7d",
            }),
        );
    }
}
