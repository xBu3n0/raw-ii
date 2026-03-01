import { UserEntity } from "@auth/domain/entities/user.entity";
import { RegisterUseCase } from "./register.use-case";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { CreateUserResponse } from "@auth/dtos/responses/create-user.response";
import { EmailAlreadyUsedException } from "@auth/domain/exceptions/email-already-exists.exception";
import { Email } from "@/common/primitives/user/email.primitive";
import { CreateUserRequest } from "@auth/dtos/requests/create-user.request";
import { IAuthUserRepository } from "../../domain/repositories/auth-user.repository";

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
        userCreatedEvent: UserCreated;
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
        const userCreatedEvent = new UserCreated({ emit: jest.fn() });
        const registerUseCase = new RegisterUseCase(
            authUserRepository,
            userCreatedEvent,
        );

        return {
            registerUseCase,
            authUserRepository,
            userCreatedEvent,
        };
    }

    describe("register", () => {
        it("Usuário com email não utilizado consegue criar uma conta", async () => {
            // Given
            const { registerUseCase: sut, userCreatedEvent } =
                createRegisterUseCase();
            const userCreatedEmit = jest.spyOn(userCreatedEvent, "emit");

            const newUser: CreateUserRequest = {
                username: userRef.username.value,
                email: new Email(userRef.email.value + "c").value,
                password: userRef.password.value,
            };

            // When
            const result = sut.execute(newUser);

            // Then
            await expect(result).resolves.toEqual(
                CreateUserResponse.fromEntity(
                    UserEntity.fromPlain({
                        id: 2,
                        username: newUser.username,
                        email: newUser.email,
                        password: newUser.password,
                    }),
                ),
            );
            expect(userCreatedEmit).toHaveBeenCalled();
        });

        it("Usuário com email já utilizado não consegue criar uma conta", async () => {
            // Given
            const newUser: CreateUserRequest = {
                username: userRef.username.value,
                email: userRef.email.value,
                password: userRef.password.value,
            };
            const { registerUseCase: sut, userCreatedEvent } =
                createRegisterUseCase();
            const userCreatedEmit = jest.spyOn(userCreatedEvent, "emit");

            // When
            const result = sut.execute(newUser);

            // Then
            await expect(result).rejects.toThrow(EmailAlreadyUsedException);
            expect(userCreatedEmit).not.toHaveBeenCalled();
        });
    });
});
