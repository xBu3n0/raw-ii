import { IAuthUserRepository } from "../../domain/repositories/auth-user.repository";
import { AuthService } from "./auth.service";
import { AuthJwtService } from "@/common/jwt/auth-jwt.service";
import { UserDto } from "@/common/dtos/user.dto";
import { UserEntity } from "../../domain/entities/user.entity";

describe("AuthService", () => {
    let sut: AuthService;

    const userRef = UserEntity.fromPlain({
        id: 1,
        username: "username_test",
        email: "email@teste.com",
        password: "password123",
    });

    const RESULT_TOKEN = "valid-token";

    describe("refreshTokens", () => {
        beforeAll(() => {
            const authUserRepository: IAuthUserRepository = {
                create: jest.fn(),
                findByEmail: jest.fn(),
            };

            const authJwtService = {
                sign: jest.fn().mockReturnValue(RESULT_TOKEN),
            } as unknown as AuthJwtService;

            sut = new AuthService(authUserRepository, authJwtService);
        });

        it("Retorna tokens de acesso e refresh", () => {
            // Given
            const userDto = new UserDto(userRef);

            // When
            const result = expect(sut.refreshTokens(userDto));

            // Then
            result.toEqual({
                accessToken: RESULT_TOKEN,
                refreshToken: RESULT_TOKEN,
            });
        });
    });
});
