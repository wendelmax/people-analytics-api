import { Module } from '@nestjs/common';
import { KnowledgeBaseController } from '@application/api/controller/KnowledgeBaseController';
import { KnowledgeBaseService } from '@application/api/service/KnowledgeBaseService';
import { KnowledgeBaseRepository } from '@infrastructure/repository/KnowledgeBaseRepository';

@Module({
  controllers: [KnowledgeBaseController],
  providers: [
    KnowledgeBaseService,
    {
      provide: 'KnowledgeBaseRepository',
      useClass: KnowledgeBaseRepository,
    },
  ],
  exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
