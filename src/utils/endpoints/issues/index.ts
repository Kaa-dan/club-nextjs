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
        console.log(response.data, 'response my issue');
        return response.data;
    }

    static async fetchAllIssues(section: TSections, nodeOrclub: string) {
        const response = await mainAxios.get(`/issues/all-issues?entity=${section}&entityId=${nodeOrclub}`)
        console.log(response.data, "response all issue");
        return response.data;
    }

    static async fetchGlobalIssues() {
        const response = await mainAxios.get(`/issues/global-active-issues`)
        console.log(response.data, "response global issue");
        return response.data;
    }

    static async fetchAllLiveIssues(section: TSections, nodeOrclub: string) {
        console.log('nic', section, nodeOrclub);
        const response = await mainAxios.get(`/issues/get-all-active-issues?entity=${section}&entityId=${nodeOrclub}`)
        console.log(response.data, "response all live issue");
        return response.data;
    }


    static async fetchSpecificIssue(issueId: string) {
        const response = await mainAxios.get(`/issues/get-issue/${issueId}`)
        console.log(response.data, "response specific issue");
        return response.data;
    }

    static async likeIssue(issueId: string) {
        const response = await mainAxios.put(`/issues/like/${issueId}`);
        console.log("like")
        return response.data;
    }

    static async disLikeIssue(issueId: string) {
        console.log("dislike")
        const response = await mainAxios.put(`/issues/dislike/${issueId}`);
        return response.data;
    }

    static async getClubsNodesNotAdopted(issueId: string) {
        const response = await mainAxios.get(`/issues/get-clubs-and-nodes-not-adopted/${issueId}`);
        return response.data;
    }

    static async adoptOrProposeIssue(data: any) {
        const response = await mainAxios.post('/issues/adopt-issue', data);
        return response.data
    }

    static async fetchProposedIssues(entity: TSections, entityId: string) {
        const response = await mainAxios.get(`/issues/proposed-issues/${entity}/${entityId}`);
        return response.data;
    }

}