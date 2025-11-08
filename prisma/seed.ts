import { PrismaClient, SkillCategory, SkillLevel, SkillType } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: { description: 'Product development and delivery' },
    create: {
      name: 'Engineering',
      description: 'Product development and delivery',
    },
  });

  const peopleOps = await prisma.department.upsert({
    where: { name: 'People Operations' },
    update: { description: 'Talent and culture' },
    create: {
      name: 'People Operations',
      description: 'Talent and culture',
    },
  });

  await prisma.position.upsert({
    where: { departmentId_title: { departmentId: engineering.id, title: 'Software Engineer' } },
    update: {
      description: 'Builds and maintains software products',
      level: 'Senior',
    },
    create: {
      title: 'Software Engineer',
      description: 'Builds and maintains software products',
      level: 'Senior',
      department: { connect: { id: engineering.id } },
    },
  });

  await prisma.position.upsert({
    where: { departmentId_title: { departmentId: engineering.id, title: 'Engineering Manager' } },
    update: {
      description: 'Leads engineering teams',
      level: 'Lead',
    },
    create: {
      title: 'Engineering Manager',
      description: 'Leads engineering teams',
      level: 'Lead',
      department: { connect: { id: engineering.id } },
    },
  });

  await prisma.position.upsert({
    where: { departmentId_title: { departmentId: peopleOps.id, title: 'HR Business Partner' } },
    update: {
      description: 'Supports leadership on people programs',
      level: 'Mid-level',
    },
    create: {
      title: 'HR Business Partner',
      description: 'Supports leadership on people programs',
      level: 'Mid-level',
      department: { connect: { id: peopleOps.id } },
    },
  });

  await prisma.skill.upsert({
    where: { name: 'TypeScript' },
    update: {
      description: 'Strong knowledge of TypeScript and Node.js ecosystem',
      type: SkillType.HARD,
      category: SkillCategory.TECHNICAL,
      defaultLevel: SkillLevel.INTERMEDIATE,
    },
    create: {
      name: 'TypeScript',
      description: 'Strong knowledge of TypeScript and Node.js ecosystem',
      type: SkillType.HARD,
      category: SkillCategory.TECHNICAL,
      defaultLevel: SkillLevel.INTERMEDIATE,
    },
  });

  await prisma.skill.upsert({
    where: { name: 'People Leadership' },
    update: {
      description: 'Ability to coach and grow teams',
      type: SkillType.SOFT,
      category: SkillCategory.LEADERSHIP,
      defaultLevel: SkillLevel.INTERMEDIATE,
    },
    create: {
      name: 'People Leadership',
      description: 'Ability to coach and grow teams',
      type: SkillType.SOFT,
      category: SkillCategory.LEADERSHIP,
      defaultLevel: SkillLevel.INTERMEDIATE,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
