import { AxiosSocialService } from "../config/axios";

export const fetchData = async ({ url, method }: { url: string, method: string }) => {
    try {
        const response = await AxiosSocialService.get(url);
        return response.data
    } catch (error) {
        throw error
    }
}