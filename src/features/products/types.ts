export type ProductCategory =
  | "chair"
  | "lighting"
  | "ottoman"
  | "shelf"
  | "sofa"
  | "table";

export type ProductMaterial =
  | "ash"
  | "boucle"
  | "leather"
  | "linen"
  | "oak"
  | "silk"
  | "steel"
  | "walnut";

export type ProductColor =
  | "beige"
  | "black"
  | "brown"
  | "green"
  | "grey"
  | "natural"
  | "white";

export type ProductVariant = {
  id: string;
  name: string;
  material: ProductMaterial;
  materialName: string;
  color: ProductColor;
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
  roomFit: string;
  modelUrl: string;
  posterUrl: string;
  dimensions: ProductDimensions;
  variants: ProductVariant[];
};

export type RoomPreset = {
  id: string;
  name: string;
  area: string;
  wallColor: string;
  floorTone: string;
  lighting: string;
  fitNote: string;
};
