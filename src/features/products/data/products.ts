import type { Product, RoomPreset } from "../types";

export const featuredProduct: Product = {
  id: "oslo-lounge-chair",
  name: "Oslo Lounge Chair",
  category: "chair",
  tagline: "Ghế thư giãn nhỏ gọn cho phòng khách hiện đại",
  description:
    "Thiết kế thấp, tựa lưng mở và kích thước vừa căn hộ. Dùng chế độ 3D/AR để kiểm tra tỉ lệ trước khi quyết định.",
  basePrice: 3490000,
  roomFit: "Phòng khách 14-24m2",
  modelUrl:
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/glTF-Binary/SheenChair.glb",
  posterUrl:
    "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SheenChair/screenshot/screenshot.png",
  dimensions: {
    width: 76,
    height: 82,
    depth: 81,
    unit: "cm",
  },
  variants: [
    {
      id: "warm-boucle",
      name: "Warm Boucle",
      material: "boucle",
      materialName: "Boucle",
      color: "beige",
      colorName: "Ivory",
      hexColor: "#d8c8ae",
      priceAddon: 0,
      finishNote: "Vải boucle sáng, hợp phòng khách tông trung tính.",
    },
    {
      id: "walnut-cocoa",
      name: "Walnut Cocoa",
      material: "walnut",
      materialName: "Walnut",
      color: "brown",
      colorName: "Cocoa",
      hexColor: "#6f4e37",
      priceAddon: 240000,
      finishNote: "Tông gỗ nâu ấm, tạo điểm nhấn với sàn sáng.",
    },
    {
      id: "linen-sage",
      name: "Linen Sage",
      material: "linen",
      materialName: "Linen",
      color: "green",
      colorName: "Sage",
      hexColor: "#8c9b83",
      priceAddon: 180000,
      finishNote: "Xanh sage dịu, phù hợp không gian nhiều cây xanh.",
    },
  ],
};

export const products: Product[] = [featuredProduct];

export const roomPresets: RoomPreset[] = [
  {
    area: "18m2",
    fitNote: "Vừa lối đi 80cm cạnh sofa.",
    floorTone: "Sàn gỗ sáng",
    id: "apartment-living",
    lighting: "Ánh sáng cửa sổ",
    name: "Phòng khách căn hộ",
    wallColor: "#f3f1ea",
  },
];
