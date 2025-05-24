import { TestContainer } from '../test-container';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '@infrastructure/database/prisma.service';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    await TestContainer.start();
    app = TestContainer.getApp();
    prisma = TestContainer.getPrisma();
  });

  afterAll(async () => {
    await TestContainer.stop();
  });

  beforeEach(async () => {
    await TestContainer.cleanupDatabase();
  });

  describe('POST /employees', () => {
    it('should create a new employee', async () => {
      const employeeData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Engineer',
        department: 'Engineering',
        hireDate: '2024-01-01',
      };

      const response = await request(app.getHttpServer())
        .post('/employees')
        .send(employeeData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(employeeData.name);
      expect(response.body.email).toBe(employeeData.email);
    });
  });

  describe('GET /employees', () => {
    it('should return all employees', async () => {
      // Criar alguns funcionários de teste
      await prisma.employee.createMany({
        data: [
          {
            name: 'John Doe',
            email: 'john.doe@example.com',
            position: 'Software Engineer',
            department: 'Engineering',
            hireDate: new Date('2024-01-01'),
          },
          {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            position: 'Product Manager',
            department: 'Product',
            hireDate: new Date('2024-01-02'),
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/employees')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /employees/:id', () => {
    it('should return a specific employee', async () => {
      const employee = await prisma.employee.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer',
          department: 'Engineering',
          hireDate: new Date('2024-01-01'),
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/employees/${employee.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', employee.id.toString());
      expect(response.body.name).toBe('John Doe');
    });

    it('should return 404 for non-existent employee', async () => {
      await request(app.getHttpServer())
        .get('/employees/999')
        .expect(404);
    });
  });

  describe('PUT /employees/:id', () => {
    it('should update an employee', async () => {
      const employee = await prisma.employee.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer',
          department: 'Engineering',
          hireDate: new Date('2024-01-01'),
        },
      });

      const updateData = {
        name: 'John Updated',
        position: 'Senior Software Engineer',
      };

      const response = await request(app.getHttpServer())
        .put(`/employees/${employee.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.position).toBe(updateData.position);
    });
  });

  describe('DELETE /employees/:id', () => {
    it('should delete an employee', async () => {
      const employee = await prisma.employee.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer',
          department: 'Engineering',
          hireDate: new Date('2024-01-01'),
        },
      });

      await request(app.getHttpServer())
        .delete(`/employees/${employee.id}`)
        .expect(200);

      const deletedEmployee = await prisma.employee.findUnique({
        where: { id: employee.id },
      });

      expect(deletedEmployee).toBeNull();
    });
  });
}); 