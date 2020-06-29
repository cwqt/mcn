// import { RecordableType } from "../Node.model";

export interface IApiKey {
  _id: string;
  key_name: string;
  created_at: number;
}

export interface IApiKeyPrivate extends IApiKey {
  key: string;
}
