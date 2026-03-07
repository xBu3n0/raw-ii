import { UserEntity } from "@auth/domain/entities/user.entity";
import { RegisterUseCase } from "./register.use-case";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { EmailAlreadyUsedException } from "@auth/domain/exceptions/email-already-exists.exception";
import { Email } from "@/common/primitives/user/email.primitive";
import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { RegisterOutput } from "./register.output";
import { RegisterInput } from "./register.input";
import { EventEmitter } from "@/common/events/ievent.emitter";

describe("RegisterUseCase", () => {
    const userRef = UserEntity.fromPlain({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: "password123",
    });

    function createRegisterUseCase(): {
        registerUseCase: RegisterUseCase;
        authUserRepository: IAuthUserRepository;
        eventEmitter: EventEmitter;
    } {
        jest.mock("@auth/domain/events/user-created.event");

        const authUserRepository = {
            create: jest
                .fn()
                .mockImplementation(
                    async (newUser: UserEntity): Promise<UserEntity> => {
                        if (newUser.email.value === userRef.email.value) {
                            throw new Error();
                        }

                        return Promise.resolve(
                            UserEntity.fromPlain({
                                id: 2,
                                username: newUser.username.value,
                                email: newUser.email.value,
                                password: newUser.password.value,
                            }),
                        );
                    },
                ),
        } as unknown as IAuthUserRepository;
        const eventEmitter: EventEmitter = {
            emit: jest.fn(),
        } as unknown as EventEmitter;
        const registerUseCase = new RegisterUseCase(
            authUserRepository,
            eventEmitter,
        );

        return {
            registerUseCase,
            authUserRepository,
            eventEmitter,
        };
    }

    describe("register", () => {
        it("Usuário com email não utilizado consegue criar uma conta", async () => {
            // Given
            const { registerUseCase: sut, eventEmitter } =
                createRegisterUseCase();
            const userCreatedEmit = jest.spyOn(eventEmitter, "emit");

            const newUser = new RegisterInput(
                userRef.username.value,
                Email.create(userRef.email.value + "c").value,
                userRef.password.value,
            );

            // When
            const result = sut.execute(newUser);

            // Then
            await expect(result).resolves.toEqual(
                RegisterOutput.fromEntity(
                    UserEntity.fromPlain({
                        id: 2,
                        ...newUser,
                    }),
                ),
            );
            expect(userCreatedEmit).toHaveBeenCalledWith(
                new UserCreated(2, newUser.username, newUser.email),
            );
        });

        it("Usuário com email já utilizado não consegue criar uma conta", async () => {
            // Given
            const newUser = new RegisterInput(
                userRef.username.value,
                userRef.email.value,
                userRef.password.value,
            );
            const { registerUseCase: sut, eventEmitter } =
                createRegisterUseCase();
            const userCreatedEmit = jest.spyOn(eventEmitter, "emit");

            // When
            const result = sut.execute(newUser);

            // Then
            await expect(result).rejects.toThrow(EmailAlreadyUsedException);
            expect(userCreatedEmit).not.toHaveBeenCalled();
        });
    });
});
