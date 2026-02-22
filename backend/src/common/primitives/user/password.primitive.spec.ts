import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Password } from "./password.primitive";

describe("Primitiva de Senha", () => {
    describe("Senha", () => {
        it.each(["123456", "asbcewq", "!^&@*&uidowh", "with spaces"])(
            "Senhas válidas permitem instanciar a primitiva",
            (password) => {
                // When
                const result = expect(new Password(password));

                // Then
                result.toBeInstanceOf(Password);
            },
        );

        it.each(["12345", ""])(
            "Senhas inválidas lançam exceção",
            (password) => {
                // When
                const result = expect(() => new Password(password));

                // Then
                result.toThrow(InvalidDomainException);
            },
        );
    });
});
