import { APIRequestContext, APIResponse } from "@playwright/test";

const baseURL = "https://api.restful-api.dev";

export type ApiObjectPayload = {
  name: string;
  data: Record<string, unknown>;
};

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  getObject(id: string): Promise<APIResponse> {
    return this.request.get(`${baseURL}/objects/${id}`);
  }

  createObject(payload: ApiObjectPayload): Promise<APIResponse> {
    return this.request.post(`${baseURL}/objects`, { data: payload });
  }

  updateObject(id: string, payload: ApiObjectPayload): Promise<APIResponse> {
    return this.request.put(`${baseURL}/objects/${id}`, { data: payload });
  }

  deleteObject(id: string): Promise<APIResponse> {
    return this.request.delete(`${baseURL}/objects/${id}`);
  }
}
