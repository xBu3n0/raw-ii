import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { UserEntity } from "@auth/domain/entities/user.entity";

export class RegisterResponse {
    private constructor(
        readonly id: number,
        readonly username: string,
        readonly email: string,
    ) {}

    static fromEntity(userEntity: UserEntity) {
        if (userEntity.id?.value === undefined) {
            throw new InvalidDomainException(
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
