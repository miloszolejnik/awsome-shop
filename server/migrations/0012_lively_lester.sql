ALTER TABLE "tags" RENAME COLUMN "productId" TO "variantId";--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "tags_productId_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "variant_images" ALTER COLUMN "productId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "variantId" SET DATA TYPE integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_variantId_product_variants_id_fk" FOREIGN KEY ("variantId") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
