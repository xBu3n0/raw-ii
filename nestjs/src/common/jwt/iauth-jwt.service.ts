import { UserDto } from "@/common/dtos/user.dto";

export abstract class IAuthJwtService {
    abstract check(token: string): boolean;

    abstract sign(
        payload: UserDto,
        options?: { expiresIn?: string | number },
    ): string;

    abstract verifyPassword(
        password: string,
        plainPassword: string,
    ): Promise<boolean>;

    abstract checkAsync(token: string): Promise<boolean>;

    abstract verify(token: string): boolean;

    abstract decode(token: string): UserDto;

    abstract extractToken(header: string | undefined): string | undefined;
}
