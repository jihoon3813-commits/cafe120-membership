import { GoogleGenerativeAI } from "@google/generative-ai";
import { dbService } from "./dbService";

const getApiKey = async () => {
    // 1. Try DB Config first (Admin setting takes priority)
    try {
        const dbKey = await dbService.getConfig('google_api_key');
        if (dbKey) return dbKey;
    } catch (e) {
        console.warn("Failed to fetch Google API Key from DB", e);
    }

    // 2. Fallback to Environment Variable
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) return envKey;

    throw new Error("Google Gemini API Key가 설정되지 않았습니다. 관리자 페이지에서 설정해주세요.");
};

const getGenAI = async () => {
    const apiKey = await getApiKey();
    return new GoogleGenerativeAI(apiKey);
};

export const generateImage = async (prompt: string) => {
    try {
        const apiKey = await getApiKey();
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instances: [
                    { prompt: prompt }
                ],
                parameters: {
                    sampleCount: 1,
                    aspectRatio: "1:1"
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            // Check for specific model not found error
            if (response.status === 404 || err.error?.message?.includes('not found')) {
                throw new Error("구글 Imagen 모델을 찾을 수 없습니다.\nGoogle Cloud Console에서 'Vertex AI API'를 추가로 '사용 설정' 해보시거나, OpenAI 엔진을 사용해주세요.");
            }
            throw new Error(err.error?.message || response.statusText);
        }

        const data = await response.json();
        const prediction = data.predictions?.[0];

        if (prediction?.bytesBase64Encoded) {
            return `data:${prediction.mimeType || 'image/png'};base64,${prediction.bytesBase64Encoded}`;
        }

        throw new Error("No image data returned from Gemini");
    } catch (error: any) {
        console.error("Error generating image with Gemini:", error);
        throw new Error("Gemini 이미지 생성 실패: " + (error.message || "알 수 없는 오류"));
    }
};

export const generateSnsContent = async (menuName: string, theme: string) => {
    try {
        const genAI = await getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `cafe120 가맹점주를 위한 SNS 마케팅 문구를 작성해줘. 메뉴명: ${menuName}, 테마: ${theme}. 인스타그램 게시물 형식으로 해시태그 포함해서 3가지 버전으로 제안해줘. 이모지도 적절히 사용해.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating SNS content:", error);
        return "콘텐츠 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
};

export const generateDesignDraft = async (eventName: string, details: string, theme: string) => {
    try {
        const genAI = await getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // Request JSON output for structured design
        const prompt = `
            너는 전문 포스터 디자이너야. cafe120의 이벤트 포스터를 위한 텍스트와 디자인 가이드를 작성해줘.
            이벤트명: ${eventName}
            상세내용: ${details}
            테마: ${theme}
            
            다음 JSON 형식으로 출력해줘:
            {
                "title": "눈길을 끄는 헤드라인",
                "subtitle": "매력적인 서브텍스트",
                "body": "핵심 내용 설명 (간결하게)",
                "cta": "행동 유도 문구",
                "colorCode": "테마에 어울리는 추천 메인 컬러코드 (Hex)",
                "designTip": "디자인 배치나 폰트 추천 등 팁"
            }
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json|```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating design draft:", error);
        return null; // Handle error in UI
    }
};

export const getTaxConsult = async (query: string) => {
    try {
        const genAI = await getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            너는 cafe120 가맹점주를 돕는 친절하고 전문적인 AI 세무 컨설턴트야. 
            질문: ${query}
            
            답변 시 주의사항:
            1. 어려운 세무 용어는 쉽게 풀어서 설명해줘.
            2. 음식점업/카페 창업자에게 특화된 조언을 해줘.
            3. 법적 책임이 없음을 마지막에 명시해줘 (참고용으로만 활용).
            4. 마크다운 형식으로 가독성 있게 작성해줘.
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error("Error getting tax consult:", error);

        let availableModels = "";
        try {
            const apiKey = await getApiKey();
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await res.json();
            if (data.models) {
                availableModels = "\n[사용 가능 모델]: " + data.models.map((m: any) => m.name.replace('models/', '')).join(', ');
            }
        } catch (e) {
            availableModels = "\n(모델 목록 조회 실패)";
        }

        return `세무 상담 오류: ${error.message || "알 수 없는 오류"}${availableModels}`;
    }
};

export const getLaborConsult = async (query: string) => {
    try {
        const genAI = await getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            너는 cafe120 가맹점주를 돕는 AI 노무 비서야.
            질문: ${query}
            
            답변 시 주의사항:
            1. 근로기준법에 의거하여 정확하게 답변해줘.
            2. 아르바이트 채용이 많은 카페 특성을 고려해줘.
            3. 법적 효력이 없는 참고용 조언임을 명시해줘.
            4. 마크다운 형식으로 작성해줘.
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error getting labor consult:", error);
        return "노무 상담 중 오류가 발생했습니다.";
    }
};

export const getLegalConsult = async (query: string) => {
    try {
        const genAI = await getGenAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            너는 cafe120 가맹점주를 돕는 AI 법률 비서야.
            질문: ${query}
            
            답변 시 주의사항:
            1. 상가임대차보호법, 민법 등 관련 법령에 기반하여 답변해줘.
            2. 카페 운영 중 발생할 수 있는 분쟁(임대차, 권리금, 고객 클레임 등)에 특화된 조언을 해줘.
            3. 법적 효력이 없는 참고용 조언임을 명시해줘.
            4. 마크다운 형식으로 작성해줘.
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error getting legal consult:", error);
        return "법률 상담 중 오류가 발생했습니다.";
    }
};
