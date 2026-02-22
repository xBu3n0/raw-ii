import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { UserId } from "./user-id.primitive";

describe("Primitiva UserId", () => {
    describe("UserId", () => {
        it.each([1, 2, 100])(
            "Ids válidos permitem instanciar a primitiva",
            (id) => {
                // When
                const result = expect(new UserId(id));

                // Then
                result.toBeInstanceOf(UserId);
            },
        );

        it.each([0.5, -1, -0.5, 1.5])("Ids inválidos lançam exceção", (id) => {
            // When
            const result = expect(() => new UserId(id));

            // Then
            result.toThrow(InvalidDomainException);
        });
    });
});
