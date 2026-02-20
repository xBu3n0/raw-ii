import { Inject, Injectable } from "@nestjs/common";
import { CreateUserResponse } from "@auth/dtos/responses/create-user.response";
import { CreateUserRequest } from "@auth/dtos/requests/create-user.request";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { UserDto } from "src/common/dtos/user.dto";
import { hash } from "argon2";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        private readonly userCreated: UserCreated,
    ) {}

    async execute(register: CreateUserRequest): Promise<CreateUserResponse> {
        const authUser = await this.authUserRepository.create(
            UserEntity.fromPlain({
                ...register,
                password: await hash(register.password),
                id: undefined,
            }),
        );

        this.userCreated.emit(new UserDto(authUser));

        return CreateUserResponse.fromEntity(UserEntity.fromPlain(authUser));
    }
}
