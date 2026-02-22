import { UserEntity } from "@auth/domain/entities/user.entity";

export abstract class IAuthUserRepository {
    abstract create(register: UserEntity): Promise<UserEntity>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
}
