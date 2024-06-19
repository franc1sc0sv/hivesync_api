import { AxiosSocialService } from "../config/axios";

export const fetchData = async ({ url }: { url: string }) => {
  try {
    const response = await AxiosSocialService.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
