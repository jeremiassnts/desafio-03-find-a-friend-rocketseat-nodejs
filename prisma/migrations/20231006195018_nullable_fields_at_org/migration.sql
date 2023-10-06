-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "neighborhood" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL;
