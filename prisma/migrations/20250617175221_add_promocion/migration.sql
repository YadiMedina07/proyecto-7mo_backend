/*
  Warnings:

  - You are about to alter the column `descuento` on the `Promocion` table. The data in that column could be lost. The data in that column will be cast from `Float(53)` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Promocion] ALTER COLUMN [descuento] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
