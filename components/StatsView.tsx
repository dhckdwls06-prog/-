import React from 'react';
import { UserStats, Badge } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Calendar, Award, Coins, Settings, Bell, Volume2, Trash2, Info, KeyRound } from 'lucide-react';

interface StatsViewProps {
  stats: UserStats;
  badges: Badge[];
  onReset: () => void;
  onResetKey: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ stats, badges, onReset, onResetKey }) => {
  // Sample data preparation for chart if history is empty
  const chartData = stats.moodHistory.length > 0 
    ? stats.moodHistory 
    : [
        { date: '월', score: 3 },
        { date: '화', score: 4 },
        { date: '수', score: 3 },
        { date: '목', score: 5 },
        { date: '금', score: 4 },
      ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> 
          내 성장 기록
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-green-600 text-sm font-medium mb-1">현재 레벨</p>
            <p className="text-3xl font-bold text-green-800">Lv. {stats.level}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-xl text-center">
            <p className="text-orange-600 text-sm font-medium mb-1">보유 코인</p>
            <p className="text-3xl font-bold text-orange-800 flex items-center justify-center gap-1">
                <Coins size={24} /> {stats.coins}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-blue-600 text-sm font-medium mb-1">누적 XP</p>
            <p className="text-3xl font-bold text-blue-800">{stats.currentXp}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl text-center">
            <p className="text-purple-600 text-sm font-medium mb-1">완료한 퀘스트</p>
            <p className="text-3xl font-bold text-purple-800">{stats.totalTasksCompleted}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-blue-500" />
          마음 온도 변화
        </h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 6]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">매일 기분을 기록해보세요</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="text-purple-500" />
          배지 보관함
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}`}
              title={badge.description}
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl shadow-sm mb-2 border border-gray-100">
                {badge.icon}
              </div>
              <p className="text-[10px] text-center font-medium text-gray-700 leading-tight">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="text-gray-500" />
            설정
          </h2>
          <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-500" />
                      <span className="text-gray-700 font-medium">알림</span>
                  </div>
                  <div className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">ON</div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-gray-500" />
                      <span className="text-gray-700 font-medium">효과음</span>
                  </div>
                   <div className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">ON</div>
              </div>

               <button 
                  onClick={onResetKey}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-700"
               >
                  <div className="flex items-center gap-3">
                      <KeyRound size={20} className="text-gray-500" />
                      <span className="font-medium">API 키 변경</span>
                  </div>
              </button>

               <button 
                  onClick={onReset} 
                  className="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-red-600"
               >
                  <div className="flex items-center gap-3">
                      <Trash2 size={20} />
                      <span className="font-medium">데이터 초기화</span>
                  </div>
              </button>

               <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3 text-gray-400">
                      <Info size={16} />
                      <span className="text-sm">버전 정보</span>
                  </div>
                  <span className="text-gray-400 text-sm">v1.0.0</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default StatsView;