import { HttpException } from "@nestjs/common";

export class EmailAlreadyUsedException extends HttpException {
    constructor(message: string) {
        super(message, 409);

        this.name = "EmailAlreadyUsedException";
    }
}
