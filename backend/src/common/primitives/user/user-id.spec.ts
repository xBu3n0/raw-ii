import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { UserId } from "./user-id.primitive";

describe("Primitiva UserId", () => {
    describe("UserId", () => {
        it("deve criar um UserId válido com inteiro positivo", () => {
            expect(new UserId(1)).toBeInstanceOf(UserId);
        });

        it("deve lançar InvalidDomainException quando UserId é negativo", () => {
            expect(() => new UserId(-1)).toThrow(InvalidDomainException);
        });

        it("deve lançar InvalidDomainException quando UserId não é um inteiro", () => {
            expect(() => new UserId(0.5)).toThrow(InvalidDomainException);
        });
    });
});
