import React from 'react';
import { StoreItem, UserStats } from '../types';
import { STORE_ITEMS } from '../constants';
import { Coins, ShoppingBag } from 'lucide-react';

interface StoreViewProps {
  stats: UserStats;
  onBuy: (item: StoreItem) => void;
}

const StoreView: React.FC<StoreViewProps> = ({ stats, onBuy }) => {
  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-400 p-6 rounded-2xl shadow-lg text-white">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <ShoppingBag className="text-white" /> 편의점
        </h2>
        <div className="flex items-end justify-between">
            <div>
                <p className="text-sm opacity-90 mb-1">보유 코인</p>
                <p className="text-4xl font-bold flex items-center gap-2">
                    <Coins className="fill-yellow-300 text-yellow-300" /> {stats.coins}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs opacity-80">환산 가치</p>
                <p className="text-xl font-medium">≈ {stats.coins * 100}원</p>
            </div>
        </div>
        <p className="mt-4 text-xs bg-white/20 p-2 rounded-lg text-center">
          1 코인은 100원의 가치를 가집니다. 열심히 모아서 간식을 바꿔보세요!
        </p>
      </div>

      {/* Item Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">판매 상품</h3>
        <div className="grid grid-cols-2 gap-4">
          {STORE_ITEMS.map((item) => {
            const canBuy = stats.coins >= item.price;
            return (
              <div 
                key={item.id} 
                className={`bg-white p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${
                    canBuy ? 'border-gray-100 shadow-sm hover:border-orange-300 hover:shadow-md' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-3 shadow-inner">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-3 h-8 flex items-center justify-center">{item.description}</p>
                
                <div className="w-full mt-auto">
                    <div className="text-orange-600 font-bold mb-2 flex justify-center items-center gap-1">
                        <Coins size={14} /> {item.price}
                        <span className="text-xs text-gray-400 font-normal">({item.priceKrw.toLocaleString()}원)</span>
                    </div>
                    <button
                        onClick={() => canBuy && onBuy(item)}
                        disabled={!canBuy}
                        className={`w-full py-2 rounded-xl text-sm font-bold transition-colors ${
                            canBuy 
                            ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {canBuy ? '구매하기' : '코인 부족'}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreView;