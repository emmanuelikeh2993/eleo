'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, Dumbbell, TrendingUp, Scale, Heart, Shield } from 'lucide-react';

export function NutritionView() {
  const { setActiveTab } = useStore();

  const goals = [
    {
      id: 'muscle',
      title: 'Build Muscle',
      subtitle: 'High Protein Recovery',
      icon: Dumbbell,
      badge: '6g Protein / Egg',
      statement:
        'Eggs provide complete bioavailable protein with all nine essential amino acids required for muscle synthesis and post-workout recovery.',
    },
    {
      id: 'gain',
      title: 'Gain Weight',
      subtitle: 'Nutrient-Dense Clean Fuel',
      icon: TrendingUp,
      badge: 'Natural Healthy Fats',
      statement:
        'Whole farm eggs are rich in healthy fats, choline, and clean micronutrients that supply energy density without refined sugars.',
    },
    {
      id: 'lose',
      title: 'Lose Weight',
      subtitle: 'High Satiety Staple',
      icon: Scale,
      badge: 'Zero Sugar & Satiating',
      statement:
        'Eggs scored among the highest foods on the satiety index, helping you stay full through long campus lecture hours.',
    },
    {
      id: 'maintain',
      title: 'Maintain Weight',
      subtitle: 'Everyday Balanced Nutrition',
      icon: Shield,
      badge: 'Essential Daily Micronutrients',
      statement:
        'Eggs are a versatile, whole-food staple containing Vitamin B12, selenium, and riboflavin for sustained daily vitality.',
    },
    {
      id: 'healthier',
      title: 'Eat Healthier',
      subtitle: 'Fresh Farm Breakfast',
      icon: Heart,
      badge: 'Clean Campus Cooking',
      statement:
        'Freshly harvested eggs offer a pure, unprocessed breakfast foundation that replaces instant noodles and fried cafeteria snacks.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8DF] p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="font-extrabold text-lg text-[#1C201D]">
            Student Nutrition & Goals
          </h2>
        </div>
        <p className="text-xs text-[#5A635D] leading-relaxed">
          Simple, science-grounded reasons why campus students fuel their days with fresh farm eggs.
        </p>
      </div>

      {/* Goal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const Icon = goal.icon;
          return (
            <div
              key={goal.id}
              className="bg-white border border-[#E2E8DF] rounded-xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F0EA] text-[#0F2F1D] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1C201D] leading-none">
                      {goal.title}
                    </h3>
                    <span className="text-[11px] text-[#5A635D]">{goal.subtitle}</span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold bg-[#F3F6F2] text-[#0F2F1D] px-2 py-0.5 rounded-full border border-[#D5E4D8]">
                  {goal.badge}
                </span>
              </div>

              <p className="text-xs text-[#4A534D] leading-relaxed bg-[#F9FAF8] p-3 rounded-lg border border-[#F0F4EF]">
                &ldquo;{goal.statement}&rdquo;
              </p>

              <button
                onClick={() => setActiveTab('store')}
                className="w-full h-9 bg-[#0F2F1D] hover:bg-[#1B4329] text-white font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Order Eggs for this Goal</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
