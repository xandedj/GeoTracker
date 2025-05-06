import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as path from 'path';
import { log } from '../vite';

async function bootstrap() {
  const server = express();
  
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  
  // Session
  app.use(
    session({
      secret: 'trackergeo-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true if using https
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('TrackerGeo API')
    .setDescription('Vehicle tracking and fleet management API')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Global prefix
  app.setGlobalPrefix('api');

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  await app.init();
  
  // Setup Vite or serve static files
  const { setupVite, serveStatic } = require('../vite');
  
  if (process.env.NODE_ENV === "development") {
    await setupVite(server, app.getHttpServer());
  } else {
    serveStatic(server);
  }
  
  // Start server
  const port = 5000;
  app.getHttpServer().listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
}

bootstrap();