import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsService } from './aws.service';

@Module({
  imports: [ConfigModule], // 애플리케이션의 환경 설정 정보, 예를 들어 AWS 리전, Access Key, Secret Key 등의 중요한 설정 정보를 관리
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
