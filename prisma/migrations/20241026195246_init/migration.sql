/*
  Warnings:

  - You are about to drop the column `evaluator_id` on the `Skills_Assessments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employee_id,skill_id,assessment_date]` on the table `Skills_Assessments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Skills_Assessments" DROP CONSTRAINT "Skills_Assessments_evaluator_id_fkey";

-- DropIndex
DROP INDEX "Skills_Assessments_employee_id_skill_id_evaluator_id_assess_key";

-- AlterTable
ALTER TABLE "Skills_Assessments" DROP COLUMN "evaluator_id";

-- CreateTable
CREATE TABLE "Skills_Assessment_Evaluators" (
    "id" SERIAL NOT NULL,
    "skills_assessment_id" INTEGER NOT NULL,
    "evaluator_id" INTEGER NOT NULL,

    CONSTRAINT "Skills_Assessment_Evaluators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Performance_Evaluation" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "evaluation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "strengths" TEXT NOT NULL,
    "improvement_areas" TEXT NOT NULL,
    "comments" TEXT NOT NULL,

    CONSTRAINT "Employee_Performance_Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Performance_Evaluation_Evaluators" (
    "id" SERIAL NOT NULL,
    "performance_evaluation_id" INTEGER NOT NULL,
    "evaluator_id" INTEGER NOT NULL,

    CONSTRAINT "Performance_Evaluation_Evaluators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Metrics" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "average_proficiency_level" DOUBLE PRECISION NOT NULL,
    "total_positive_feedbacks" INTEGER NOT NULL,
    "total_neutral_feedbacks" INTEGER NOT NULL,
    "total_negative_feedbacks" INTEGER NOT NULL,
    "completed_development_items" INTEGER NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_Metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Evaluator_Assessments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Skills_Assessment_Evaluators_skills_assessment_id_evaluator_key" ON "Skills_Assessment_Evaluators"("skills_assessment_id", "evaluator_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Performance_Evaluation_employee_id_evaluation_date_key" ON "Employee_Performance_Evaluation"("employee_id", "evaluation_date");

-- CreateIndex
CREATE UNIQUE INDEX "Performance_Evaluation_Evaluators_performance_evaluation_id_key" ON "Performance_Evaluation_Evaluators"("performance_evaluation_id", "evaluator_id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Metrics_employee_id_key" ON "Employee_Metrics"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "_Evaluator_Assessments_AB_unique" ON "_Evaluator_Assessments"("A", "B");

-- CreateIndex
CREATE INDEX "_Evaluator_Assessments_B_index" ON "_Evaluator_Assessments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_Assessments_employee_id_skill_id_assessment_date_key" ON "Skills_Assessments"("employee_id", "skill_id", "assessment_date");

-- AddForeignKey
ALTER TABLE "Skills_Assessment_Evaluators" ADD CONSTRAINT "Skills_Assessment_Evaluators_skills_assessment_id_fkey" FOREIGN KEY ("skills_assessment_id") REFERENCES "Skills_Assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skills_Assessment_Evaluators" ADD CONSTRAINT "Skills_Assessment_Evaluators_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Performance_Evaluation" ADD CONSTRAINT "Employee_Performance_Evaluation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance_Evaluation_Evaluators" ADD CONSTRAINT "Performance_Evaluation_Evaluators_performance_evaluation_i_fkey" FOREIGN KEY ("performance_evaluation_id") REFERENCES "Employee_Performance_Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Performance_Evaluation_Evaluators" ADD CONSTRAINT "Performance_Evaluation_Evaluators_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Metrics" ADD CONSTRAINT "Employee_Metrics_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Evaluator_Assessments" ADD CONSTRAINT "_Evaluator_Assessments_A_fkey" FOREIGN KEY ("A") REFERENCES "Employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Evaluator_Assessments" ADD CONSTRAINT "_Evaluator_Assessments_B_fkey" FOREIGN KEY ("B") REFERENCES "Skills_Assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
