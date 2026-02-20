import { AuthUser } from "@generated/prisma/client";
import { UserEntity } from "@auth/domain/entities/user.entity";

export abstract class IAuthUserRepository {
    abstract create(register: UserEntity): Promise<AuthUser>;
    abstract findByEmail(email: string): Promise<AuthUser | null>;
}
