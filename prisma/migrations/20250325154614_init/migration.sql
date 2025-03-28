/*
  Warnings:

  - You are about to drop the column `tamanoId` on the `Carrito` table. All the data in the column will be lost.
  - You are about to drop the column `saborId` on the `Productos` table. All the data in the column will be lost.
  - You are about to drop the column `tamanoId` on the `Productos` table. All the data in the column will be lost.
  - You are about to drop the `Sabores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tamaños` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `precio` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sabor` to the `Productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tamaño` to the `Productos` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Carrito] DROP CONSTRAINT [Carrito_tamanoId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Productos] DROP CONSTRAINT [Productos_saborId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Productos] DROP CONSTRAINT [Productos_tamanoId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Carrito] DROP COLUMN [tamanoId];

-- AlterTable
ALTER TABLE [dbo].[Productos] DROP COLUMN [saborId],
[tamanoId];
ALTER TABLE [dbo].[Productos] ADD [precio] FLOAT(53) NOT NULL,
[sabor] NVARCHAR(1000) NOT NULL,
[tamaño] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[Sabores];

-- DropTable
DROP TABLE [dbo].[Tamaños];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
