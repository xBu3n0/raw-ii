import { UserEntity } from "@auth/domain/entities/user.entity";

export class CreateUserResponse {
    private constructor(
        readonly id: number,
        readonly name: string,
        readonly email: string,
    ) {}

    static fromEntity(user: UserEntity) {
        return new this(user.id!.value, user.username.value, user.email.value);
    }
}
