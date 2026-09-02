import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { DatabaseModule } from './core/database/database.module';
import { PassageirosModule } from './modules/passageiros/passageiros.module';
import { VoosModule } from './modules/voos/voos.module';
import { ReservasModule } from './modules/reservas/reservas.module';
import { VoosExternosModule } from './modules/voos-externos/voos-externos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    PassageirosModule,
    VoosModule,
    ReservasModule,
    VoosExternosModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
