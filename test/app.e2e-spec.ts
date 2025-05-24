import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await prismaService.$connect();
    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  // Skills Module
  describe('/skills', () => {
    let skillId: number;

    it('POST /skills - create a skill', async () => {
      const skillData = {
        name: 'TypeScript',
        type: 'HARD',
        description: 'JavaScript superset',
        category: 'Language',
      };
      const response = await request(app.getHttpServer())
        .post('/skills')
        .send(skillData)
        .expect(201);
      skillId = response.body.id;
      expect(response.body.name).toBe(skillData.name);
    });

    it('GET /skills - find all skills', async () => {
      const response = await request(app.getHttpServer()).get('/skills').expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /skills/:id - find a skill by ID', async () => {
      const response = await request(app.getHttpServer()).get(`/skills/${skillId}`).expect(200);
      expect(response.body).toHaveProperty('id', skillId);
    });

    it('PUT /skills/:id - update a skill', async () => {
      const updateData = { name: 'TypeScript Updated' };
      const response = await request(app.getHttpServer())
        .put(`/skills/${skillId}`)
        .send(updateData)
        .expect(200);
      expect(response.body.name).toBe(updateData.name);
    });

    it('DELETE /skills/:id - delete a skill', async () => {
      await request(app.getHttpServer()).delete(`/skills/${skillId}`).expect(200);
    });
  });

  // Employees Module
  describe('/employees', () => {
    let employeeId: number;

    it('POST /employees - create an employee', async () => {
      const employeeData = { name: 'John Doe', email: 'johndoe@example.com', password: 'secret' };
      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(employeeData)
        .expect(201);
      employeeId = response.body.id;
      expect(response.body.name).toBe(employeeData.name);
    });

    it('GET /employees - find all employees', async () => {
      const response = await request(app.getHttpServer()).get('/employees').expect(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('GET /employees/:id - find an employee by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/employees/${employeeId}`)
        .expect(200);
      expect(response.body).toHaveProperty('id', employeeId);
    });

    it('PUT /employees/:id - update an employee', async () => {
      const updateData = { name: 'Jane Doe' };
      const response = await request(app.getHttpServer())
        .put(`/employees/${employeeId}`)
        .send(updateData)
        .expect(200);
      expect(response.body.name).toBe(updateData.name);
    });

    it('DELETE /employees/:id - delete an employee', async () => {
      await request(app.getHttpServer()).delete(`/employees/${employeeId}`).expect(200);
    });

    it('should create a new employee', async () => {
      const response = await request(app.getHttpServer())
        .post('/employees')
        .send({
          name: 'Test Employee',
          email: 'test@example.com',
          phone: '1234567890',
          hireDate: new Date(),
          departmentId: 1,
          skillIds: [1, 2],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });
  });

  // Organizational Structure Module
  describe('/organizational-structure', () => {
    let departmentId: number;

    it('POST /organizational-structure/departments - create a department', async () => {
      const deptData = { name: 'Engineering' };
      const response = await request(app.getHttpServer())
        .post('/organizational-structure/departments')
        .send(deptData)
        .expect(201);
      departmentId = response.body.id;
      expect(response.body.name).toBe(deptData.name);
    });

    it('POST /organizational-structure/positions - create a position', async () => {
      const posData = { name: 'Developer', department_id: departmentId };
      const response = await request(app.getHttpServer())
        .post('/organizational-structure/positions')
        .send(posData)
        .expect(201);
      expect(response.body.name).toBe(posData.name);
    });

    it('DELETE /organizational-structure/departments/:id - delete a department', async () => {
      await request(app.getHttpServer())
        .delete(`/organizational-structure/departments/${departmentId}`)
        .expect(200);
    });
  });

  // Development Module
  describe('/development', () => {
    let devItemId: number;

    it('POST /development - create a development item', async () => {
      const devData = {
        name: 'NestJS Basics',
        type: 'TRAINING',
        description: 'Intro to NestJS',
        link: 'https://nestjs.com',
      };
      const response = await request(app.getHttpServer())
        .post('/development')
        .send(devData)
        .expect(201);
      devItemId = response.body.id;
      expect(response.body.name).toBe(devData.name);
    });

    it('DELETE /development/:id - delete a development item', async () => {
      await request(app.getHttpServer()).delete(`/development/${devItemId}`).expect(200);
    });
  });

  // Feedback Module
  describe('/feedback', () => {
    let feedbackId: number;

    it('POST /feedback - create feedback', async () => {
      const feedbackData = { employee_id: 1, comment: 'Great progress', sentiment: 'POSITIVE' };
      const response = await request(app.getHttpServer())
        .post('/feedback')
        .send(feedbackData)
        .expect(201);
      feedbackId = response.body.id;
      expect(response.body.comment).toBe(feedbackData.comment);
    });

    it('DELETE /feedback/:id - delete feedback', async () => {
      await request(app.getHttpServer()).delete(`/feedback/${feedbackId}`).expect(200);
    });
  });

  // Notifications Module
  describe('/notifications', () => {
    let notificationId: number;

    it('POST /notifications - create a notification', async () => {
      const notificationData = {
        employee_id: 1,
        title: 'New Training Available',
        message: 'Check out the new NestJS training',
      };
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send(notificationData)
        .expect(201);
      notificationId = response.body.id;
      expect(response.body.title).toBe(notificationData.title);
    });

    it('PUT /notifications/:id/read - mark as read', async () => {
      const response = await request(app.getHttpServer())
        .put(`/notifications/${notificationId}/read`)
        .expect(200);
      expect(response.body.read).toBe(true);
    });

    it('DELETE /notifications/:id - delete notification', async () => {
      await request(app.getHttpServer()).delete(`/notifications/${notificationId}`).expect(200);
    });
  });

  // Chatbot Interactions Module
  describe('/chatbot-interactions', () => {
    it('POST /chatbot-interactions - create a chatbot interaction', async () => {
      const interactionData = { employee_id: 1, user_message: 'What are my goals?' };
      const response = await request(app.getHttpServer())
        .post('/chatbot-interactions')
        .send(interactionData)
        .expect(201);
      expect(response.body.user_message).toBe(interactionData.user_message);
    });
  });
});
