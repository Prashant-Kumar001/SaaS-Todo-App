export interface ISubscription  {
  id: string;
  userId: string;

  plan: PlanType;
  status: StatusType;

  trialEndsAt?: Date | null;
  endDate?: Date | null;
  cancelAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export interface IUser   {
  name: string;
  email: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
export interface ITodo {
  id: string;
  userId: string;
  title: string;
  description?: string;

  status: TodoStatus;
  priority: TodoPriority;
  completedAt?: Date | null;
  
  createdAt: Date;
  updatedAt: Date;
}

export type TodoStatus = "DONE" | "PENDING";
export type TodoPriority = "LOW" | "HIGH";

export type PlanType = "FREE" | "PRO";
export type StatusType = "ACTIVE" | "TRIALING" | "EXPIRED" | "CANCELED";



export type Action = "STATUS" | "PRIORITY" ;