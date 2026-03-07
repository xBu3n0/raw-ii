import { UserEntity } from "@/services/auth/domain/entities/user.entity";

export class RegisterOutput {
    constructor(
        readonly id: number,
        readonly username: string,
        readonly email: string,
    ) {}

    static fromEntity(userEntity: UserEntity): RegisterOutput {
        if (userEntity.id?.value === undefined) {
            throw new Error(
                "O Id do usuário precisa existir para criar a resposta",
            );
        }

        return new this(
            userEntity.id.value,
            userEntity.username.value,
            userEntity.email.value,
        );
    }
}
