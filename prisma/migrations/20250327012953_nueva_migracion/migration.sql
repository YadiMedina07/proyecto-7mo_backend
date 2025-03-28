BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Sales] (
    [id] INT NOT NULL IDENTITY(1,1),
    [productoId] INT NOT NULL,
    [usuarioId] INT,
    [fechaVenta] DATETIME2 NOT NULL CONSTRAINT [Sales_fechaVenta_df] DEFAULT CURRENT_TIMESTAMP,
    [cantidad] INT NOT NULL CONSTRAINT [Sales_cantidad_df] DEFAULT 1,
    [precioUnitario] FLOAT(53) NOT NULL,
    [total] FLOAT(53) NOT NULL,
    CONSTRAINT [Sales_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Sales_productoId_idx] ON [dbo].[Sales]([productoId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Sales_usuarioId_idx] ON [dbo].[Sales]([usuarioId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Sales_fechaVenta_idx] ON [dbo].[Sales]([fechaVenta]);

-- AddForeignKey
ALTER TABLE [dbo].[Sales] ADD CONSTRAINT [Sales_productoId_fkey] FOREIGN KEY ([productoId]) REFERENCES [dbo].[Productos]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Sales] ADD CONSTRAINT [Sales_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[Usuarios]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
