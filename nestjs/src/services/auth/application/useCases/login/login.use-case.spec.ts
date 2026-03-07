import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { UserDto } from "@/common/dtos/user.dto";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { LoginUseCase } from "./login.use-case";
import { InvalidCredentialsException } from "@auth/domain/exceptions/invalid-credentials.exception";
import { Password } from "@/common/primitives/user/password.primitive";
import { Email } from "@/common/primitives/user/email.primitive";
import { IAuthJwtService } from "@/common/jwt/iauth-jwt.service";
import { Tokens } from "@/services/auth/common/types/token.type";
import { LoginOutput } from "./login.output";

describe("LoginUseCase", () => {
    const userRef = UserEntity.fromPlain({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: "password123",
    });
    const RESULT_TOKEN = "valid-token";

    function createLoginUseCase(): {
        loginUseCase: LoginUseCase;
        authUserRepository: IAuthUserRepository;
        authJwtService: IAuthJwtService;
    } {
        const authUserRepository: IAuthUserRepository = {
            create: jest.fn(),
            findByEmail: jest
                .fn()
                .mockImplementation(
                    async (email: Email): Promise<UserEntity | null> =>
                        Promise.resolve(
                            userRef.email.value === email.value
                                ? userRef
                                : null,
                        ),
                ),
        };
        const authJwtService = {
            verifyPassword: jest.fn().mockImplementation((p1, p2) => p1 === p2),
            sign: jest.fn().mockReturnValue(RESULT_TOKEN),
        } as unknown as IAuthJwtService;
        const loginUseCase = new LoginUseCase(
            authUserRepository,
            authJwtService,
        );

        return {
            loginUseCase,
            authUserRepository,
            authJwtService,
        };
    }

    describe("login", () => {
        it("Usuário com as credenciais corretas recebe os tokens para acesso", async () => {
            // Given
            const login = {
                email: userRef.email.value,
                password: userRef.password.value,
            };
            const { loginUseCase: sut } = createLoginUseCase();

            // When
            const result = sut.execute(login);

            // Then
            await expect(result).resolves.toEqual(
                new LoginOutput(
                    new UserDto(userRef),
                    new Tokens(RESULT_TOKEN, RESULT_TOKEN),
                ),
            );
        });

        it.each([
            [
                Email.create(userRef.email.value),
                Password.create(userRef.password.value + "-wrong-password"),
            ],
            [
                Email.create(userRef.email.value + "w"),
                Password.create(userRef.password.value),
            ],
            [Email.create("another@email.com"), Password.create("123456")],
        ])(
            "Usuário com as credenciais inválidas não pode fazer login",
            async (email: Email, password: Password) => {
                // Given
                const login = {
                    email: email.value,
                    password: password.value,
                };
                const { loginUseCase: sut } = createLoginUseCase();

                // When
                const result = sut.execute(login);

                // Then
                await expect(result).rejects.toThrow(
                    InvalidCredentialsException,
                );
            },
        );
    });
});
