import axios from "axios";

export const AxiosUserInfoService = axios.create({
  baseURL: "http://hivesync_api-user_info_service-1:3000/api/v1",
});
