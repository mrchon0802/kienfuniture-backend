import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    //load .env
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),

    //ket noi mongodb atlas
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.uri'),
        connectionFactory: (connection) => {
          console.log('✅ Connected to MongoDB:', connection.name);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    ProductModule,
    OrderModule,
    UserModule,
    AuthModule,
    CartModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
