import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupVite, serveStatic, log } from '../vite';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix for all NestJS routes
  app.setGlobalPrefix('api');
  
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Configure express session
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
  
  // Add request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        log(logLine);
      }
    });

    next();
  });
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('TrackerGeo API')
    .setDescription('API documentation for the TrackerGeo fleet management system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Get the express instance
  const expressApp = app.getHttpAdapter().getInstance();
  
  // Get the HTTP server instance
  await app.init();
  const server = app.getHttpServer();
  
  // Setup Vite for development or serve static files for production
  if (process.env.NODE_ENV === 'development') {
    await setupVite(expressApp, server);
  } else {
    serveStatic(expressApp);
  }
  
  // Start the server on port 5000
  await app.listen(5000, '0.0.0.0');
  log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();