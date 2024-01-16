import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient().$extends({
  name: 'findManyAndCount',
  model: {
    $allModels: {
      findManyAndCount<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
      ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
        return prisma.$transaction([
          (this as any).findMany(args),
          (this as any).count({ where: (args as any).where }),
        ]) as any;
      }
    }
  }
});

type prisma = typeof prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

//BigInt stringify fix
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};