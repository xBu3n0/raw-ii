import { InvalidDomainException } from "@/common/exceptions/invalid-domain.exception";
import { Username } from "./username.primitive";

describe("Primitiva Username", () => {
    describe("Username", () => {
        it.each(["valid_username", "anotherValidUsername", "user123"])(
            "Usernames válidos permitem instanciar a primitiva",
            (username) => {
                // When
                const result = new Username(username);

                // Then
                expect(result).toBeInstanceOf(Username);
                expect(result.value).toBe(username);
            },
        );

        it.each(["username with spaces", "ab"])(
            "Usernames inválidos lançam exceção",
            (username) => {
                // When
                const result = () => new Username(username);

                // Then
                expect(result).toThrow(InvalidDomainException);
            },
        );
    });
});
