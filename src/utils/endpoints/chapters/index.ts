import { withTokenAxios } from "@/lib/mainAxios";

export class ChapterEndpoints {
  static async fetchChapterDetails(chapterId: string) {
    const { data } = await withTokenAxios.get("/chapters/" + chapterId);
    return data;
  }
}
