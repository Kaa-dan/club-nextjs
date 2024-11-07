import { mainAxios } from "@/lib/mainAxios";

export class SharedEndpoints {
    static async search(term: string, tag?: string) {
        const response = await mainAxios.get("/search", {
            params: {
                term,
                tag
            }
        });
        return response.data;
    }
}