/*
  Warnings:

  - You are about to drop the column `tamanoId` on the `Detalle_Pedido` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Detalle_Pedido] DROP COLUMN [tamanoId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
