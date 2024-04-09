import { StatusCodes } from "http-status-codes";
import {
  API_RESPONSE,
  DataResponse,
  ErrorResponse,
} from "../types/api_response";
import { API_STATUS } from "../enums/response_status";

type ErrorParams = {
  data: ErrorResponse;
  message?: string;
};

type ResponseParams = {
  data: object;
  message?: string;
};

const response_structure = ({ data, code, status, message }: API_RESPONSE) => {
  return { DATA: data, CODE: code, STATUS: status, MESSAGE: message };
};

export const good_response = ({ data, message }: ResponseParams) => {
  const STATUS = API_STATUS.OK;
  const CODE = StatusCodes.OK;

  return response_structure({
    data: data,
    status: STATUS,
    code: CODE,
    message,
  });
};

export const error_response = ({ data, message = "Error" }: ErrorParams) => {
  const STATUS = API_STATUS.FAILED;
  const CODE = StatusCodes.BAD_REQUEST;

  return response_structure({
    data: data,
    status: STATUS,
    code: CODE,
    message,
  });
};

export const bad_response = ({ data, message = "Error" }: ErrorParams) => {
  const STATUS = API_STATUS.FAILED;
  const CODE = StatusCodes.INTERNAL_SERVER_ERROR;

  return response_structure({
    data: data,
    status: STATUS,
    code: CODE,
    message,
  });
};

export const custom_response = ({
  data,
  code,
  status,
  message,
}: {
  data: DataResponse;
  code: StatusCodes;
  status: API_STATUS;
  message: String;
}) => {
  return response_structure({
    data: data,
    status: status,
    code: code,
    message,
  });
};
