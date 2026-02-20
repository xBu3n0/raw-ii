import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "@/common/dtos/user.dto";

@Injectable()
export class AuthJwtService {
    constructor(private readonly jwtService: JwtService) {}

    check(token: string): boolean {
        if (!token) {
            return false;
        }

        try {
            this.decode(token);

            return true;
        } catch {
            return false;
        }
    }

    async checkAsync(token: string): Promise<boolean> {
        try {
            await this.jwtService.verifyAsync(token);

            return true;
        } catch {
            return false;
        }
    }

    verify(token: string): boolean {
        try {
            this.jwtService.verify(token);

            return true;
        } catch {
            return false;
        }
    }

    decode(token: string): UserDto {
        if (!this.verify(token)) {
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
