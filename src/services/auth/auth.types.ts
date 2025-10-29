export interface IAuthLoginPayload {
  username: string;
  password: string;
}

export interface IAuthLoginResponse {
  accessToken: { token: string; duration: number };
  refreshToken: { token: string; duration: number };
}

export interface IUserLogged {
  id: number;
  username: string;
  email: string;
  phone: string;
  gender: number;
  dob: string | null;
  address: string | null;
  status: number;
  fullname: string;
  type: number;
  createdBy: string | null;
  createdDate: string | null;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  roles: string[];
  permissions: string[];
}
