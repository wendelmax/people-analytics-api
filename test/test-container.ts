import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

export class TestContainer {
  private static app: INestApplication;
  private static prisma: PrismaService;

  static async start(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          context: ({ req }) => ({ req }),
        }),
      ],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.prisma = moduleFixture.get<PrismaService>(PrismaService);

    await this.app.init();
  }

  static async stop(): Promise<void> {
    await this.app.close();
  }

  static getApp(): INestApplication {
    return this.app;
  }

  static getPrisma(): PrismaService {
    return this.prisma;
  }

  static async cleanupDatabase(): Promise<void> {
    const tables = await this.prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tables) {
      if (tablename !== '_prisma_migrations') {
        await this.prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
        );
      }
    }
  }
} 