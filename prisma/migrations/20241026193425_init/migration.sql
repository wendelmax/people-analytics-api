-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('HARD', 'SOFT');

-- CreateEnum
CREATE TYPE "TouchpointType" AS ENUM ('ONBOARDING', 'PERFORMANCE_REVIEW', 'TRAINING', 'FEEDBACK_SESSION', 'EXIT_INTERVIEW', 'OTHER');

-- CreateEnum
CREATE TYPE "SentimentType" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "DevelopmentType" AS ENUM ('TRAINING', 'CERTIFICATION', 'PROJECT');

-- CreateTable
CREATE TABLE "Employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "position_id" INTEGER NOT NULL,

    CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Positions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "Positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills_Inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SkillType" NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Skills_Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skills_Assessments" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "proficiency_level" INTEGER NOT NULL,
    "assessment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evaluator_id" INTEGER NOT NULL,

    CONSTRAINT "Skills_Assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career_Positions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "position_id" INTEGER NOT NULL,
    "requirements" JSONB NOT NULL,

    CONSTRAINT "Career_Positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career_Pathways" (
    "id" SERIAL NOT NULL,
    "from_position_id" INTEGER NOT NULL,
    "to_position_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Career_Pathways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Career_Aspirations" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "aspiration_position_id" INTEGER NOT NULL,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_Career_Aspirations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Experience_Journey" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_Experience_Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journey_Touchpoints" (
    "id" SERIAL NOT NULL,
    "journey_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TouchpointType" NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Journey_Touchpoints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Feedback" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "touchpoint_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "sentiment" "SentimentType" NOT NULL,
    "feedback_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Development_Items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "DevelopmentType" NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Development_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Development_Progress" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "development_item_id" INTEGER NOT NULL,
    "completion_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_Development_Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chatbot_Interaction" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "user_message" TEXT NOT NULL,
    "chatbot_response" TEXT NOT NULL,
    "interaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chatbot_Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employees_email_key" ON "Employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Positions_name_key" ON "Positions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_Inventory_name_key" ON "Skills_Inventory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_Assessments_employee_id_skill_id_evaluator_id_assess_key" ON "Skills_Assessments"("employee_id", "skill_id", "evaluator_id", "assessment_date");

-- CreateIndex
CREATE UNIQUE INDEX "Career_Positions_name_key" ON "Career_Positions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Career_Pathways_from_position_id_to_position_id_key" ON "Career_Pathways"("from_position_id", "to_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Career_Aspirations_employee_id_aspiration_position_key" ON "Employee_Career_Aspirations"("employee_id", "aspiration_position_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Experience_Journey_name_key" ON "Employee_Experience_Journey"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Journey_Touchpoints_journey_id_order_key" ON "Journey_Touchpoints"("journey_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Development_Progress_employee_id_development_item__key" ON "Employee_Development_Progress"("employee_id", "development_item_id");

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Positions" ADD CONSTRAINT "Positions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills_Assessments" ADD CONSTRAINT "Skills_Assessments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills_Assessments" ADD CONSTRAINT "Skills_Assessments_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills_Assessments" ADD CONSTRAINT "Skills_Assessments_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Positions" ADD CONSTRAINT "Career_Positions_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Pathways" ADD CONSTRAINT "Career_Pathways_from_position_id_fkey" FOREIGN KEY ("from_position_id") REFERENCES "Career_Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Pathways" ADD CONSTRAINT "Career_Pathways_to_position_id_fkey" FOREIGN KEY ("to_position_id") REFERENCES "Career_Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Career_Aspirations" ADD CONSTRAINT "Employee_Career_Aspirations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Career_Aspirations" ADD CONSTRAINT "Employee_Career_Aspirations_aspiration_position_id_fkey" FOREIGN KEY ("aspiration_position_id") REFERENCES "Career_Positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Experience_Journey" ADD CONSTRAINT "Employee_Experience_Journey_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Journey_Touchpoints" ADD CONSTRAINT "Journey_Touchpoints_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "Employee_Experience_Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Feedback" ADD CONSTRAINT "Employee_Feedback_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Feedback" ADD CONSTRAINT "Employee_Feedback_touchpoint_id_fkey" FOREIGN KEY ("touchpoint_id") REFERENCES "Journey_Touchpoints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Development_Items" ADD CONSTRAINT "Development_Items_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Development_Progress" ADD CONSTRAINT "Employee_Development_Progress_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Development_Progress" ADD CONSTRAINT "Employee_Development_Progress_development_item_id_fkey" FOREIGN KEY ("development_item_id") REFERENCES "Development_Items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chatbot_Interaction" ADD CONSTRAINT "Chatbot_Interaction_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
