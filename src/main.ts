import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração detalhada do Swagger
  const config = new DocumentBuilder()
    .setTitle('People Analytics API')
    .setDescription('API para gerenciamento e análise de dados de colaboradores, incluindo habilidades, desenvolvimento, feedback, notificações, entre outros.')
    .setContact('Jackson Sá', null, 'jacksonwendel@gmail.com')
    .setVersion('1.0')
    .setExternalDoc('Open Docs', '/swagger/json')
    .addTag('employees', 'Gerenciamento de funcionários e dados pessoais')
    .addTag('skills', 'Inventário e avaliação de habilidades dos funcionários')
    .addTag('organizational-structure', 'Gerenciamento de departamentos e cargos')
    .addTag('development', 'Gerenciamento de itens e progresso de desenvolvimento dos funcionários')
    .addTag('feedback', 'Coleta e análise de feedback dos funcionários')
    .addTag('notifications', 'Notificações enviadas para os funcionários')
    .addTag('recommendations', 'Recomendações de carreira e habilidades baseadas em IA')
    .addTag('chatbot-interactions', 'Interações dos funcionários com o chatbot de suporte')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
