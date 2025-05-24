-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "Skill_Evaluation" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "proficiency_level" "ProficiencyLevel" NOT NULL,
    "evidence" TEXT NOT NULL,
    "evaluation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skill_Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career_Path" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "required_level" INTEGER NOT NULL,
    "parent_path_id" INTEGER,

    CONSTRAINT "Career_Path_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career_Path_Skills" (
    "id" SERIAL NOT NULL,
    "career_path_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "required_proficiency" "ProficiencyLevel" NOT NULL,

    CONSTRAINT "Career_Path_Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee_Career_Progress" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "current_path_id" INTEGER NOT NULL,
    "target_path_id" INTEGER,
    "progress_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "goal_set_date" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_Career_Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "complexity_level" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project_Required_Skills" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "minimum_proficiency" "ProficiencyLevel" NOT NULL,

    CONSTRAINT "Project_Required_Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project_Contribution" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "contribution_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "impact_level" INTEGER NOT NULL,

    CONSTRAINT "Project_Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill_Demonstration" (
    "id" SERIAL NOT NULL,
    "contribution_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "proficiency_demonstrated" "ProficiencyLevel" NOT NULL,
    "demonstration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" TEXT,

    CONSTRAINT "Skill_Demonstration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skill_Evaluation" ADD CONSTRAINT "Skill_Evaluation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Evaluation" ADD CONSTRAINT "Skill_Evaluation_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Path" ADD CONSTRAINT "Career_Path_parent_path_id_fkey" FOREIGN KEY ("parent_path_id") REFERENCES "Career_Path"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Path_Skills" ADD CONSTRAINT "Career_Path_Skills_career_path_id_fkey" FOREIGN KEY ("career_path_id") REFERENCES "Career_Path"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Path_Skills" ADD CONSTRAINT "Career_Path_Skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Career_Progress" ADD CONSTRAINT "Employee_Career_Progress_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Career_Progress" ADD CONSTRAINT "Employee_Career_Progress_current_path_id_fkey" FOREIGN KEY ("current_path_id") REFERENCES "Career_Path"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee_Career_Progress" ADD CONSTRAINT "Employee_Career_Progress_target_path_id_fkey" FOREIGN KEY ("target_path_id") REFERENCES "Career_Path"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Required_Skills" ADD CONSTRAINT "Project_Required_Skills_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Required_Skills" ADD CONSTRAINT "Project_Required_Skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Contribution" ADD CONSTRAINT "Project_Contribution_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_Contribution" ADD CONSTRAINT "Project_Contribution_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Demonstration" ADD CONSTRAINT "Skill_Demonstration_contribution_id_fkey" FOREIGN KEY ("contribution_id") REFERENCES "Project_Contribution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill_Demonstration" ADD CONSTRAINT "Skill_Demonstration_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Career_Progress_employee_id_key" ON "Employee_Career_Progress"("employee_id");

-- CreateIndex
CREATE INDEX "idx_skill_evaluation_employee" ON "Skill_Evaluation"("employee_id");
CREATE INDEX "idx_skill_evaluation_skill" ON "Skill_Evaluation"("skill_id");
CREATE INDEX "idx_project_contribution_employee" ON "Project_Contribution"("employee_id");
CREATE INDEX "idx_project_contribution_project" ON "Project_Contribution"("project_id");
CREATE INDEX "idx_skill_demonstration_contribution" ON "Skill_Demonstration"("contribution_id");
