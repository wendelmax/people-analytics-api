import { TestContainer } from '../test-container';
import { INestApplication } from '@nestjs/common';
import { gql } from 'apollo-server-express';
import * as request from 'supertest';
import { PrismaService } from '@infrastructure/database/prisma.service';

describe('EmployeeResolver (e2e)', () => {
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

  describe('Query', () => {
    describe('employees', () => {
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

        const query = gql`
          query {
            employees {
              id
              name
              email
              position
              department
              hireDate
            }
          }
        `;

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: query.loc.source.body,
          })
          .expect(200);

        expect(response.body.data.employees).toHaveLength(2);
        expect(response.body.data.employees[0]).toHaveProperty('id');
        expect(response.body.data.employees[0].name).toBe('John Doe');
      });
    });

    describe('employee', () => {
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

        const query = gql`
          query ($id: ID!) {
            employee(id: $id) {
              id
              name
              email
              position
              department
              hireDate
            }
          }
        `;

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: query.loc.source.body,
            variables: { id: employee.id.toString() },
          })
          .expect(200);

        expect(response.body.data.employee).toHaveProperty('id', employee.id.toString());
        expect(response.body.data.employee.name).toBe('John Doe');
      });

      it('should return null for non-existent employee', async () => {
        const query = gql`
          query ($id: ID!) {
            employee(id: $id) {
              id
              name
            }
          }
        `;

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: query.loc.source.body,
            variables: { id: '999' },
          })
          .expect(200);

        expect(response.body.data.employee).toBeNull();
      });
    });
  });

  describe('Mutation', () => {
    describe('createEmployee', () => {
      it('should create a new employee', async () => {
        const mutation = gql`
          mutation ($input: CreateEmployeeInput!) {
            createEmployee(input: $input) {
              id
              name
              email
              position
              department
              hireDate
            }
          }
        `;

        const input = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Software Engineer',
          department: 'Engineering',
          hireDate: '2024-01-01',
        };

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: mutation.loc.source.body,
            variables: { input },
          })
          .expect(200);

        expect(response.body.data.createEmployee).toHaveProperty('id');
        expect(response.body.data.createEmployee.name).toBe(input.name);
        expect(response.body.data.createEmployee.email).toBe(input.email);
      });
    });

    describe('updateEmployee', () => {
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

        const mutation = gql`
          mutation ($id: ID!, $input: UpdateEmployeeInput!) {
            updateEmployee(id: $id, input: $input) {
              id
              name
              position
            }
          }
        `;

        const input = {
          name: 'John Updated',
          position: 'Senior Software Engineer',
        };

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: mutation.loc.source.body,
            variables: {
              id: employee.id.toString(),
              input,
            },
          })
          .expect(200);

        expect(response.body.data.updateEmployee.name).toBe(input.name);
        expect(response.body.data.updateEmployee.position).toBe(input.position);
      });
    });

    describe('deleteEmployee', () => {
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

        const mutation = gql`
          mutation ($id: ID!) {
            deleteEmployee(id: $id) {
              success
            }
          }
        `;

        const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: mutation.loc.source.body,
            variables: { id: employee.id.toString() },
          })
          .expect(200);

        expect(response.body.data.deleteEmployee.success).toBe(true);

        const deletedEmployee = await prisma.employee.findUnique({
          where: { id: employee.id },
        });

        expect(deletedEmployee).toBeNull();
      });
    });
  });
});
