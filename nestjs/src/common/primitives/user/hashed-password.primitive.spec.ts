import { HashedPassword } from "./hashed-password.primitive";
import { Password } from "./password.primitive";

describe("Primitiva de Senha com Hash", () => {
    describe("HashedPassword", () => {
        it.each(["123456", "1234567"])(
            "Cria uma senha com hash a partir de uma Password válida",
            async (plainPassword) => {
                const password = Password.create(plainPassword);

                // When
                const result = HashedPassword.create(password);

                // Then
                expect(result).toBeInstanceOf(HashedPassword);
                expect(result.value).not.toBe(plainPassword);
                expect(await result.verify(password)).toBeDefined();
            },
        );

        it("Cria uma HashedPassword a partir de um hash existente", () => {
            // When
            const hash = "hash_test_value";
            const result = HashedPassword.fromHash(hash);

            // Then
            expect(result).toBeInstanceOf(HashedPassword);
            expect(result.value).toBe(hash);
        });

        it.each(["123456", "asbcewq", "!^&@*&uidowh", "with spaces"])(
            "Verifica se uma senha corresponde ao hash",
            async (password) => {
                // When
                const passwordPrimitive = Password.create(password);
                const hashedPassword = HashedPassword.create(passwordPrimitive);
                const isValid = await hashedPassword.verify(passwordPrimitive);

                // Then
                expect(isValid).toBe(true);
            },
        );

        it.each([
            { correct: "password123", wrong: "password124" },
            { correct: "secure_pass!", wrong: "secure_pass@" },
            { correct: "test123", wrong: "testing123" },
            { correct: "CaseSensitive", wrong: "casesensitive" },
        ])(
            "Rejeita diferentes senhas incorretas durante verificação",
            async ({ correct, wrong }) => {
                // When
                const correctPassword = Password.create(correct);
                const wrongPassword = Password.create(wrong);
                const hashedPassword = HashedPassword.create(correctPassword);
                const isValid = await hashedPassword.verify(wrongPassword);

                // Then
                expect(isValid).toBe(false);
            },
        );

        it.each(["verylongpasswordwith123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`"])(
            "Cria hash para diferentes comprimentos de senha",
            (password) => {
                // When
                const passwordPrimitive = Password.create(password);
                const hashedPassword = HashedPassword.create(passwordPrimitive);

                // Then
                expect(hashedPassword.value).toBeDefined();
                expect(hashedPassword.value.length).toBeGreaterThan(0);
            },
        );

        it("Múltiplas execuções do hash para mesma senha geram valores diferentes (salt)", () => {
            // When
            const password = Password.create("test_password");
            const hash1 = HashedPassword.create(password).value;
            const hash2 = HashedPassword.create(password).value;

            // Then
            expect(hash1).not.toBe(hash2);
        });
    });
});
