import { LoginRequest } from "@auth/dtos/requests/login.request";
import { LoginResponse, Tokens } from "@auth/dtos/responses/login.response";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@/common/dtos/user.dto";
import { verify } from "argon2";
import { IAuthUserRepository } from "../../domain/repositories/auth-user.repository";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(login: LoginRequest): Promise<LoginResponse> {
        const authUser = await this.authUserRepository.findByEmail(login.email);

        if (!authUser || !(await verify(authUser.password, login.password))) {
            throw new UnauthorizedException("Email e/ou senha invalidos");
        }

        return new LoginResponse(
            new UserDto(authUser),
            new Tokens(
                this.jwtService.sign(Object.assign({}, new UserDto(authUser))),
                this.jwtService.sign(Object.assign({}, new UserDto(authUser)), {
                    expiresIn: "7d",
                }),
            ),
        );
    }
}
