import { Prisma, PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const extendedPrismaClient = new PrismaClient().$extends({
    name: 'POSExtension',
    model: {
      $allModels: {
        async findManyAndCount<Model, Args>(
          this: Model,
          args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
        ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
          return extendedPrismaClient.$transaction([
            (this as any).findMany(args),
            (this as any).count({ where: (args as any).where }),
          ]) as any;
        },
        async delete<Model, Args>(
          this: Model,
          args: Prisma.Exact<Args, Prisma.Args<Model, 'findMany'>>
        ): Promise<[Prisma.Result<Model, Args, 'findMany'>, number]> {
          return (this as any).update({
            ...args as any,
            data: {
              deletedAt: new Date()
            }
          })
        }
      }
    },
    query: {
      $allModels: {
        async $allOperations({ args, query, operation }) {
          if (operation === "findMany" || operation === "findFirst" || operation === "findUnique") {

            args.where = {
              ...args.where,
              deletedAt: null
            }
          }

          return query(args);
        }
      }
    }
  });

  return extendedPrismaClient
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

//BigInt stringify fix
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};