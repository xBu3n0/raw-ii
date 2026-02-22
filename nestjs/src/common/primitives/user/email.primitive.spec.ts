import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Email } from "./email.primitive";

describe("Primitiva de Email", () => {
    describe("Email", () => {
        it.each(["valid@email.addr", "another@example.com"])(
            "Emails válidos permitem instanciar a primitiva",
            (email) => {
                // When
                const result = expect(new Email(email));

                // Then
                result.toBeInstanceOf(Email);
            },
        );

        it.each([
            "plainaddress",
            "@missingusername.com",
            "username@.com",
            "username@com",
            "username@domain..com",
        ])("Emails inválidos lançam exceção", (email) => {
            // When
            const result = expect(() => new Email(email));

            // Then
            result.toThrow(InvalidDomainException);
        });
    });
});
