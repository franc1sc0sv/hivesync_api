import { AxiosInstance } from "axios";

export const postData = async ({
  url,
  AxiosConfig,
  data,
  headers = () => {
    return {};
  },
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  data: any;
  headers?: () => Object;
}) => {
  try {
    const response = await AxiosConfig.post(url, data, headers());
    return response.data.DATA;
  } catch (error) {
    throw error;
  }
};

export const getData = async ({
  url,
  AxiosConfig,
  headers = () => {
    return {};
  },
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  headers?: () => Object;
}) => {
  try {
    const response = await AxiosConfig.get(url, headers());
    return response.data.DATA;
  } catch (error) {
    throw error;
  }
};

export const patchData = async ({
  url,
  data,
  id,
  AxiosConfig,
  headers = () => {
    return {};
  },
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  data: any;
  id: number;
  headers?: () => Object;
}) => {
  try {
    const response = await AxiosConfig.patch(
      `${url}/?id=${id}`,
      data,
      headers()
    );
    return response.data.DATA;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async ({
  url,
  id,
  AxiosConfig,
  headers = () => {
    return {};
  },
}: {
  AxiosConfig: AxiosInstance;
  url: string;
  id: number;
  headers?: () => Object;
}) => {
  try {
    const response = await AxiosConfig.delete(`${url}/${id}`, headers());
    return response.data.DATA;
  } catch (error) {
    throw error;
  }
};

export const headers_by_json = ({ data }: { data: any }) => {
  return () => {
    return { headers: { user: JSON.stringify(data) } };
  };
};

export const headers_by_token = ({ token }: { token: string }) => {
  return () => {
    return {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
  };
};
