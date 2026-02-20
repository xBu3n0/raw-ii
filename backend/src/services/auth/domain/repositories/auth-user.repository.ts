import { AuthUser } from "generated/prisma/client";
import { UserEntity } from "../entities/user.entity";

export abstract class IAuthUserRepository {
    abstract create(register: UserEntity): Promise<AuthUser>;
}
