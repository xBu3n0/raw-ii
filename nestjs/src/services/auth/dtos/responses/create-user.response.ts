import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { UserEntity } from "@auth/domain/entities/user.entity";

export class CreateUserResponse {
    private constructor(
        readonly id: number,
        readonly username: string,
        readonly email: string,
    ) {}

    static fromEntity(username: UserEntity) {
        if (username.id?.value === undefined) {
            throw new InvalidDomainException(
                "O Id do usuário precisa existir para criar a resposta",
            );
        }

        return new this(
            username.id.value,
            username.username.value,
            username.email.value,
        );
    }
}
