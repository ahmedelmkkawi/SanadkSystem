import React, { useState } from 'react';
import { useDevModuleStore, type DevTeam } from '../../store/devModuleStore';
import { useDevTranslation } from './hooks/useDevTranslation';
import { Users } from 'lucide-react';

export const DevTeams: React.FC = () => {
  const { t } = useDevTranslation();
  const { teams, developers, projects, tasks } = useDevModuleStore();

  const [selectedTeam, setSelectedTeam] = useState<DevTeam | null>(null);

  const getTeamTypeColor = (type: string) => {
    switch (type) {
      case 'Frontend Team': return 'bg-blue-100 text-blue-800';
      case 'Backend Team': return 'bg-purple-100 text-purple-800';
      case 'Full Stack Team': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950">{t('إدارة فرق التطوير')}</h1>
        <p className="text-xs text-gray-400">{t('تابع الهياكل التنظيمية والمجموعات البرمجية والمسؤوليات التابعة لها')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900">{t('فرق العمل الحالية')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.map(team => {
              const activeProj = projects.filter(p => p.teamManagerName === team.teamManagerName && p.status !== 'Done').length;
              return (
                <div 
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`bg-white p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    selectedTeam?.id === team.id ? 'border-red-600 ring-1 ring-red-600' : 'border-gray-100 hover:border-red-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black ${getTeamTypeColor(team.type)}`}>
                      {team.type}
                    </span>
                    <Users className="w-5 h-5 text-gray-300" />
                  </div>
                  <h4 className="text-xs font-black text-gray-950 line-clamp-1">{team.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t('المدير:')} {team.teamManagerName}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-50 text-[10px]">
                    <div>
                      <span className="text-gray-400 font-bold block">{t('المشاريع النشطة')}</span>
                      <span className="text-xs font-black text-gray-900 mt-0.5 block">{activeProj}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block">{t('أعضاء الفريق')}</span>
                      <span className="text-xs font-black text-gray-900 mt-0.5 block">{team.developers.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Details Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
          {selectedTeam ? (
            <div className="space-y-6">
              <div>
                <span className="text-[9px] px-2.5 py-1 bg-red-50 text-red-600 font-extrabold rounded-lg inline-block mb-2">
                  {selectedTeam.type}
                </span>
                <h3 className="font-extrabold text-sm text-gray-955">{selectedTeam.name}</h3>
                <p className="text-[10px] text-gray-400">{t('المدير الفني المباشر:')} {selectedTeam.teamManagerName}</p>
              </div>

              {/* Members List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-950 border-s-4 border-red-600 ps-2">{t('أعضاء الفريق والتحميل')}</h4>
                <div className="space-y-2">
                  {selectedTeam.developers.map(devName => {
                    const dev = developers.find(d => d.name === devName);
                    const devTasks = tasks.filter(t => t.assigneeName === devName && t.status !== 'Done');
                    return (
                      <div key={devName} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <span className="font-extrabold text-gray-800 block">{devName}</span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{t('المهام الجارية:')} {devTasks.length} {t('مهمة')}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                          dev?.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {dev?.availability}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-3 pt-3 border-t border-gray-50">
                <h4 className="text-xs font-black text-gray-950 border-s-4 border-red-600 ps-2">{t('المشاريع التابعة للفريق')}</h4>
                <div className="space-y-2">
                  {projects.filter(p => p.teamManagerName === selectedTeam.teamManagerName).map(p => (
                    <div key={p.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-extrabold text-gray-800 block line-clamp-1">{p.name}</span>
                        <span className="text-[9px] text-gray-400 block mt-0.5">{t('العميل:')} {p.clientName}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-red-600">{p.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12 space-y-3">
              <Users className="w-10 h-10 text-gray-200" />
              <p className="text-xs font-bold">{t('اختر فريق عمل من القائمة لعرض تفاصيله التقنية وأعضاء فريقه بالكامل.')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTeams;
