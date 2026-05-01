import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // This helps with Date/Number conversion
      },
    }),
  );

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  });

  const PORT = process.env.PORT || 3002;
  await app.listen(PORT);
  console.log(`App is running on http://localhost:${PORT}/api`);
}

bootstrap();
