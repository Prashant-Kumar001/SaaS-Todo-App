import { ISubscription } from "@/types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface TodoPayload {
  title: string;
  description?: string;
}

class UserClient {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
      });

      const data = await res.json();
      if (!res.ok)
        return { success: false, error: data.error ?? "Request failed" };

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

 
  async syncUser(): Promise<ApiResponse<any>> {
    return this.request("/user/sync", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  async me(): Promise<ApiResponse<any>> {
    return this.request("/user/me", { method: "GET" });
  }

 
  async createTodo(todo: TodoPayload): Promise<ApiResponse<any>> {
    return this.request("/todos/create", {
      method: "POST",
      body: JSON.stringify(todo),
    });
  }

  async getTodos(): Promise<ApiResponse<any>> {
    return this.request("/todos", { method: "GET" });
  }

  async deleteTodo(id: string): Promise<ApiResponse<any>> {
    return this.request(`/todos/${id}/delete`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  }

  async toggleTodo(
    id: string,
    status?: string,
    priority?: string,
    action: string = "toggle"
  ): Promise<ApiResponse<any>> {
    return this.request(`/todos/${id}/toggle`, {
      method: "PUT",
      body: JSON.stringify({ id, status, priority, action }),
    });
  }

  async getSubscriptions(): Promise<ApiResponse<ISubscription[]>> {
    return this.request("/subscriptions", { method: "GET" });
  }

  async upgradePlan(plan: string): Promise<ApiResponse<any>> {
    return this.request("/subscriptions/upgrade", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  }


  async cancelPlan(): Promise<ApiResponse<any>> {
    return this.request("/subscriptions/cancel", {
      method: "POST",
      body: JSON.stringify({}),
      });
  }
}


export const userClient = new UserClient();
