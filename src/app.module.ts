import { Module } from '@nestjs/common';
import { EstudianteModule } from './estudiante/estudiante.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EstudianteModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [EstudianteModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
