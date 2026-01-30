import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/auth/entities/user.entity';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';
import { Tag } from './src/tags/entities/tag.entity';
import TagSeeder from './src/databases/seeds/tags.seeder';
import { Question } from './src/questions/entities/question.entity';
import { Answer } from './src/answers/entities/answer.entity';

dotenv.config();

const datasource: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Tag, Question, Answer],
  migrations: ['src/migrations/*.ts'],
  seeds: [TagSeeder],
  synchronize: false,
};

export const AppDataSource = new DataSource(datasource);
