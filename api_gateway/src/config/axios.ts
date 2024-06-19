import axios from "axios";

export const AxiosSocialService = axios.create({
  baseURL: "http://social_service:3001",
});

export const AxiosUserInfoService = axios.create({
  baseURL: "http://hivesync_api-user_info_service-1:3000/api/v1",
});
