import { Email } from "@/common/primitives/user/email.primitive";
import { UserEntity } from "@auth/domain/entities/user.entity";

export abstract class IAuthUserRepository {
    abstract create(register: UserEntity): Promise<UserEntity>;
    abstract findByEmail(email: Email): Promise<UserEntity | null>;
}
