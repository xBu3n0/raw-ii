import { Inject, Injectable } from "@nestjs/common";
import { CreateUserResponse } from "@auth/dtos/responses/create-user.response";
import { CreateUserRequest } from "@auth/dtos/requests/create-user.request";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { UserDto } from "@/common/dtos/user.dto";
import { EmailAlreadyUsedException } from "@auth/domain/exceptions/email-already-exists.exception";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly userCreated: UserCreated,
    ) {}

    async execute(register: CreateUserRequest): Promise<CreateUserResponse> {
        const newUser = UserEntity.fromPlain({
            ...register,
            id: undefined,
        });

        try {
            const userEntity = await this.authUserRepository.create(newUser);
            this.userCreated.emit(new UserDto(userEntity));

            return CreateUserResponse.fromEntity(userEntity);
        } catch {
            throw new EmailAlreadyUsedException("Email já utilizado");
        }
    }
}
