import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { AuthJwtService } from "@/common/jwt/auth-jwt.service";
import { UserDto } from "@/common/dtos/user.dto";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { LoginUseCase } from "./login.use-case";
import { LoginResponse, Tokens } from "@auth/dtos/responses/login.response";
import { InvalidCredentialsException } from "@auth/domain/exceptions/invalid-credentials.exception";
import { Password } from "@/common/primitives/user/password.primitive";
import { Email } from "@/common/primitives/user/email.primitive";

describe("LoginUseCase", () => {
    let sut: LoginUseCase;

    const userRef = UserEntity.fromPlain({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: "password123",
    });

    const RESULT_TOKEN = "valid-token";

    describe("login", () => {
        beforeAll(() => {
            const authUserRepository: IAuthUserRepository = {
                create: jest.fn(),
                findByEmail: jest
                    .fn()
                    .mockImplementation((email) =>
                        userRef.email.value === email ? userRef : null,
                    ),
            };

            const authJwtService = {
                verifyPassword: jest
                    .fn()
                    .mockImplementation((p1, p2) => p1 === p2),
                sign: jest.fn().mockReturnValue(RESULT_TOKEN),
            } as unknown as AuthJwtService;

            sut = new LoginUseCase(authUserRepository, authJwtService);
        });

        it("Usuário com as credenciais corretas recebe os tokens para acesso", async () => {
            // Given
            const login = {
                email: userRef.email.value,
                password: userRef.password.value,
            };

            // When
            const result = expect(sut.execute(login));

            // Then
            await result.resolves.toEqual(
                new LoginResponse(
                    new UserDto(userRef),
                    new Tokens(RESULT_TOKEN, RESULT_TOKEN),
                ),
            );
        });

        it.each([
            [new Email(userRef.email.value), new Password(userRef.password.value + "-wrong-password")],
            [new Email(userRef.email.value + "co"), new Password(userRef.password.value)],
            ["not@email.com", "123456"],
        ])(
            "Usuário com as credenciais inválidas não pode fazer login",
            async (email: Email, password: Password) => {
                // Given
                const login = {
                    email: email.value,
                    password: password.value,
                };

                // When
                const result = expect(() => sut.execute(login));

                // Then
                await result.rejects.toThrow(InvalidCredentialsException);
            },
        );
    });
});
