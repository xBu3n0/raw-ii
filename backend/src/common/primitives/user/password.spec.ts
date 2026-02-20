import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Password } from "./password.primitive";

describe("Primitiva de Senha", () => {
    describe("Senha", () => {
        it("deve criar uma senha válida com sucesso", () => {
            expect(new Password("123456")).toBeInstanceOf(Password);
        });

        it("deve lançar exceção ao criar uma senha inválida", () => {
            expect(() => new Password("12345")).toThrow(InvalidDomainException);
        });
    });
});
