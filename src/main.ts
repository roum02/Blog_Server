import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('cert/localhost+2-key.pem'),
    cert: fs.readFileSync('cert/localhost+2.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://localhost:3000',
      'https://localhost:8080',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('블로그 게시글 API 문서')
    .setVersion('1.0')
    .addServer('https://localhost:8080')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
