/*
  Warnings:

  - You are about to drop the column `tamaño` on the `Productos` table. All the data in the column will be lost.
  - Added the required column `stock` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamano` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Productos] DROP COLUMN [tamaño];
ALTER TABLE [dbo].[Productos] ADD [stock] INT NOT NULL,
[tamano] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
