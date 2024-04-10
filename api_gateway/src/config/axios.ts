import axios from "axios";

export const AxiosSocialService = axios.create({
    baseURL: "http://social_service:3001"
})

export const AxiosWorkSpaceService = axios.create({
    baseURL: ""
})


