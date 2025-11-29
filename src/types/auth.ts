export interface LoginCredentials {
  phone: string;
  password?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
  email?: string;
}
