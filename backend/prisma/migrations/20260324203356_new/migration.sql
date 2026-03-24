-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_userId_fkey";

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
