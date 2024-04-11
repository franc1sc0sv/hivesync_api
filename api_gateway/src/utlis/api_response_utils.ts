import { StatusCodes } from "http-status-codes";
import {
  API_RESPONSE,
  DataResponse,
  ErrorParams,
  ResponseParams,
} from "../types/api_response";
import { API_STATUS } from "../enums/response_status";

const response_structure = ({ data, code, status }: API_RESPONSE) => {
  return { DATA: data, CODE: code, STATUS: status };
};

export const good_response = ({ data }: ResponseParams) => {
  const STATUS = API_STATUS.OK;
  const CODE = StatusCodes.OK;

  return response_structure({
    data: data,
    status: STATUS,
    code: CODE,
  });
};

export const error_response = ({ data }: ErrorParams) => {
  const STATUS = API_STATUS.FAILED;
  const CODE = StatusCodes.BAD_REQUEST;

  return response_structure({
    data: data,
    status: STATUS,
    code: CODE,
  });
};

export const bad_response = ({ data }: ErrorParams) => {
  const STATUS = API_STATUS.FAILED;
  const CODE = StatusCodes.INTERNAL_SERVER_ERROR;

  return response_structure({
    data: data,
    status: STATUS,
    code: CODE,
  });
};

export const custom_response = ({
  data,
  code,
  status,
}: {
  data: DataResponse;
  code: StatusCodes;
  status: API_STATUS;
}) => {
  return response_structure({
    data: data,
    status: status,
    code: code,
  });
};
