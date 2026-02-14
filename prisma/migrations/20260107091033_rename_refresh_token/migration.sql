/*
  Warnings:

  - You are about to drop the column `refreshtoken` on the `user_auth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_auth" RENAME COLUMN "refreshtoken" TO "refresh_token";
