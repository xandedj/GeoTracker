import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { GeofencesModule } from './modules/geofences/geofences.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { StorageModule } from './shared/storage/storage.module';

@Module({
  imports: [
    AuthModule,
    VehiclesModule,
    TrackingModule,
    AlertsModule,
    GeofencesModule,
    MaintenanceModule,
    StorageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}