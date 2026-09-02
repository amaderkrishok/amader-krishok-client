export enum OvijogStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

export interface Ovijog {
  id: number;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: OvijogStatus;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOvijogDTO {
  name: string;
  phone: string;
  subject: string;
  message: string;
}
