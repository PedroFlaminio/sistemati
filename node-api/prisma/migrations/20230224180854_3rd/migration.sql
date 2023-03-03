/*
  Warnings:

  - You are about to alter the column `descricao` on the `solicitacao` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `sugestao` on the `solicitacao` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `resolucao` on the `solicitacao` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- AlterTable
ALTER TABLE "solicitacao" ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "sugestao" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "resolucao" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "solicitacao_arquivos" ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'print';
