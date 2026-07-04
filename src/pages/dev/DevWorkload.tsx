import React from 'react';
import { useDevModuleStore } from '../../store/devModuleStore';
import { useDevTranslation } from './hooks/useDevTranslation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle } from 'lucide-react';

export const DevWorkload: React.FC = () => {
  const { t } = useDevTranslation();
  const { developers, tasks, updateDeveloperAvailability, currentRole } = useDevModuleStore();

  const data = developers.map(dev => {
    const activeTasks = tasks.filter(t => t.assigneeName === dev.name && t.status !== 'Done');
    const totalEst = activeTasks.reduce((acc, curr) => acc + curr.estimatedHours, 0);
    const totalAct = activeTasks.reduce((acc, curr) => acc + curr.actualHours, 0);
    
    // Max capacity: 160 hours monthly
    const utilization = dev.availability === 'On Leave' ? 0 : Math.round((totalEst / 160) * 100);

    return {
      id: dev.id,
      name: dev.name,
      role: dev.role,
      activeTasksCount: activeTasks.length,
      estimated: totalEst,
      actual: totalAct,
      utilization,
      availability: dev.availability
    };
  });

  const getAvailabilityBadge = (av: string) => {
    switch (av) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'On Leave': return 'bg-red-100 text-red-700 font-bold';
      case 'Busy': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAvailabilityChange = (devId: string, value: any) => {
    if (currentRole !== 'CEO' && currentRole !== 'Tech Lead' && currentRole !== 'Team Manager') {
      alert(t('غير مصرح لك بتغيير حالة المطورين'));
      return;
    }
    updateDeveloperAvailability(devId, value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-950">{t('إدارة حجم وضغط العمل')}</h1>
        <p className="text-xs text-gray-400">{t('تتبع استغلال طاقة المطورين وساعات العمل المتبقية لحل المشاكل بشكل متزن')}</p>
      </div>

      {/* Capacity Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-extrabold text-sm text-gray-900 mb-4">{t('مخطط الطاقة الاستيعابية والتحميل (%)')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="utilization" fill="#E11D48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Developer Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(dev => (
          <div key={dev.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:border-red-100 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xs font-extrabold text-gray-990">{dev.name}</h4>
                <p className="text-[9px] text-gray-400 mt-0.5">{dev.role}</p>
              </div>
              
              {/* Availability Badge */}
              <select
                value={dev.availability}
                onChange={(e) => handleAvailabilityChange(dev.id, e.target.value as any)}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border-0 focus:ring-0 ${getAvailabilityBadge(dev.availability)}`}
              >
                <option value="Available">Available (متاح)</option>
                <option value="Busy">Busy (مشغول)</option>
                <option value="On Leave">On Leave (في إجازة)</option>
              </select>
            </div>

            {/* Overload Alert */}
            {dev.utilization > 90 && (
              <div className="p-2.5 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-start gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[9px] font-bold leading-normal">
                  {t('تحذير: لقد تجاوز المطور 90% من طاقته الاستيعابية المقررة شهرياً.')}
                </span>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2 text-center border-t border-b border-gray-50 py-3">
              <div>
                <span className="text-[9px] text-gray-400 block font-semibold">{t('المهمات النشطة')}</span>
                <span className="text-xs font-black text-gray-900 mt-0.5 block">{dev.activeTasksCount}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block font-semibold">{t('ساعات مقدرة')}</span>
                <span className="text-xs font-black text-gray-900 mt-0.5 block">{dev.estimated}{t('س')}</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 block font-semibold">{t('ساعات فعلية')}</span>
                <span className="text-xs font-black text-gray-900 mt-0.5 block">{dev.actual}{t('س')}</span>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-500">{t('نسبة التحميل الكلي')}</span>
                <span className={dev.utilization > 90 ? 'text-red-600' : 'text-gray-900'}>{dev.utilization}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all ${dev.utilization > 90 ? 'bg-red-600' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(100, dev.utilization)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevWorkload;
