import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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

  const porta = process.env.PORT ?? 3000;
  await app.listen(porta);
  console.log(`🚀 Aplicação rodando na porta ${porta}`);
}

void bootstrap();
