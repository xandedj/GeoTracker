import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { StorageModule } from '../../shared/storage/storage.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [StorageModule, AuthModule],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}