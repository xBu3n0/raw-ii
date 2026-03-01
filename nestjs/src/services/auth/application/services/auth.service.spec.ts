import { IAuthUserRepository } from "@auth/domain/repositories/auth-user.repository";
import { AuthService } from "./auth.service";
import { UserDto } from "@/common/dtos/user.dto";
import { UserEntity } from "@auth/domain/entities/user.entity";
import { IAuthJwtService } from "@/common/jwt/iauth-jwt.service";

describe("AuthService", () => {
    const userRef = UserEntity.fromPlain({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: "password123",
    });

    const RESULT_TOKEN = "valid-token";

    function createAuthService(): {
        authService: AuthService;
        authUserRepository: IAuthUserRepository;
        authJwtService: IAuthJwtService;
    } {
        const authUserRepository: IAuthUserRepository = {
            create: jest.fn(),
            findByEmail: jest.fn(),
        };
        const authJwtService = {
            sign: jest.fn().mockImplementation(() => RESULT_TOKEN),
        } as unknown as IAuthJwtService;
        const authService = new AuthService(authUserRepository, authJwtService);

        return {
            authService,
            authUserRepository,
            authJwtService,
        };
    }

    describe("refreshTokens", () => {
        it("Retorna tokens de acesso e refresh", () => {
            // Given
            const { authService: sut } = createAuthService();
            const userDto = new UserDto(userRef);

            // When
            const result = sut.refreshTokens(userDto);

            // Then
            expect(result).toEqual({
                accessToken: RESULT_TOKEN,
                refreshToken: RESULT_TOKEN,
            });
        });
    });
});
