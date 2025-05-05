/*
  Warnings:

  - You are about to drop the column `city` on the `SoilData` table. All the data in the column will be lost.
  - You are about to drop the column `nitrogen` on the `SoilData` table. All the data in the column will be lost.
  - You are about to drop the column `ph` on the `SoilData` table. All the data in the column will be lost.
  - You are about to drop the column `phosphorous` on the `SoilData` table. All the data in the column will be lost.
  - You are about to drop the column `potassium` on the `SoilData` table. All the data in the column will be lost.
  - You are about to drop the column `rainfall` on the `SoilData` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `SoilData` table. All the data in the column will be lost.
  - Added the required column `B` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Cu` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `EC` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Fe` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `K` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Mn` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `N` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OC` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `P` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `S` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Zn` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidence` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fertilityClass` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pH` to the `SoilData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SoilData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoilData" DROP COLUMN "city",
DROP COLUMN "nitrogen",
DROP COLUMN "ph",
DROP COLUMN "phosphorous",
DROP COLUMN "potassium",
DROP COLUMN "rainfall",
DROP COLUMN "state",
ADD COLUMN     "B" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Cu" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "EC" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Fe" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "K" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Mn" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "N" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "OC" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "P" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "S" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Zn" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fertilityClass" TEXT NOT NULL,
ADD COLUMN     "pH" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "SoilData_userId_idx" ON "SoilData"("userId");
