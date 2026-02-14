-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "doctor_weekly_slots" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "doctor_id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "patient_id" SET DEFAULT gen_random_uuid();
