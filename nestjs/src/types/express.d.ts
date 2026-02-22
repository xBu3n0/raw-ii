import { UserDto } from "@/common/dtos/user.dto";

declare module "express" {
    interface Request {
        user?: UserDto;
    }
}
