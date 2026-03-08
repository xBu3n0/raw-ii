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
import { LoginInput } from "./login.input";

describe("LoginUseCase", () => {
    const plainPassword = "password123";
    const userRef = UserEntity.create({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: plainPassword,
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
            const login = new LoginInput(userRef.email.value, plainPassword);
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
                const login = new LoginInput(email.value, password.value);
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
