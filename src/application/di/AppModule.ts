import { Module } from '@nestjs/common';
import { InsightsModule } from '@application/di/InsightsModule';
// ... outros imports ...

@Module({
  imports: [
    InsightsModule,
    // ... outros módulos ...
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
