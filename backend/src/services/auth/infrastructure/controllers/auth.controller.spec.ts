import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { RegisterUseCase } from "@auth/application/useCases/register.use-case";
import { LoginUseCase } from "@auth/application/useCases/login.use-case";
import { AuthService } from "@auth/application/services/auth.service";

describe("AuthController", () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: RegisterUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: LoginUseCase,
                    useValue: { execute: jest.fn() },
                },
                {
                    provide: AuthService,
                    useValue: { refreshTokens: jest.fn() },
                },
            ],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
