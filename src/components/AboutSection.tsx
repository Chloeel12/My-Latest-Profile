/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Zap, 
  Award, 
  Camera, 
  Paintbrush, 
  TrendingUp, 
  Podcast, 
  Sparkles,
  BookOpen,
  Layers,
  Video,
  Film
} from 'lucide-react';
// @ts-ignore
import aboutPortrait from '../assets/images/20241219_080742.jpg';

interface AboutSectionProps {
  onBack: () => void;
  onGoToWorks?: () => void;
}

export function AboutSection({ onBack, onGoToWorks }: AboutSectionProps) {
  // Helper to render skill icons dynamically
  function getSkillIcon(name: string) {
    const iconClass = "w-3.5 h-3.5 stroke-[2.5] text-black";
    if (name.includes('PS') || name.includes('Photoshop')) return <Layers className={iconClass} />;
    if (name.includes('AI') || name.includes('Illustrator')) return <Paintbrush className={iconClass} />;
    if (name.toLowerCase().includes('notion')) return <BookOpen className={iconClass} />;
    if (name.includes('剪映') || name.toLowerCase().includes('capcut')) return <Video className={iconClass} />;
    if (name.includes('PR') || name.toLowerCase().includes('premiere')) return <Film className={iconClass} />;
    if (name.includes('摄影') || name.toLowerCase().includes('photography')) return <Camera className={iconClass} />;
    if (name.includes('运营') || name.toLowerCase().includes('operation')) return <TrendingUp className={iconClass} />;
    return <Sparkles className={iconClass} />;
  }

  // Skills details
  const skills = [
    { id: 'ps', image: '/images/ps图标.png', level: 92, color: 'bg-blue-500' },
    { id: 'ai', image: '/images/ai图标.png', level: 60, color: 'bg-orange-500' },
    { id: 'pr', image: '/images/pr图标.png', level: 60, color: 'bg-purple-600' },
    { id: 'au', image: '/images/au图标.png', level: 80, color: 'bg-red-500' },
    { id: 'notion', image: '/images/Notion图标.png', level: 80, color: 'bg-stone-850' },
    { id: 'capcut', image: '/images/剪映图标.png', level: 60, color: 'bg-pink-500' },
    { id: 'photography', name: '摄影', level: 93, color: 'bg-teal-500' },
    { id: 'operation', name: '运营', level: 86, color: 'bg-rose-500' }
  ];

  // Education details
  const education = [
    {
      period: '2021 — 2025',
      badge: 'DEGREE',
      institution: '南方医科大学',
      major: '法学专业 (Law)',
      description: '在严谨系统的法学逻辑训练之外，深度沉淀个人的视觉表达和美学素养。用富有张力的艺术笔触与逻辑性极强的设计线条相互交织，让每一幅影像和作品都兼具深度思辨与视觉冲击力。'
    }
  ];

  return (
    <div className="w-full min-h-full h-auto pb-24 bg-[#fcfaf2] text-[#231f20] relative font-sans px-4 sm:px-8 py-10 md:py-16 selection:bg-[#00ebd7] selection:text-black">
      
      {/* Background Pop-Flat Grid Overlay - Elegant light-brown dashes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b7355" strokeWidth="1" strokeDasharray="3 3" opacity="0.10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header navigation bar */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-mono font-black text-xs uppercase shadow-brutal-xs hover:translate-y-[-1px] active:translate-y-[1px]"
          >
            <ArrowLeft size={14} className="stroke-[3]" />
            <span>BACK TO HOME // 返回</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-10 md:mb-14">
          <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tighter uppercase mb-2">
            ABOUT ME<span className="text-[#ec4899]">.</span>
          </h1>
        </div>

        {/* Main Grid: Portrait Left, Bio Middle, Skills Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Column 1: Portrait / Personal Photo (md:col-span-4) */}
          <div className="md:col-span-4 space-y-5">
            <div className="border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(35,31,32,1)] relative">
              <span className="absolute -top-3 left-4 px-2 py-0.5 font-mono text-[9px] font-black bg-[#eab308] text-black border-2 border-black shadow-brutal-xs">
                01 // PORTRAIT
              </span>
              
              <div className="relative w-full aspect-[4/5] border-4 border-black bg-stone-100 rounded-2xl overflow-hidden group shadow-brutal-xs mt-2">
                <img 
                  src={aboutPortrait} 
                  alt="IMAGINE Creator Portrait" 
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-500 rounded-none" 
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-4 border-t-2 border-dashed border-gray-300 pt-3 flex flex-col w-full">
                <div className="flex items-baseline gap-2 py-2 border-b border-dashed border-gray-200">
                  <span className="font-mono text-[11px] font-bold text-gray-400">姓名 NAME:</span>
                  <span className="font-heading font-black text-sm text-black uppercase tracking-tight">李瑜 Chloe</span>
                </div>
                <div className="flex items-baseline gap-2 py-2 border-b border-dashed border-gray-200">
                  <span className="font-heading font-black text-sm text-black tracking-tight">邮箱:</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-gray-400 select-all">gxgpliyu@gmail.com</span>
                </div>
                <div className="flex items-baseline gap-2 py-2 border-b border-dashed border-gray-200">
                  <span className="font-mono text-[11px] font-bold text-gray-400">状态 STATUS:</span>
                  <span className="font-heading font-black text-sm text-black uppercase tracking-tight">GRADUATED</span>
                </div>
                <div className="flex items-baseline gap-2 py-2">
                  <span className="font-heading font-black text-sm text-black tracking-tight">手机 PHONE:</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-gray-400 select-all">19520990112</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Intros & Philosophy (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Bio Card */}
            <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(35,31,32,1)] relative">
              <span className="absolute -top-3 left-4 px-2 py-0.5 font-mono text-[9px] font-black bg-[#ec4899] text-white border-2 border-black shadow-brutal-xs">
                02 // BRIEF BIOGRAPHY // 简介
              </span>
              <h2 className="font-display font-black text-lg uppercase tracking-tight text-black border-b-2 border-black pb-2 mb-4 mt-1">
                个人简介 // BIO
              </h2>
              <div className="space-y-3 text-xs text-gray-800 leading-relaxed font-semibold whitespace-pre-line">
                <p>哈喽！我是Chloe。</p>
                <p>不习惯做自我介绍，还是用作品说话吧。</p>
                <p>还在创造中……多多期待</p>
              </div>
            </div>

            {/* Core Passion Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border-2 border-black bg-[#fdf0f4] p-3 shadow-brutal-xs">
                <div className="w-7 h-7 border-2 border-black bg-white rounded-none flex items-center justify-center text-[#ec4899] mb-2 shadow-brutal-xs">
                  <Camera size={14} className="stroke-[2.5]" />
                </div>
                <h3 className="font-heading font-black text-xs uppercase leading-none mb-1 text-black">IMAGE / 影像</h3>
                <p className="text-[9px] font-mono font-bold text-gray-500 leading-tight">捕捉城市边缘黄昏或蔚蓝水浪中强烈的动态高光。</p>
              </div>
              <div className="border-2 border-black bg-[#ebfbf9] p-3 shadow-brutal-xs">
                <div className="w-7 h-7 border-2 border-black bg-white rounded-none flex items-center justify-center text-[#00ebd7] mb-2 shadow-brutal-xs">
                  <Paintbrush size={14} className="stroke-[2.5]" />
                </div>
                <h3 className="font-heading font-black text-xs uppercase leading-none mb-1 text-black">LAYOUT / 几何</h3>
                <p className="text-[9px] font-mono font-bold text-gray-500 leading-tight">使用硬朗对齐的粗黑边框勾勒结构对立的设计美感。</p>
              </div>
            </div>

          </div>

          {/* Column 3: Skills Panel (md:col-span-4) */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Skills Progress Panel */}
            <div className="border-4 border-black bg-white p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(35,31,32,1)] relative">
              <span className="absolute -top-3 left-4 px-2 py-0.5 font-mono text-[9px] font-black bg-[#00ebd7] text-black border-2 border-black shadow-brutal-xs">
                03 // SKILLS
              </span>
              <h2 className="font-display font-black text-lg uppercase tracking-tight text-black border-b-2 border-black pb-2 mb-4 mt-1">
                个人技能 / CORE SKILLS
              </h2>
              
              <div className="space-y-3">
                {skills.map((skill, index) => {
                  const filledCount = Math.min(5, Math.max(1, Math.round(skill.level / 20)));
                  return (
                    <div key={index} className="flex items-center justify-between pb-2 border-b border-dashed border-gray-200 last:border-b-0 last:pb-0">
                      {/* Left: icon/image */}
                      {skill.image ? (
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(35,31,32,1)] overflow-hidden">
                            <img 
                              src={skill.image} 
                              alt={skill.id} 
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <div className="w-6.5 h-6.5 border-2 border-black bg-white flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(35,31,32,1)] text-black">
                            {getSkillIcon(skill.name || '')}
                          </div>
                          <span className="font-heading font-black text-[10px] sm:text-xs text-black tracking-tight uppercase leading-none">{skill.name}</span>
                        </div>
                      )}

                      {/* Right: 5 brutalist squares */}
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const isActive = i < filledCount;
                          return (
                            <motion.div 
                              key={i}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.04 + i * 0.04 }}
                              className={`w-3.5 h-3.5 sm:w-4 min-w-[14px] sm:min-w-[16px] sm:h-4 border-2 border-black transition-all ${
                                isActive ? `${skill.color} shadow-[1px_1px_0px_rgba(35,31,32,1)]` : 'bg-stone-100'
                              }`} 
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Education Timeline */}
        <div className="border-4 border-black bg-[#fef9df] p-5 sm:p-8 shadow-[6px_6px_0px_0px_rgba(35,31,32,1)] relative mb-12">
          <span className="absolute -top-3 left-4 px-2 py-0.5 font-mono text-[9px] font-black bg-[#eab308] text-black border-2 border-black shadow-brutal-xs">
            03 // EDUCATIONAL BACKGROUND
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black border-b-2 border-black pb-2 mb-6 mt-1">
            教育背景 / EXPERIENCE
          </h2>

          <div className="space-y-8 relative before:absolute before:left-[11px] sm:before:left-[14px] before:top-4 before:bottom-4 before:w-[2px] before:bg-black/25">
            {education.map((edu, index) => (
              <div key={index} className="relative pl-8 sm:pl-10">
                
                {/* Timeline node marker diamond */}
                <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-black rotate-45 flex items-center justify-center z-10 shadow-brutal-xs">
                  <div className="w-2.5 h-2.5 bg-black" />
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      {edu.period}
                    </span>
                    <span className="font-mono text-[9px] font-bold bg-white text-black px-1.5 py-0.5 border-2 border-black shadow-brutal-xs">
                      {edu.badge}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-black text-base sm:text-lg text-black uppercase leading-tight">
                    {edu.institution}
                  </h3>
                  
                  <div className="text-xs font-mono font-bold text-gray-500">
                    {edu.major}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-normal font-semibold">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work & Operations Experience Section (Added) */}
        <div className="border-4 border-black bg-[#ebfbf9] p-5 sm:p-8 shadow-[6px_6px_0px_0px_rgba(35,31,32,1)] relative mb-12">
          <span className="absolute -top-3 left-4 px-2 py-0.5 font-mono text-[9px] font-black bg-[#00ebd7] text-black border-2 border-black shadow-brutal-xs">
            04 // OPERATIONS & WORK EXPERIENCE
          </span>
          <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black border-b-2 border-black pb-2 mb-6 mt-1">
            运营经历 / OPERATIONS EXPERIENCE
          </h2>

          <div className="space-y-8 relative before:absolute before:left-[11px] sm:before:left-[14px] before:top-4 before:bottom-4 before:w-[2px] before:bg-black/25">
            {/* Experience Item 1 */}
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-black rotate-45 flex items-center justify-center z-10 shadow-brutal-xs">
                <div className="w-2.5 h-2.5 bg-black" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      2026.01 – 至今
                    </span>
                    <span className="font-mono text-[9px] font-bold bg-white text-black px-1.5 py-0.5 border-2 border-black shadow-brutal-xs">
                      播客全流程
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">2026.01 - PRESENT</span>
                </div>
                
                <h3 className="font-display font-black text-base sm:text-lg text-black uppercase leading-tight">
                  个人播客 (Independent Podcast Creator)
                </h3>

                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold space-y-1.5">
                  <p>
                    <span className="text-black font-extrabold mr-1">● 播客全流程搭建：</span>
                    负责泛文化类播客节目从0到1搭建，独立负责品牌形象设计、选题策划、嘉宾邀约及洽谈、后期制作；根据播客赛道及调性设计品牌形象、策划发展模式。
                  </p>
                  <p>
                    <span className="text-black font-extrabold mr-1">● 内容推广：</span>
                    整理各期节目后台数据，结合当下热点话题及运营模式优化并调整后续选题方向，提升节目曝光。
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Item 2 */}
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-black rotate-45 flex items-center justify-center z-10 shadow-brutal-xs">
                <div className="w-2.5 h-2.5 bg-black" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      2025.05 – 至今
                    </span>
                    <span className="font-mono text-[9px] font-bold bg-white text-black px-1.5 py-0.5 border-2 border-black shadow-brutal-xs">
                      体育摄影 & IP
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">2025.05 - PRESENT</span>
                </div>
                
                <h3 className="font-display font-black text-base sm:text-lg text-black uppercase leading-tight">
                  体育赛道账号运营
                </h3>

                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold space-y-2">
                  <p>
                    <span className="text-black font-extrabold mr-1">● 账号运维 & 机位规划：</span>
                    从0到1搭建游泳领域摄影账号，搭建从赛事选题、现场机位规划、后期处理的标准化工作流；利用“视觉+文案”策略，结合热点赛事，在垂直运动社群及话题下发布相关图文、视频笔记。
                  </p>
                  <p className="bg-[#f0f9f8] border-l-4 border-[#00ebd7] pl-3 py-1 text-xs text-gray-800">
                    <span className="font-black text-[#0f766e]">★ 运营成果：</span>
                    休闲类及摄影类体育赛事笔记产出30余篇优质曝光笔记，累计获20万+曝光；通过联动热门赛事话题进行个人账号宣传及物料宣发，提升账号优质曝光。
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Item 3 */}
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-black rotate-45 flex items-center justify-center z-10 shadow-brutal-xs">
                <div className="w-2.5 h-2.5 bg-black" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      2024.01
                    </span>
                    <span className="font-mono text-[9px] font-bold bg-white text-black px-1.5 py-0.5 border-2 border-black shadow-brutal-xs">
                      新媒体运营
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">2024.01</span>
                </div>
                
                <h3 className="font-display font-black text-base sm:text-lg text-black uppercase leading-tight">
                  GOA 2023 第五届广州户外艺术节
                </h3>

                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold space-y-2">
                  <p>
                    <span className="text-black font-extrabold mr-1">● 互动内容策划：</span>
                    策划预热期互动话题与倒计时系列内容，通过公众号、小红书等平台发布节目单与演出路线指引，降低用户参与门槛；在现场设立互动点，通过引导用户打卡、发布活动相关话题标签，促进艺术节在社交平台的二次扩散。
                  </p>
                  <p className="bg-[#f0f9f8] border-l-4 border-[#00ebd7] pl-3 py-1 text-xs text-gray-800">
                    <span className="font-black text-[#0f766e]">★ 运营成果：</span>
                    成功通过线上攻略内容驱动线下人流，期间负责的账号曝光超10万+，活动现场话题在社交平台产生超2000次互动反馈。
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Item 4 */}
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-black rotate-45 flex items-center justify-center z-10 shadow-brutal-xs">
                <div className="w-2.5 h-2.5 bg-black" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 border border-black">
                      2021.10 - 2025.06
                    </span>
                    <span className="font-mono text-[9px] font-bold bg-white text-black px-1.5 py-0.5 border-2 border-black shadow-brutal-xs">
                      运营组长
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">2021.10 - 2025.06</span>
                </div>
                
                <h3 className="font-display font-black text-base sm:text-lg text-black uppercase leading-tight">
                  青年传媒中心 — 新媒体运营组组长
                </h3>

                <div className="text-xs sm:text-sm text-gray-700 leading-relaxed font-semibold space-y-2">
                  <p>
                    <span className="text-black font-extrabold mr-1">● 策略执行 & 数据分析：</span>
                    建立标准化运营流程，对标同类高校账号拆解运营策略，收集和分析校园流行趋势及热点，建立竞品及选题库。运用SQL对后台用户画像及互动数据进行多维度分析，动态调整选题方向与宣发策略。
                  </p>
                  <p className="bg-[#f0f9f8] border-l-4 border-[#00ebd7] pl-3 py-1 text-xs text-gray-800">
                    <span className="font-black text-[#0f766e]">★ 运营成果：</span>
                    借助选题库，月均产出公众号文章4篇（每月独立策划1篇，共同产出3篇），均篇阅读量及互动量超5000+，将公众号及微博订阅数量稳步提升至20万+。统筹策划校级校园活动三次，统筹活动策划、海报设计、推文宣传等全流程宣发策略，收获线上线下累计约1万人参与活动。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row to trigger Works directly */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t-4 border-black pt-6">
          <div className="font-mono text-xs text-gray-500 text-center sm:text-left">
            <span>© 2026 IMAGINE STUDIO // ALL COORDINATES SYNCHRONIZED</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="flex-1 sm:flex-initial px-5 py-3 border-2 border-black bg-white hover:bg-stone-50 text-black font-mono font-black text-xs uppercase cursor-pointer"
            >
              BACK TO HOME / 返回首页
            </button>
            {onGoToWorks && (
              <button
                onClick={onGoToWorks}
                className="flex-1 sm:flex-initial px-6 py-3 border-2 border-black bg-black text-[#00ebd7] font-mono font-black text-xs uppercase cursor-pointer hover:bg-stone-900 active:translate-y-[1px] shadow-brutal-xs"
              >
                BROWSE WORKS / 点击浏览作品 🎨
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AboutSection;
