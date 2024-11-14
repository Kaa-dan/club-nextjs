import { mainAxios } from "@/lib/mainAxios";
import { type } from "os";

export class RulesAndRegulationsEndpoints {
    static async reportOffence(data: any) {
        const response = await mainAxios.post("/rules-regulations/reportOffence", data);
        return response.data;
    }

    static async fetchOffences(section: TSections, typeId: string) {
        const response = await mainAxios.get(`/rules-regulations/get-all-report-offence?type=${section}&clubId=${typeId}`);
        return response.data;
    }
}