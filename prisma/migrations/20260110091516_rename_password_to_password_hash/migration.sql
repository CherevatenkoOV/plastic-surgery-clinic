/*
  Warnings:

  - You are about to drop the column `password` on the `user_auth` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `user_auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_auth" RENAME COLUMN "password" TO "passwordHash";
