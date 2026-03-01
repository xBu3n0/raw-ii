import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Password } from "./password.primitive";

describe("Primitiva de Senha", () => {
    describe("Senha", () => {
        it.each(["123456", "asbcewq", "!^&@*&uidowh", "with spaces"])(
            "Senhas válidas permitem instanciar a primitiva",
            (password) => {
                // When
                const result = new Password(password);

                // Then
                expect(result).toBeInstanceOf(Password);
                expect(result.value).toBe(password);
            },
        );

        it.each(["12345", ""])(
            "Senhas inválidas lançam exceção",
            (password) => {
                // When
                const result = () => new Password(password);

                // Then
                expect(result).toThrow(InvalidDomainException);
            },
        );
    });
});
