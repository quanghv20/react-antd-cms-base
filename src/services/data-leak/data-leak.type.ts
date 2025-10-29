import type { IPaginatedResponse } from "../type";

export interface IDataLeakSearchParams {
  detectTimeStart?: string;
  detectTimeEnd?: string;
  page?: number;
  pageSize?: number;
}

export interface IDataLeak {
  id: number;
  requestId: string;
  subscriberId: string;
  dataSource: string;
  leakId: string;
  severity: string;
  description: string;
  source: string;
  leakName: string;
  dataPublishedTime: number; // timestamp
  detectTime: number; // timestamp
  status: number;
  meta: {
    id: string[];
    status: string[];
    paidTill: string[];
    profileId: string[];
    emailDomain: string[];
    activationId: string[];
    conversionMode: string[];
    registrationDate: string[];
    updateTimestampLong: number[];
    newsletterSubscribed: string[];
  };
  types: string[];
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

/** 🔹 Response khi search account */
export type ISearchDataLeakResponse = IPaginatedResponse<IDataLeak>;
