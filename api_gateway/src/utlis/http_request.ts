import { AxiosInstance } from "axios";

export const postData = async ({
  url,
  AxiosConfig,
  data,
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  data: any;
}) => {
  try {
    const response = await AxiosConfig.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getData = async ({
  url,
  AxiosConfig,
}: {
  AxiosConfig: AxiosInstance;
  url: string;
}) => {
  try {
    const response = await AxiosConfig.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchData = async ({
  url,
  data,
  id,
  AxiosConfig,
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  data: any;
  id: number;
}) => {
  try {
    const response = await AxiosConfig.patch(`${url}/?id=${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async ({
  url,
  id,
  AxiosConfig,
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  id: number;
}) => {
  try {
    const response = await AxiosConfig.delete(`${url}/?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
