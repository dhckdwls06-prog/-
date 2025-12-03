import React from 'react';
import { Task, Difficulty, TaskCategory } from '../types';
import { CheckCircle2, Circle, Star, Coins } from 'lucide-react';

interface QuestCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ task, onToggle }) => {
  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY: return 'text-green-600 bg-green-100';
      case Difficulty.MEDIUM: return 'text-yellow-600 bg-yellow-100';
      case Difficulty.HARD: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (cat: TaskCategory) => {
    switch (cat) {
      case TaskCategory.LIFESTYLE: return '🏠';
      case TaskCategory.EXERCISE: return '💪';
      case TaskCategory.STUDY: return '📝';
      case TaskCategory.HOBBY: return '🎨';
      default: return '📌';
    }
  };

  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md 
        ${task.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-green-100 hover:border-green-300'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <button 
          onClick={() => onToggle(task.id)}
          className={`mt-1 flex-shrink-0 transition-colors ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-400'}`}
        >
          {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
              {getCategoryIcon(task.category)} {task.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(task.difficulty)}`}>
              {task.difficulty === Difficulty.EASY ? '쉬움' : task.difficulty === Difficulty.MEDIUM ? '보통' : '도전'}
            </span>
          </div>
          <h3 className={`font-bold text-lg ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center text-yellow-500 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-lg">
            <Star size={12} className="mr-1 fill-yellow-500" />
            +{task.xp} XP
          </div>
          <div className="flex items-center text-orange-500 font-bold text-xs bg-orange-50 px-2 py-1 rounded-lg">
            <Coins size={12} className="mr-1 fill-orange-500" />
            +{task.coins} 코인
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;