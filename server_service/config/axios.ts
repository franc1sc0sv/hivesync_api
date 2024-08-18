import axios from "axios";

export const AxiosChannelsService = axios.create({
  baseURL: "http://hivesync_api-channels_service-1:3000/api/v1",
});
