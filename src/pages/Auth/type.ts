export interface IUserLogged {
  id: number;
  username: string;
  email: string;
  phone: string;
  gender: number;
  dob: string;
  address: string;
  status: number;
  fullname: string;
  type: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  permissions: string[];
  roles: string[];
}
