import { mainAxios } from "@/lib/mainAxios";

export class IssuesEndpoints {
    static async createIssue(data: any) {
        const response = await mainAxios.post('/issues', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data;
    }


}