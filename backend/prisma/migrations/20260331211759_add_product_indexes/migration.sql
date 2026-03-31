-- CreateIndex
CREATE INDEX "Product_isVisible_createdAt_idx" ON "Product"("isVisible", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_availabilityStatus_idx" ON "Product"("availabilityStatus");

-- CreateIndex
CREATE INDEX "Product_label_idx" ON "Product"("label");
