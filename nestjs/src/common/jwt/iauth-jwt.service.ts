import { UserDto } from "@/common/dtos/user.dto";

export abstract class IAuthJwtService {
    abstract isTokenValid(token: string): Promise<boolean>;

    abstract sign(
        payload: UserDto,
        options?: { expiresIn?: string | number },
    ): string;

    abstract isTokenSign(token: string): Promise<boolean>;

    abstract decode(token: string): Promise<UserDto>;

    abstract extractToken(header: string | undefined): string | undefined;
}
