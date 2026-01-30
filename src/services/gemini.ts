import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const generateSnsContent = async (menuName: string, theme: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `cafe120 가맹점주를 위한 SNS 마케팅 문구를 작성해줘. 메뉴명: ${menuName}, 테마: ${theme}. 인스타그램 게시물 형식으로 해시태그 포함해서 3가지 버전으로 제안해줘.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating SNS content:", error);
        return "콘텐츠 생성 중 오류가 발생했습니다.";
    }
};

export const getLegalConsult = async (query: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `너는 cafe120 가맹점주를 위한 전문 비즈니스 컨설턴트야. 다음 질문 사항(노무/세무/법무)에 대해 답변해줘: ${query}. 가맹점주가 이해하기 쉽게 설명해줘.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error getting legal consult:", error);
        return "상담 중 오류가 발생했습니다.";
    }
};
