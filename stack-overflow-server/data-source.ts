import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/auth/entities/user.entity';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();

const datasource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
};

export const AppDataSource = new DataSource(datasource);
