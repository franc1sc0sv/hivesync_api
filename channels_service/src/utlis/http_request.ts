import { AxiosInstance } from "axios";

export const postData = async ({
  url,
  AxiosConfig,
  data,
  token = "",
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  data: any;
  token?: string;
}) => {
  try {
    const response = await AxiosConfig.post(
      url,
      data,
      headers({ token: token })
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getData = async ({
  url,
  AxiosConfig,
  token = "",
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  token?: string;
}) => {
  try {
    const response = await AxiosConfig.get(url, headers({ token: token }));
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
  token = "",
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  data: any;
  id: number;
  token?: string;
}) => {
  try {
    const response = await AxiosConfig.patch(
      `${url}/?id=${id}`,
      data,
      headers({ token: token })
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async ({
  url,
  id,
  AxiosConfig,
  token = "",
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  id: number;
  token?: string;
}) => {
  try {
    const response = await AxiosConfig.delete(
      `${url}/?id=${id}`,
      headers({ token: token })
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const headers = ({ token }: { token: string }) => {
  return {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};
