import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// 환경 변수 수동 로드 (기존 환경 변수 덮어쓰기)
const envFile = `config/env/.${process.env.NODE_ENV || 'local'}.env`;
const envPath = path.resolve(process.cwd(), envFile);
console.log('🔧 TypeORM Loading env file:', envPath);
console.log('🔧 TypeORM File exists:', fs.existsSync(envPath));

const result = dotenv.config({
  path: envPath,
  override: true,
});

if (result.error) {
  console.error('❌ TypeORM Failed to load env file:', result.error);
} else {
  console.log('✅ TypeORM Env file loaded successfully');
}

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: process.env.NODE_ENV !== 'prod', // 프로덕션에서는 false
  ssl:
    process.env.NODE_ENV === 'local'
      ? false
      : {
          rejectUnauthorized: false, // 개발환경에서만 인증서 검증 생략
        },
};
