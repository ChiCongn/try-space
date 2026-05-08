import { apiClient, mockDelay, useMockApi } from "./api";
import type { ApiResponse, CreateOrderPayload, Order } from "../types";

const mockOrdersKey = "tryspace-mock-orders";

function readMockOrders() {
  try {
    return JSON.parse(localStorage.getItem(mockOrdersKey) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

function writeMockOrders(orders: Order[]) {
  localStorage.setItem(mockOrdersKey, JSON.stringify(orders));
}

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
      writeMockOrders([order, ...readMockOrders()]);
      return { data: order, message: "Đặt hàng thành công" };
    }

    const response = await apiClient.post<ApiResponse<Order>>("/orders", payload);
    return response.data;
  },

  async getOrders(): Promise<ApiResponse<Order[]>> {
    if (useMockApi) {
      await mockDelay(300);
      const data = readMockOrders();
      return { data, pagination: { limit: data.length, page: 1, total: data.length } };
    }

    const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
    return response.data;
  },

  async getOrderDetail(orderId: string): Promise<ApiResponse<Order>> {
    if (useMockApi) {
      await mockDelay(200);
      const order = readMockOrders().find((item) => item.id === orderId);
      if (!order) throw new Error("Order not found");
      return { data: order };
    }

    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return response.data;
  },
};
