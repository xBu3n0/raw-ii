import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../dtos/user.dto";

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
            console.log("verify: ", token);
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

        return this.jwtService.decode(token);
    }

    extractToken(header: string | undefined): string | undefined {
        const [type, token] = header?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
