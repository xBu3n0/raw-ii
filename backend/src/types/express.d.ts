import { UserDto } from "src/common/dtos/user.dto";

declare module "express" {
    interface Request {
        user?: UserDto;
    }
}
