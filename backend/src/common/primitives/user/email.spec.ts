import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Email } from "./email.primitive";

describe("Primitiva de Email", () => {
    describe("Email", () => {
        it("deve criar uma instância com um email válido", () => {
            expect(new Email("test@example.com")).toBeInstanceOf(Email);
        });

        it("deve lançar exceção quando o email é inválido", () => {
            expect(() => new Email("invalid-email")).toThrow(
                InvalidDomainException,
            );
        });
    });
});
