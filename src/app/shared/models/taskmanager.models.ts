export interface TaskRequestDTO {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  checklistId?: string;
}

export interface TaskResponseDTO {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
  checklistId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistRequestDTO {
  title: string;
  description?: string;
}

export interface ChecklistResponseDTO {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  type: string;
}
