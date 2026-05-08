import { apiClient, mockDelay, useMockApi } from "./api";
import type { ApiResponse, CreateOrderPayload, Order } from "../types";

export const orderApi = {
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    if (useMockApi) {
      await mockDelay(500);
      const order: Order = {
        id: `ORD${Date.now()}`,
        userId: "mock-user",
        items: payload.items,
        shippingAddress: payload.shippingAddress,
        paymentMethod: payload.paymentMethod,
        status: "pending",
        subtotal: payload.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
        shippingFee: 0,
        total: payload.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { data: order, message: "Đặt hàng thành công" };
    }

    const response = await apiClient.post<ApiResponse<Order>>("/orders", payload);
    return response.data;
  },

  async getOrders(): Promise<ApiResponse<Order[]>> {
    if (useMockApi) {
      await mockDelay(300);
      return { data: [] };
    }

    const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
    return response.data;
  },

  async getOrderDetail(orderId: string): Promise<ApiResponse<Order>> {
    if (useMockApi) {
      await mockDelay(200);
      throw new Error("Order not found");
    }

    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  },
};
