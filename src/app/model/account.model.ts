import { Role } from "./role.model";

export interface Account{
  id?: number;
  email?: string;
  password?: string;
  phoneNumber?: number;
  roles?: Role[];
  status?: number;
}

export interface AccountDTO{
  id?: number;
  email?: string;
  password?: string;
  phoneNumber?: number;
  role?: Role;
  status?: number;
}
