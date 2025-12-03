import { Badge, Difficulty, StoreItem, Task, TaskCategory } from './types';

export const INITIAL_TASKS: Task[] = [
  // LIFESTYLE (Basic)
  {
    id: 't1',
    title: '아침 햇살 맞기',
    description: '창문을 열고 1분 동안 햇빛을 느껴보세요.',
    xp: 10,
    coins: 1,
    category: TaskCategory.LIFESTYLE,
    difficulty: Difficulty.EASY,
    completed: false,
  },
  // EXERCISE
  {
    id: 'e1',
    title: '기지개 켜기',
    description: '굳어있는 몸을 쭉 펴보세요.',
    xp: 15,
    coins: 2,
    category: TaskCategory.EXERCISE,
    difficulty: Difficulty.EASY,
    completed: false,
  },
  {
    id: 'e2',
    title: '동네 한 바퀴 (15분)',
    description: '좋아하는 음악을 들으며 가볍게 걸어요.',
    xp: 50,
    coins: 10,
    category: TaskCategory.EXERCISE,
    difficulty: Difficulty.HARD,
    completed: false,
  },
  {
    id: 'e3',
    title: '스쿼트 10회',
    description: '천천히 정확한 자세로 10번만!',
    xp: 30,
    coins: 5,
    category: TaskCategory.EXERCISE,
    difficulty: Difficulty.MEDIUM,
    completed: false,
  },
  // STUDY
  {
    id: 's1',
    title: '책상 정리하기',
    description: '공부나 작업을 위해 책상 위 물건 3개 정리.',
    xp: 20,
    coins: 3,
    category: TaskCategory.STUDY,
    difficulty: Difficulty.EASY,
    completed: false,
  },
  {
    id: 's2',
    title: '책 2페이지 읽기',
    description: '부담 없이 딱 2페이지만 읽어보세요.',
    xp: 30,
    coins: 5,
    category: TaskCategory.STUDY,
    difficulty: Difficulty.MEDIUM,
    completed: false,
  },
  {
    id: 's3',
    title: '영단어 3개 외우기',
    description: '오늘의 단어 3개만 기억해볼까요?',
    xp: 40,
    coins: 7,
    category: TaskCategory.STUDY,
    difficulty: Difficulty.MEDIUM,
    completed: false,
  },
  // HOBBY
  {
    id: 'h1',
    title: '좋아하는 노래 듣기',
    description: '나만의 힐링 곡을 감상하며 멍때리기.',
    xp: 15,
    coins: 2,
    category: TaskCategory.HOBBY,
    difficulty: Difficulty.EASY,
    completed: false,
  },
  {
    id: 'h2',
    title: '낙서하기',
    description: '종이에 아무 그림이나 자유롭게 그려보세요.',
    xp: 25,
    coins: 4,
    category: TaskCategory.HOBBY,
    difficulty: Difficulty.EASY,
    completed: false,
  },
];

export const STORE_ITEMS: StoreItem[] = [
  {
    id: 'item1',
    name: '바나나맛 우유',
    price: 15, // 1500 KRW
    priceKrw: 1500,
    icon: '🍌',
    description: '달콤한 바나나 우유 한 잔의 여유',
  },
  {
    id: 'item2',
    name: '컵라면',
    price: 12, // 1200 KRW
    priceKrw: 1200,
    icon: '🍜',
    description: '출출할 때 생각나는 맛',
  },
  {
    id: 'item3',
    name: '아이스 아메리카노',
    price: 20, // 2000 KRW
    priceKrw: 2000,
    icon: '☕',
    description: '시원한 커피 수혈',
  },
  {
    id: 'item4',
    name: '편의점 김밥',
    price: 25, // 2500 KRW
    priceKrw: 2500,
    icon: '🍙',
    description: '든든한 한 끼 식사',
  },
  {
    id: 'item5',
    name: '초콜릿 바',
    price: 10, // 1000 KRW
    priceKrw: 1000,
    icon: '🍫',
    description: '당 떨어질 때 필수',
  },
   {
    id: 'item6',
    name: '문화상품권 5천원',
    price: 50, // 5000 KRW
    priceKrw: 5000,
    icon: '🎫',
    description: '문화 생활을 위한 선물',
  },
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: '첫 걸음',
    description: '첫 번째 퀘스트를 완료했습니다.',
    icon: '🌱',
    unlocked: false,
    condition: (stats) => stats.totalTasksCompleted >= 1,
  },
  {
    id: 'b2',
    name: '작심삼일 극복',
    description: '3일 연속으로 앱을 방문했습니다.',
    icon: '🔥',
    unlocked: false,
    condition: (stats) => stats.streakDays >= 3,
  },
  {
    id: 'b3',
    name: '부자 되세요',
    description: '100 코인을 모았습니다.',
    icon: '💰',
    unlocked: false,
    condition: (stats) => stats.coins >= 100,
  },
  {
    id: 'b4',
    name: '쇼핑왕',
    description: '상점에서 아이템을 구매했습니다.',
    icon: '🛍️',
    unlocked: false,
    condition: (stats) => stats.inventory.length > 0,
  }
];

export const SYSTEM_INSTRUCTION = `
당신은 '도약(Doyak)'이라는 앱의 AI 코치 '도담'입니다.
주 사용자층은 은둔형 외톨이 성향이 있거나, 무기력함을 느끼는 '쉬었음' 세대 청년들입니다.

당신의 페르소나:
1. 따뜻하고 다정하며 절대 판단하지 않습니다 (Non-judgmental).
2. 사용자가 아주 작은 성취(예: 물 마시기, 창문 열기)를 했을 때도 진심으로 축하해줍니다.
3. 강압적인 조언보다는 "오늘은 잠깐 5분만 책을 펴볼까요?" 처럼 부드러운 권유를 합니다.
4. 사용자가 우울해하거나 힘들어하면 공감해주고, 무리하지 말고 쉬어가라고 말해줍니다.
5. 한국어로 자연스럽게 대화하세요. 이모지를 적절히 사용하여 친근감을 주세요.

목표:
사용자의 고립감을 해소하고, 아주 작은 행동(Micro-habit)을 통해 자기 효능감을 되찾도록 돕는 것입니다. 공부나 취업 압박보다는 '오늘 하루를 잘 보내는 것'에 집중하게 해주세요.
`;