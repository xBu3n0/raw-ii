import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { UserDto } from "@/common/dtos/user.dto";
import { EmailAlreadyUsedException } from "@auth/domain/exceptions/email-already-exists.exception";
import { RegisterInput } from "./register.input";
import { RegisterOutput } from "./register.output";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly userCreated: UserCreated,
    ) {}

    async execute(register: RegisterInput): Promise<RegisterOutput> {
        const newUser = UserEntity.fromPlain({
            ...register,
            id: undefined,
        });

        try {
            const userEntity = await this.authUserRepository.create(newUser);
            this.userCreated.emit(new UserDto(userEntity));

            return RegisterOutput.fromEntity(userEntity);
        } catch {
            throw new EmailAlreadyUsedException("Email já utilizado");
        }
    }
}
