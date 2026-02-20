import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { AuthJwtService } from "src/common/jwt/auth-jwt.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authJwtService: AuthJwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Allow access if the route is marked as public or if it's the Prometheus metrics endpoint
        if (isPublic || request.path === "/api/v1/metrics") {
            return true;
        }

        const token = this.authJwtService.extractToken(
            request.headers.authorization,
        );

        if (!token) {
            throw new UnauthorizedException();
        }

        if (!(await this.authJwtService.checkAsync(token))) {
            throw new UnauthorizedException();
        }

        request.user = this.authJwtService.decode(token);

        return true;
    }
}
