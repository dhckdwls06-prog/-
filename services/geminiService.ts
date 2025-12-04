import { Message } from "../types";

// Simple local logic to simulate an AI coach without external API
export const generateCoachResponse = async (
  history: Message[],
  userContext: string
): Promise<string> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 600));

  const lastUserMsg = history[history.length - 1];
  const text = lastUserMsg?.text || "";
  
  // Keyword-based simple response logic
  if (text.includes("힘들") || text.includes("지쳐") || text.includes("우울") || text.includes("슬퍼")) {
    const responses = [
      "지금 많이 힘드시군요. 그럴 땐 잠시 모든 걸 내려놓고 쉬어도 괜찮아요. 토닥토닥.",
      "오늘 하루 버티느라 정말 고생 많으셨어요. 당신은 충분히 잘하고 있어요.",
      "마음이 지칠 땐 따뜻한 차 한 잔이나 좋아하는 음악이 도움이 될 수 있어요.",
      "무리하지 않아도 돼요. 오늘은 그냥 이불 속에서 푹 쉬는 건 어때요?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (text.includes("안녕") || text.includes("반가")) {
    return "안녕하세요! 도담입니다. 오늘 기분은 좀 어떠신가요? 😊";
  }

  if (text.includes("퀘스트") || text.includes("미션") || text.includes("할일")) {
    return "퀘스트는 아주 작은 것부터 시작해보세요. '물 한 잔 마시기'처럼 쉬운 것부터요! 성공하면 코인도 드려요 💰";
  }

  if (text.includes("고마") || text.includes("감사")) {
    return "저도 도전자님 곁에 있을 수 있어서 기뻐요. 언제든 이야기 들려주세요. 💚";
  }

  if (text.includes("심심") || text.includes("놀아")) {
    return "심심할 땐 '취미' 퀘스트를 한번 확인해보세요! 아니면 편의점에서 맛있는 간식을 사먹는 건 어때요?";
  }

  // Default fallback responses
  const defaultResponses = [
    "그렇군요. 어떤 이야기든 편하게 해주세요. 저는 항상 여기 있어요.",
    "듣고 있어요. 당신의 하루가 궁금해요.",
    "작은 발걸음이 큰 변화를 만든다는 것, 잊지 마세요! 🌱",
    "오늘 하늘은 한번 보셨나요? 가끔은 환기가 필요해요."
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};