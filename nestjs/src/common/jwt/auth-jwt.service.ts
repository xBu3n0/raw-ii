import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@/common/dtos/user.dto";
import { StringValue } from "ms";
import { IAuthJwtService } from "./iauth-jwt.service";

@Injectable()
export class AuthJwtService implements IAuthJwtService {
    constructor(private readonly jwtService: JwtService) {}

    async isTokenValid(token: string): Promise<boolean> {
        if (!token) {
            return false;
        }

        try {
            await this.decode(token);

            return true;
        } catch {
            return false;
        }
    }

    sign(
        payload: UserDto,
        options?: { expiresIn?: StringValue | number },
    ): string {
        return this.jwtService.sign(Object.assign({}, payload), options);
    }

    async isTokenSign(token: string): Promise<boolean> {
        try {
            await this.jwtService.verifyAsync(token);

            return true;
        } catch {
            return false;
        }
    }

    async decode(token: string): Promise<UserDto> {
        if (!(await this.isTokenSign(token))) {
            throw new UnauthorizedException("Invalid token");
        }

        const decoded = this.jwtService.decode<
            UserDto & { iat: number; exp: number }
        >(token);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { iat, exp, ...user } = decoded;

        return user;
    }

    extractToken(header: string | undefined): string | undefined {
        const [type, token] = header?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
