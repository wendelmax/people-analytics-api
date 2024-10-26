<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A comprehensive People Analytics System built with NestJS for managing employee experiences, career progression, and skills development.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

The **People Analytics System** is a NestJS-based application that helps organizations track employee skills, manage career pathways, and enhance the employee experience through comprehensive insights and AI-driven recommendations. The system leverages PostgreSQL and Prisma ORM to support efficient and scalable data management.

---

## Features

- **Employee Management**: Store employee details, track roles, departments, and development progress.
- **Career Pathways & Skills Mapping**: Define career pathways, assess skills, and set goals for development.
- **Employee Experience Journeys**: Manage and track employee experiences through journey maps and touchpoints.
- **AI-Powered Recommendations**: Suggest skills development, career positions, and development items.
- **Notifications**: Notify employees of updates, recommendations, and career progression milestones.

## Project setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/people-analytics.git
   cd people-analytics
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Prisma**:

   - Generate Prisma client:
     ```bash
     npx prisma generate
     ```

4. **Database Migration**:

   - Run migrations to set up the database schema:
     ```bash
     npx prisma migrate dev --name init
     ```

5. **Start the Server**:
   ```bash
   npm run start:dev
   ```

---

## Compile and Run the Project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

---

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## Modules

This system includes various modules, each encapsulating a specific domain within People Analytics. Key modules include:

1. **FuncionariosModule**: Employee management, including authentication and role-based access.
2. **DepartamentosModule**: Department structure, team assignments, and hierarchy.
3. **CargosModule**: Role management, including levels, requirements, and promotions.
4. **SkillsInventoryModule**: Track and categorize skills (hard/soft).
5. **SkillsAssessmentsModule**: Assess employee proficiency and skill levels.
6. **CareerPositionsModule**: Define and track career aspirations and goals.
7. **EmployeeExperienceJourneyModule**: Map out employee experience journeys and touchpoints.
8. **EmployeeFeedbackModule**: Collect feedback on employee experience touchpoints.
9. **NotificationsModule**: Send updates and alerts to employees.
10. **DevelopmentItemsModule**: Track training programs and certifications.
11. **AI-Powered Recommendations**: Suggest career pathways, skills development, and other insights.

---

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/people_analytics_db"
PORT=3000
```

---

## Deployment

To deploy the NestJS application, refer to the official [deployment documentation](https://docs.nestjs.com/deployment) for setup and configuration.

For quick cloud-based deployment on AWS, consider using **NestJS Mau**:

```bash
$ npm install -g mau
$ mau deploy
```

---

## Resources

Here are a few resources to support you while working with NestJS:

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord Channel](https://discord.gg/G7Qnnhy)
- [NestJS Courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com) for live app visualization.
- [Jobs Board](https://jobs.nestjs.com) to find or post job opportunities.

---

## Support

NestJS is an open-source framework licensed under MIT. For support, consider joining our community or exploring enterprise support options [here](https://docs.nestjs.com/support).

---

## License

The **People Analytics System** is [MIT licensed](https://opensource.org/licenses/MIT).
