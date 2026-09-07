import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS — restringe às origens do CORS_ORIGIN (separadas por
  // vírgula) em produção; sem a variável, libera geral (uso local/dev).
  const origensPermitidas = process.env.CORS_ORIGIN?.split(',').map((o) =>
    o.trim(),
  );
  app.enableCors({ origin: origensPermitidas ?? true });

  // Configurar prefixo global da API
  app.setGlobalPrefix('api');

  // Documentação interativa da API (Swagger/OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('SistemaAereo API')
    .setDescription('API de reservas aéreas — projeto de portfólio')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`🚀 Aplicação rodando na porta ${porta}`);
}

void bootstrap();
