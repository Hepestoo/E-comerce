import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Módulos del proyecto
import { UsersModule } from './usuarios/users.module'; // OJO: Verifica si tu carpeta es 'usuarios' o 'users'
import { CategoriasModule } from './categorias/categorias.module';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';
import { CarritoModule } from './carrito/carrito.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { PagosModule } from './pagos/pagos.module';
import { TelegramModule } from './telegram/telegram.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // ==========================
    //  1. CONFIGURACIÓN (.env)
    // ==========================
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),

    // ==========================
    //  2. BASE DE DATOS (TypeORM)
    // ==========================
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');
        const dbUrl = configService.get<string>('DATABASE_URL');
        const forceSync = String(configService.get('FORCE_DB_SYNC')) === 'true';

        console.log(
          `🗄️  Conectando a BD en modo: ${nodeEnv} ${forceSync ? '(FORCE_DB_SYNC=true)' : ''}`
        );

        // --- PRODUCCIÓN (Render) ---
        if (dbUrl) {
          console.log('📡 Usando DATABASE_URL (Producción)');
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            synchronize: false, // ¡Seguridad para producción!
            ssl: { rejectUnauthorized: false },
            logging: false,
          };
        }

        // --- DESARROLLO LOCAL ---
        console.log('🏠 Usando variables individuales (Desarrollo)');
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'Artemania'),
          autoLoadEntities: true,
          synchronize: true, 
          logging: false,    
        };
      },
    }),

    // ==========================
    //  3. MÓDULOS DE FUNCIONALIDAD
    // ==========================
    UsersModule,
    CategoriasModule,
    SubcategoriasModule,
    ProductosModule,
    CarritoModule,
    OrdenesModule,
    PagosModule,
    TelegramModule,
    PasswordResetModule,
    DashboardModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}