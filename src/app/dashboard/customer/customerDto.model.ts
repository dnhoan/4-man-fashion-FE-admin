export interface CustomerDto {
  id?: number;
  customerName: string;
  gender?: number;
  birthday?: Date;
  phoneNumber: string;
  address?: string;
  email: string;
  avatar?: string;
  note?: string;
  ctime?: string;
  mtime?: string;
  status: number;
}

export interface Customer {
  id?: number;
  customerName?: string;
  gender?: number;
  birthday?: Date;
  phoneNumber?: string;
  address?: string;
  email?: string;
  avatar?: string;
  note?: string;
  ctime?: string;
  mtime?: string;
  status?: number;
}
