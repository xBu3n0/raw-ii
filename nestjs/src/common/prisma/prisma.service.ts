import { PrismaClient } from "@generated/prisma/client";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(databaseUrl: string) {
        super({
            adapter: new PrismaPg({
                connectionString: databaseUrl,
            }),
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
