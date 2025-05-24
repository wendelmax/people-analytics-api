import { Module } from '@nestjs/common';
import { DevelopmentController } from '@application/api/controller/DevelopmentController';
import { DevelopmentService } from '@application/api/service/DevelopmentService';
import { DevelopmentRepository } from '@infrastructure/repository/DevelopmentRepository';
import { TrainingController } from '@application/api/controller/TrainingController';
import { TrainingService } from '@application/api/service/TrainingService';
import { TrainingRepository } from '@infrastructure/repository/TrainingRepository';
import { CertificationsController } from '@application/api/controller/CertificationsController';
import { CertificationsService } from '@application/api/service/CertificationsService';
import { CertificationsRepository } from '@infrastructure/repository/CertificationsRepository';

@Module({
  controllers: [DevelopmentController, TrainingController, CertificationsController],
  providers: [
    DevelopmentService,
    TrainingService,
    CertificationsService,
    {
      provide: 'DevelopmentRepository',
      useClass: DevelopmentRepository,
    },
    {
      provide: 'TrainingRepository',
      useClass: TrainingRepository,
    },
    {
      provide: 'CertificationsRepository',
      useClass: CertificationsRepository,
    },
  ],
  exports: [DevelopmentService, TrainingService, CertificationsService],
})
export class DevelopmentModule {}
