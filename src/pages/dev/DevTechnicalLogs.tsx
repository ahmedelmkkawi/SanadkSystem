import React, { useState } from 'react';
import { useDevModuleStore } from '../../store/devModuleStore';
import { useDevTranslation } from './hooks/useDevTranslation';
import { Activity, Search, Calendar } from 'lucide-react';

export const DevTechnicalLogs: React.FC = () => {
  const { t } = useDevTranslation();
  const { technicalLogs } = useDevModuleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [viewType, setViewType] = useState<'table' | 'timeline'>('table');

  const filteredLogs = technicalLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter ? log.entityType === entityFilter : true;
    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 flex items-center gap-2">
            <Activity className="text-red-600 w-7 h-7" />
            {t('سجل العمليات الفنية والتدقيق (Technical Audit Logs)')}
          </h1>
          <p className="text-xs text-gray-400">{t('سجل تدقيق كامل لكل حركة برمجية وتدوير مهام داخل النظام')}</p>
        </div>

        {/* View Switcher */}
        <div className="bg-white border border-gray-100 p-1 rounded-xl flex gap-1 shadow-sm">
          <button
            onClick={() => setViewType('table')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewType === 'table' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('عرض جدول')}
          </button>
          <button
            onClick={() => setViewType('timeline')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              viewType === 'timeline' ? 'bg-red-600 text-white shadow' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t('عرض مخطط')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute start-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('البحث باسم المستخدم، العملية، أو الكيان...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none"
        >
          <option value="">{t('كل أنواع الكيانات')}</option>
          <option value="Project">{t('المشروعات (Project)')}</option>
          <option value="Team">{t('فرق العمل (Team)')}</option>
          <option value="Task">{t('المهمات (Task)')}</option>
          <option value="Sprint">{t('السبرنتات (Sprint)')}</option>
          <option value="File">{t('الملفات (File)')}</option>
          <option value="Bug">{t('البلاغات والأخطاء (Bug)')}</option>
        </select>
      </div>

      {/* Logs View Box */}
      {viewType === 'table' ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-extrabold">
                  <th className="p-4 text-start">{t('الوقت والتاريخ')}</th>
                  <th className="p-4 text-start">{t('المستخدم')}</th>
                  <th className="p-4 text-start">{t('العملية')}</th>
                  <th className="p-4 text-start">{t('نوع الكيان')}</th>
                  <th className="p-4 text-start">{t('اسم الكيان')}</th>
                  <th className="p-4 text-start">{t('القيمة القديمة')}</th>
                  <th className="p-4 text-start">{t('القيمة الجديدة')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-gray-400 whitespace-nowrap">{log.dateTime}</td>
                    <td className="p-4 font-black text-gray-900">{log.user}</td>
                    <td className="p-4 font-bold text-gray-700">{log.action}</td>
                    <td className="p-4 text-gray-500 font-semibold">{log.entityType}</td>
                    <td className="p-4 font-bold text-gray-700">{log.entityName}</td>
                    <td className="p-4 text-red-600 font-mono font-bold">{log.oldValue || '—'}</td>
                    <td className="p-4 text-green-600 font-mono font-bold">{log.newValue || '—'}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400">
                      {t('لا توجد سجلات مطابقة للبحث حالياً.')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Timeline view
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="relative border-s border-gray-100 ms-4 space-y-6">
            {filteredLogs.map(log => (
              <div key={log.id} className="relative ps-6">
                {/* Dot */}
                <div className="absolute -start-1.5 top-1.5 w-3 h-3 bg-red-600 rounded-full border-2 border-white ring-4 ring-red-50"></div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-gray-950">{log.action}</span>
                    <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {log.dateTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t('بواسطة:')} <span className="font-extrabold text-gray-800">{log.user}</span> | {t('الكيان:')} <span className="font-semibold text-gray-700">{log.entityType} ({log.entityName})</span>
                  </p>
                  {(log.oldValue || log.newValue) && (
                    <div className="p-2 bg-gray-50 rounded-lg text-[10px] font-mono flex flex-col sm:flex-row gap-2">
                      <span className="text-red-600">{t('من:')} {log.oldValue || '—'}</span>
                      <span className="text-gray-300">←</span>
                      <span className="text-green-600">{t('إلى:')} {log.newValue || '—'}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-400">{t('لا توجد سجلات لعرضها في المخطط الزمني.')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevTechnicalLogs;
