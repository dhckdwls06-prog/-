import React, { useState, useEffect } from 'react';
import { ViewState, Task, UserStats, Message, Badge, TaskCategory, StoreItem } from './types';
import { INITIAL_TASKS, BADGES } from './constants';
import QuestCard from './components/QuestCard';
import ChatInterface from './components/ChatInterface';
import StatsView from './components/StatsView';
import StoreView from './components/StoreView';
import { LayoutDashboard, ListTodo, MessageCircleHeart, UserCircle2, Plus, Store, Coins, Loader2, KeyRound, Save, User } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [manualKeyInput, setManualKeyInput] = useState('');
  const [isCheckingKey, setIsCheckingKey] = useState(true);

  const [view, setView] = useState<ViewState>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    currentXp: 0,
    nextLevelXp: 100,
    coins: 0,
    streakDays: 1,
    totalTasksCompleted: 0,
    moodHistory: [],
    inventory: [],
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '안녕하세요! 당신의 성장을 돕는 도담입니다. 오늘 하루, 아주 작은 일부터 시작해볼까요?',
      timestamp: Date.now(),
    }
  ]);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [showMoodModal, setShowMoodModal] = useState(false);

  // --- Effects ---
  
  // Check for API Key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        // 1. Try to get key from AI Studio environment (development)
        if (window.aistudio) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (hasKey) {
            // In AI Studio preview, process.env.API_KEY is injected safely.
            // We use a safe access pattern to avoid crashing in browsers where 'process' is undefined.
            const envKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : null;
            if (envKey) {
                setApiKey(envKey);
                setIsCheckingKey(false);
                return;
            }
          }
        }
        
        // 2. Try to get key from LocalStorage (deployment/fallback)
        const savedKey = localStorage.getItem('doyak_api_key');
        if (savedKey) {
          setApiKey(savedKey);
        }
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        // Safety timeout in case everything fails, stop loading after 2s
        setTimeout(() => setIsCheckingKey(false), 2000);
      }
    };
    checkApiKey();
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('doyak_stats');
    const savedTasks = localStorage.getItem('doyak_tasks');
    const savedMessages = localStorage.getItem('doyak_messages');
    
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('doyak_stats', JSON.stringify(stats));
  }, [stats]);
  useEffect(() => {
    localStorage.setItem('doyak_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('doyak_messages', JSON.stringify(messages));
  }, [messages]);

  // Check for badges
  useEffect(() => {
    const newBadges = badges.map(badge => {
      if (!badge.unlocked && badge.condition(stats)) {
        return { ...badge, unlocked: true };
      }
      return badge;
    });
    
    if (JSON.stringify(newBadges) !== JSON.stringify(badges)) {
      setBadges(newBadges);
    }
  }, [stats, badges]);

  // --- Handlers ---

  const handleAiStudioKeySelect = async () => {
    if (!window.aistudio) return;
    try {
      await window.aistudio.openSelectKey();
      // After selection, we reload to ensure the env is injected or check again
      const envKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : null;
      if (envKey) {
        setApiKey(envKey);
      } else {
        // Fallback: Force reload or ask user to wait
        alert("키가 선택되었습니다. 앱을 다시 로드합니다.");
        window.location.reload();
      }
    } catch (e) {
      console.error("Error selecting API key:", e);
      if (e instanceof Error && e.message.includes("Requested entity was not found")) {
         alert("API 키를 찾을 수 없습니다. 다시 선택해주세요.");
      }
    }
  };

  const handleManualKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualKeyInput.trim().length > 10) {
      localStorage.setItem('doyak_api_key', manualKeyInput.trim());
      setApiKey(manualKeyInput.trim());
    } else {
      alert("유효한 API 키를 입력해주세요.");
    }
  };

  const handleTaskToggle = (id: string) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return prevTasks;

      const task = prevTasks[taskIndex];
      const isCompleting = !task.completed;
      
      const newTasks = [...prevTasks];
      newTasks[taskIndex] = { ...task, completed: isCompleting };

      // Update Stats
      if (isCompleting) {
        setStats(prev => {
          let newXp = prev.currentXp + task.xp;
          let newCoins = prev.coins + task.coins;
          let newLevel = prev.level;
          let newNextXp = prev.nextLevelXp;

          // Level Up Logic
          if (newXp >= prev.nextLevelXp) {
            newXp -= prev.nextLevelXp;
            newLevel += 1;
            newNextXp = Math.floor(prev.nextLevelXp * 1.5);
            // Add a congratulatory message
            setMessages(prevMsgs => [...prevMsgs, {
              id: Date.now().toString(),
              role: 'model',
              text: `축하합니다! 레벨 ${newLevel}로 성장하셨네요! 당신의 꾸준함이 빛을 발하고 있어요. 🌟`,
              timestamp: Date.now()
            }]);
          }

          return {
            ...prev,
            currentXp: newXp,
            coins: newCoins,
            level: newLevel,
            nextLevelXp: newNextXp,
            totalTasksCompleted: prev.totalTasksCompleted + 1,
          };
        });
      } else {
        // Reverting task (deduct rewards)
        setStats(prev => ({
          ...prev,
          coins: Math.max(0, prev.coins - task.coins),
          totalTasksCompleted: Math.max(0, prev.totalTasksCompleted - 1)
        }));
      }

      return newTasks;
    });
  };

  const handleMoodSubmit = (score: number) => {
    const today = new Date().toLocaleDateString('ko-KR', { weekday: 'short' });
    setStats(prev => ({
      ...prev,
      moodHistory: [...prev.moodHistory.slice(-6), { date: today, score }]
    }));
    setShowMoodModal(false);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text: `오늘의 기분을 기록해주셔서 고마워요. 기분이 ${score >= 3 ? '좋으시다니 다행이에요!' : '조금 힘드신가요? 쉬어가도 괜찮아요.'}`,
      timestamp: Date.now()
    }]);
  };

  const handleBuyItem = (item: StoreItem) => {
    if (stats.coins >= item.price) {
        setStats(prev => ({
            ...prev,
            coins: prev.coins - item.price,
            inventory: [...prev.inventory, item.id]
        }));
        alert(`${item.name} 구매 완료! 맛있게 드세요 😋`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('doyak_stats');
      localStorage.removeItem('doyak_tasks');
      localStorage.removeItem('doyak_messages');
      localStorage.removeItem('doyak_api_key'); // Also reset key
      window.location.reload();
    }
  };

  // --- Render Helpers ---

  const renderContent = () => {
    const scrollContainerClass = "h-full overflow-y-auto p-6";

    switch (view) {
      case 'dashboard':
        const exerciseTasks = tasks.filter(t => t.category === TaskCategory.EXERCISE);
        const studyTasks = tasks.filter(t => t.category === TaskCategory.STUDY);
        const hobbyTasks = tasks.filter(t => t.category === TaskCategory.HOBBY);
        const lifestyleTasks = tasks.filter(t => t.category === TaskCategory.LIFESTYLE);

        return (
          <div className={scrollContainerClass}>
            <div className="space-y-6">
              {/* Header / Hero */}
              <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">안녕하세요, 도전자님!</h1>
                  <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                    <User size={20} className="text-white" />
                  </div>
                </div>

                <p className="opacity-90 text-sm mb-4">오늘도 작은 발걸음을 떼어볼까요?</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Lv. {stats.level}</span>
                    <span>{stats.currentXp} / {stats.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-3">
                    <div 
                      className="bg-yellow-300 h-3 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                      style={{ width: `${Math.min((stats.currentXp / stats.nextLevelXp) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

               {/* Quick Actions */}
               <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => setView('store')}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-orange-200 transition-colors"
                 >
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                     <Store size={20} />
                   </div>
                   <span className="font-bold text-gray-700">편의점 가기</span>
                   <span className="text-xs text-orange-600 font-medium">보유: {stats.coins} 코인</span>
                 </button>
                 
                 <button 
                  onClick={() => setShowMoodModal(true)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:border-green-200 transition-colors"
                 >
                   <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                     <Plus size={20} />
                   </div>
                   <span className="font-bold text-gray-700">기분 기록하기</span>
                   <span className="text-xs text-gray-400">오늘 어때요?</span>
                 </button>
              </div>

              {/* Categorized Tasks */}
              <div className="space-y-6">
                  {exerciseTasks.length > 0 && (
                      <div className="space-y-3">
                          <h2 className="text-lg font-bold text-gray-800 px-1 flex items-center gap-2">
                              <span className="bg-red-100 text-red-600 p-1 rounded-lg">💪</span> 운동 퀘스트
                          </h2>
                          {exerciseTasks.slice(0, 2).map(task => (
                              <QuestCard key={task.id} task={task} onToggle={handleTaskToggle} />
                          ))}
                      </div>
                  )}
                  {studyTasks.length > 0 && (
                      <div className="space-y-3">
                          <h2 className="text-lg font-bold text-gray-800 px-1 flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-600 p-1 rounded-lg">📝</span> 공부 퀘스트
                          </h2>
                          {studyTasks.slice(0, 2).map(task => (
                              <QuestCard key={task.id} task={task} onToggle={handleTaskToggle} />
                          ))}
                      </div>
                  )}
                  {hobbyTasks.length > 0 && (
                      <div className="space-y-3">
                          <h2 className="text-lg font-bold text-gray-800 px-1 flex items-center gap-2">
                              <span className="bg-purple-100 text-purple-600 p-1 rounded-lg">🎨</span> 취미 퀘스트
                          </h2>
                          {hobbyTasks.slice(0, 2).map(task => (
                              <QuestCard key={task.id} task={task} onToggle={handleTaskToggle} />
                          ))}
                      </div>
                  )}
                   {lifestyleTasks.length > 0 && (
                      <div className="space-y-3">
                          <h2 className="text-lg font-bold text-gray-800 px-1 flex items-center gap-2">
                              <span className="bg-green-100 text-green-600 p-1 rounded-lg">🏠</span> 생활 퀘스트
                          </h2>
                          {lifestyleTasks.slice(0, 2).map(task => (
                              <QuestCard key={task.id} task={task} onToggle={handleTaskToggle} />
                          ))}
                      </div>
                  )}
                   <button onClick={() => setView('quests')} className="w-full py-3 bg-gray-100 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-200 transition-colors">
                      모든 퀘스트 보기
                  </button>
              </div>
            </div>
          </div>
        );
      
      case 'quests':
        return (
          <div className={scrollContainerClass}>
             <div className="flex justify-between items-end mb-4">
              <h1 className="text-2xl font-bold text-gray-800">모든 퀘스트</h1>
              <span className="text-sm text-gray-500">{Math.round((stats.totalTasksCompleted / (stats.totalTasksCompleted + tasks.length)) * 100) || 0}% 완료율</span>
             </div>
             <div className="space-y-4">
               {tasks.map(task => (
                 <QuestCard key={task.id} task={task} onToggle={handleTaskToggle} />
               ))}
             </div>
          </div>
        );

      case 'chat':
        return (
          <div className="h-full p-6">
            <ChatInterface messages={messages} setMessages={setMessages} userStats={stats} apiKey={apiKey!} />
          </div>
        );
      
      case 'store':
        return (
          <div className={scrollContainerClass}>
            <StoreView stats={stats} onBuy={handleBuyItem} />
          </div>
        );

      case 'stats':
        return (
          <div className={scrollContainerClass}>
            <StatsView stats={stats} badges={badges} onReset={handleResetData} />
          </div>
        );
    }
  };

  // --- Initial Loading & Key Check ---
  if (isCheckingKey) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="animate-spin text-green-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">로딩 중...</p>
      </div>
    );
  }

  // --- Landing Screen for API Key ---
  if (!apiKey) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-8">
          도
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">도약 시작하기</h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          더 나은 내일을 위한 작은 발걸음.<br/>
          AI 코치 도담이와 함께 시작해보세요.
        </p>

        <div className="w-full space-y-4">
          {/* Option 1: AI Studio Connect (Only if available) */}
          {window.aistudio && (
             <button 
              onClick={handleAiStudioKeySelect}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <KeyRound size={20} />
              Google API Key 연결하기
            </button>
          )}

          {/* Option 2: Manual Input (Always available as fallback/production) */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-left">
            <p className="text-sm font-bold text-gray-700 mb-2">API Key 직접 입력</p>
            <form onSubmit={handleManualKeySubmit} className="space-y-2">
                <input 
                    type="password" 
                    value={manualKeyInput}
                    onChange={(e) => setManualKeyInput(e.target.value)}
                    placeholder="AI Studio API Key 붙여넣기"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-green-500 transition-colors"
                />
                <button 
                    type="submit"
                    className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                >
                    <Save size={16} />
                    저장하고 시작하기
                </button>
            </form>
          </div>
          
          <div className="text-xs text-gray-400 bg-gray-100 p-4 rounded-xl text-left space-y-2">
            <p className="font-semibold text-gray-500">ℹ️ 참고사항</p>
            <p>
              원활한 AI 상담을 위해 Google Gemini API Key가 필요합니다. 
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-blue-500 underline ml-1">
                 결제 문서(Billing)
              </a>를 참고하여 유효한 키를 발급받으세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">도</div>
          <span className="font-bold text-xl text-green-900 tracking-tight">도약</span>
        </div>
        <div className="flex items-center gap-3">
             {/* Coin Display */}
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100">
             <Coins size={14} className="fill-yellow-500 text-yellow-500" /> {stats.coins}
           </div>
            {/* Streak Indicator */}
           <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
             🔥 {stats.streakDays}
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-20 pb-6 shrink-0">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'dashboard' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <LayoutDashboard size={24} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">홈</span>
        </button>
        <button 
          onClick={() => setView('quests')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'quests' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <ListTodo size={24} strokeWidth={view === 'quests' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">퀘스트</span>
        </button>
         <button 
          onClick={() => setView('store')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'store' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Store size={24} strokeWidth={view === 'store' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">상점</span>
        </button>
        <button 
          onClick={() => setView('chat')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'chat' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className={`relative ${view === 'chat' ? 'text-green-600' : 'text-gray-400'}`}>
             <MessageCircleHeart size={24} strokeWidth={view === 'chat' ? 2.5 : 2} />
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <span className="text-[10px] font-medium">도담</span>
        </button>
        <button 
          onClick={() => setView('stats')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'stats' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <UserCircle2 size={24} strokeWidth={view === 'stats' ? 2.5 : 2} />
          <span className="text-[10px] font-medium">내 정보</span>
        </button>
      </nav>

      {/* Mood Modal Overlay */}
      {showMoodModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-xl font-bold text-center mb-6 text-gray-800">지금 기분이 어때요?</h3>
            <div className="flex justify-between mb-6">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleMoodSubmit(score)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-green-100 hover:scale-110 transition-all text-2xl flex items-center justify-center"
                >
                  {score === 1 ? '😫' : score === 2 ? '😟' : score === 3 ? '😐' : score === 4 ? '🙂' : '🥰'}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowMoodModal(false)}
              className="w-full py-3 bg-gray-100 rounded-xl font-medium text-gray-600 hover:bg-gray-200"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;