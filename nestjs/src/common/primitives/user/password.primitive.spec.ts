import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Password } from "./password.primitive";
import { verify } from "@node-rs/argon2";

describe("Primitiva de Senha", () => {
    describe("Senha", () => {
        it.each(["123456", "asbcewq", "!^&@*&uidowh", "with spaces"])(
            "Senhas válidas permitem instanciar a primitiva",
            async (password) => {
                // When
                const result = Password.create(password);

                // Then
                expect(result).toBeInstanceOf(Password);
                expect(await verify(result.value, password)).toBe(true);
            },
        );

        it.each(["12345", ""])(
            "Senhas inválidas lançam exceção",
            (password) => {
                // When
                const result = () => Password.create(password);

                // Then
                expect(result).toThrow(InvalidDomainException);
            },
        );
    });
});
