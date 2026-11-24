import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonaModule } from "./persona/persona.module";
import { Persona } from "./persona/entities/persona.entity";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ["../.env", ".env"] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: "localhost",
        port: 5434,
        username: "biblioteca",
        password: config.getOrThrow<string>("POSTGRES_PASSWORD"),
        database: "biblioteca_db",
        entities: [Persona],
        synchronize: false,
      }),
    }),
    PersonaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
