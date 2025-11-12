import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './usuarios/users.module';
import { CategoriasModule } from './categorias/categorias.module';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';
import { ProductosModule } from './productos/productos.module';
import { CarritoModule } from './carrito/carrito.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { PagosModule } from './pagos/pagos.module';
import { TelegramModule } from './telegram/telegram.module';
@Module({
  imports: [
    // Cargar variables de entorno de .env o datos.env
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env' : '.env',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const dbUrl = configService.get<string>('DATABASE_URL');
  const forceSync = configService.get<string>('FORCE_DB_SYNC', 'false') === 'true';

  console.log(`🗄️  Conectando a BD en modo: ${nodeEnv}${forceSync ? ' (FORCE_DB_SYNC=true)' : ''}`);

  if (dbUrl) {
          // ========== PRODUCCIÓN (DATABASE_URL configurada) ==========
          console.log('📡 Usando DATABASE_URL (Producción)');
          return {
            type: 'postgres',
            url: dbUrl,
            autoLoadEntities: true,
            // Allow forcing sync via FORCE_DB_SYNC=true (temporary). Otherwise keep existing behavior.
            synchronize: forceSync ? true : (nodeEnv !== 'production'),
            ssl: {
              rejectUnauthorized: false, // Necesario para Render y otros servicios
            },
            logging: nodeEnv === 'development' || forceSync,
          };
        } else {
          // ========== DESARROLLO (Variables individuales) ==========
          console.log('🏠 Usando variables individuales (Desarrollo)');
          const dbHost = configService.get<string>('DB_HOST', 'localhost');
          const dbPort = parseInt(configService.get<string>('DB_PORT', '5432'), 10);
          const dbUsername = configService.get<string>('DB_USERNAME', 'postgres');
          const dbPassword = configService.get<string>('DB_PASSWORD', '');
          const dbName = configService.get<string>('DB_NAME', 'Artemania');

          return {
            type: 'postgres',
            host: dbHost,
            port: dbPort,
            username: dbUsername,
            password: dbPassword,
            database: dbName,
            autoLoadEntities: true,
            synchronize: true, // Auto-sincronizar en desarrollo
            logging: true,
          };
        }
      },
    }),
    UsersModule,
    CategoriasModule,
    SubcategoriasModule,
    ProductosModule,
    CarritoModule,
    OrdenesModule,
    PagosModule,
    TelegramModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
