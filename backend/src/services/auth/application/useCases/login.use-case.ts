import { LoginRequest } from "@auth/dtos/requests/login.request";
import { LoginResponse, Tokens } from "@auth/dtos/responses/login.response";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/common/dtos/user.dto";
import { verify } from "argon2";

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async execute(login: LoginRequest): Promise<LoginResponse> {
        const authUser = await this.prismaService.authUser.findUnique({
            where: { email: login.email },
        });

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
