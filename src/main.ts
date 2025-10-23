import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors();
  
  // Configurar prefixo global da API
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('🚀 Aplicação rodando em http://localhost:3000');
  console.log('📋 Endpoints disponíveis:');
  console.log('  POST /api/passageiros - Criar passageiro');
}

bootstrap();
