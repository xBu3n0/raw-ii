import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { EmailAlreadyUsedException } from "@auth/domain/exceptions/email-already-exists.exception";
import { RegisterInput } from "./register.input";
import { RegisterOutput } from "./register.output";
import { EventEmitter } from "@/common/events/ievent.emitter";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject("AUTH_USER_REPOSITORY")
        private readonly authUserRepository: IAuthUserRepository,
        @Inject("RMQ_EVENT_EMMITER")
        private readonly eventEmitter: EventEmitter,
    ) {}

    async execute(register: RegisterInput): Promise<RegisterOutput> {
        const newUser = UserEntity.fromModel({
            ...register,
            id: undefined,
        });

        try {
            const userEntity = await this.authUserRepository.create(newUser);
            this.eventEmitter.emit(
                new UserCreated(
                    userEntity.id!.value,
                    userEntity.username.value,
                    userEntity.email.value,
                ),
            );

            return RegisterOutput.fromEntity(userEntity);
        } catch {
            throw new EmailAlreadyUsedException("Email já utilizado");
        }
    }
}
