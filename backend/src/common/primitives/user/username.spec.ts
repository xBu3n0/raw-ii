import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Username } from "./username.primitive";

describe("Primitiva Username", () => {
    describe("Username", () => {
        it("deve criar um username válido", () => {
            expect(new Username("valid_username")).toBeInstanceOf(Username);
        });

        it("deve lançar exceção quando username contém espaços", () => {
            expect(() => new Username("a b c")).toThrow(InvalidDomainException);
        });

        it("deve lançar exceção quando username é muito curto", () => {
            expect(() => new Username("ab")).toThrow(InvalidDomainException);
        });
    });
});
