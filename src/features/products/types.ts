export type ProductCategory = "chair" | "table" | "shelf";

export type ProductMaterial = "boucle" | "walnut" | "linen";

export type ProductVariant = {
  id: string;
  name: string;
  material: ProductMaterial;
  colorName: string;
  hexColor: string;
  priceAddon: number;
  finishNote: string;
};

export type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
  unit: "cm";
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  basePrice: number;
  modelUrl: string;
  posterUrl: string;
  dimensions: ProductDimensions;
  variants: ProductVariant[];
};
