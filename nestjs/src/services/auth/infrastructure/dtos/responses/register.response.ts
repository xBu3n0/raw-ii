import { RegisterOutput } from "@/services/auth/application/useCases/register/register.output";

export class RegisterResponse {
    private constructor(
        readonly id: number,
        readonly username: string,
        readonly email: string,
    ) {}

    static fromRegisterOutput(registerOutput: RegisterOutput) {
        return new this(
            registerOutput.id,
            registerOutput.username,
            registerOutput.email,
        );
    }
}
