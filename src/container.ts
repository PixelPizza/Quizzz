import { PrismaClient } from "@prisma/client";
import { container } from "@sapphire/framework";

declare module "@sapphire/pieces" {
    export interface Container {
        prisma: PrismaClient;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
container.prisma = new PrismaClient();