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

    static async fetchMyIssues(section: TSections, nodeOrclub: string) {
        const response = await mainAxios.get(`/issues/get-my-issues?entity=${section}&entityId=${nodeOrclub}`)
        return response.data;
    }

    static async fetchAllIssues(section: TSections, nodeOrclub: string) {
        const response = await mainAxios.get(`/issues/all-issues?entity=${section}&entityId=${nodeOrclub}`)
        return response.data;
    }

    static async fetchGlobalIssues() {
        const response = await mainAxios.get(`/issues/global-active-issues`)
        return response.data;
    }

    static async fetchAllLiveIssues(section: TSections, nodeOrclub: string) {
        const response = await mainAxios.get(`/issues/get-all-active-issues?entity=${section}&entityId=${nodeOrclub}`)
        console.log("live ", response.data);
        return response.data;
    }


}