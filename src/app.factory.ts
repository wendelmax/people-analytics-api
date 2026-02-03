import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import type { INestApplication } from '@nestjs/common';
import type { Express } from 'express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const express = require('express') as typeof import('express');

export class AppFactory {
  static create(): { appPromise: Promise<INestApplication>; expressApp: Express } {
    const expressApp = express();
    expressApp.set('query parser', 'extended');
    const adapter = new ExpressAdapter(expressApp);
    const appPromise = NestFactory.create(AppModule, adapter);

    appPromise
      .then((app) => {
        const corsOrigins = process.env.CORS_ORIGINS
          ? process.env.CORS_ORIGINS.split(',')
              .map((o) => o.trim())
              .filter(Boolean)
          : ['http://localhost:5173'];
        app.enableCors({
          origin: corsOrigins.length ? corsOrigins : true,
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        });
        app.useGlobalPipes(
          new ValidationPipe({
            whitelist: true,
            transform: true,
          }),
        );
        const config = new DocumentBuilder()
          .setTitle('People Analytics API')
          .setDescription('API para análise de pessoas e gestão de talentos')
          .setVersion('1.0')
          .addBearerAuth()
          .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, document);
        return app.init();
      })
      .catch((err) => {
        throw err;
      });

    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      appPromise.then(() => next()).catch((err: unknown) => next(err));
    });

    return { appPromise, expressApp };
  }
}
