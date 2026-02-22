import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { RegisterUseCase } from "./register.use-case";
import { UserCreated } from "@auth/domain/events/user-created.event";
import { CreateUserResponse } from "@auth/dtos/responses/create-user.response";
import { EmailAlreadyUsedException } from "@auth/domain/exceptions/email-already-exists.exception";
import { Email } from "@/common/primitives/user/email.primitive";

describe("RegisterUseCase", () => {
    let sut: RegisterUseCase;

    const userRef = UserEntity.fromPlain({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: "password123",
    });

    describe("register", () => {
        beforeAll(() => {
            const authUserRepository: IAuthUserRepository = {
                create: jest
                    .fn()
                    .mockImplementation(
                        (user: UserEntity): Promise<UserEntity> => {
                            if (user.email.value === userRef.email.value) {
                                throw new Error("Email já utilizado");
                            }

                            return Promise.resolve(
                                UserEntity.fromPlain({
                                    username: user.username.value,
                                    email: user.email.value,
                                    password: user.password.value,
                                    id: 2,
                                }),
                            );
                        },
                    ),
                findByEmail: jest.fn(),
            };

            const userCreated = {
                emit: jest.fn(),
            } as unknown as UserCreated;

            sut = new RegisterUseCase(authUserRepository, userCreated);
        });

        it("Usuário com email não utilizado consegue criar uma conta", async () => {
            // Given
            const differentEmail = new Email(userRef.email.value + "c");

            const newUser = {
                username: userRef.username.value,
                email: differentEmail.value,
                password: userRef.password.value,
            };

            // When
            const result = expect(sut.execute(newUser));

            // Then
            await result.resolves.toEqual(
                CreateUserResponse.fromEntity(
                    UserEntity.fromPlain({
                        id: 2,
                        username: newUser.username,
                        email: newUser.email,
                        password: newUser.password,
                    }),
                ),
            );
        });

        it("Usuário com email já utilizado não consegue criar uma conta", async () => {
            // Given
            const newUser = {
                username: userRef.username.value,
                email: userRef.email.value,
                password: userRef.password.value,
            };

            // When
            const result = expect(() => sut.execute(newUser));

            // Then
            await result.rejects.toThrow(EmailAlreadyUsedException);
        });
    });
});
