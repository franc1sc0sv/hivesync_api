import { StatusCodes } from "http-status-codes";
import { API_STATUS } from "../enums/response_status";

type ErrorResponse = {
  data?: object;
  message?: string;
  error?: any;
};

type GoodResponse = object;
type DataResponse = ErrorResponse | GoodResponse;

type API_RESPONSE = {
  data: DataResponse;
  code: StatusCodes;
  status: API_STATUS;
  message?: String;
};

type ErrorParams = {
  data: ErrorResponse;
  message?: string;
};

type ResponseParams = {
  data: object;
  message?: string;
};
