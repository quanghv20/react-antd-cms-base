export interface IPermission {
  id: number;
  name: string;
  description: string | null;
  code: string;
}

export interface IPermissionPayload {
  id?: number;
  name: string;
  description?: string | null;
  code: string;
}
