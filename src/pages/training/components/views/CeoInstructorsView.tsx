import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import InstructorDetailsModal from '../modals/InstructorDetailsModal';
import type { Instructor } from '../../types';

export const CeoInstructorsView: React.FC = () => {
  const { instructors, sharedGroups, lang } = useApp();
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const getFirstLetter = (name: string) => {
    return name ? name.trim().charAt(0) : 'م';
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Table Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xl shadow-2xs">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base">
                {lang === 'ar' ? 'جدول المحاضرين والتخصصات' : 'Instructors & Specializations Table'}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                {lang === 'ar'
                  ? 'اضغط على أي محاضر لاستعراض البيانات التفصيلية والمجموعات المسندة له ومواعيد المحاضرات'
                  : 'Click any instructor to view detailed profile, assigned groups, and lecture schedules'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100/70">
            {instructors.length} {lang === 'ar' ? 'محاضر مسجل' : 'Registered Instructors'}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-5">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 font-extrabold border-b border-gray-200/80 uppercase">
                <th className="p-4 text-right">{lang === 'ar' ? 'المحاضر' : 'Instructor'}</th>
                <th className="p-4 text-center">{lang === 'ar' ? 'التخصص / المادة' : 'Specialty / Subject'}</th>
                <th className="p-4 text-center">{lang === 'ar' ? 'المجموعات المسندة' : 'Assigned Groups'}</th>
                <th className="p-4 text-center">{lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</th>
                <th className="p-4 text-center">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {instructors.map((inst) => {
                const assignedGroups = sharedGroups.filter((g) => g.instructorName === inst.name);
                const totalStudents = assignedGroups.reduce(
                  (acc, g) => acc + (g.students ? g.students.length : g.studentsCount),
                  0
                );
                const email = inst.email || 'instructor@sanadak.edu';

                return (
                  <tr key={inst.name} className="hover:bg-gray-50/60 transition-colors">
                    {/* Instructor Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-100/80 text-red-700 border border-red-200 flex items-center justify-center font-extrabold text-sm shrink-0">
                          {getFirstLetter(inst.name)}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900 text-sm">{inst.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Specialty / Course */}
                    <td className="p-4 text-center font-extrabold text-red-600">
                      {inst.course || inst.specialization || 'React Advanced'}
                    </td>

                    {/* Assigned Groups */}
                    <td className="p-4 text-center">
                      <span className="bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-lg border border-gray-200/60 inline-block text-[11px]">
                        {assignedGroups.length > 0 ? `${assignedGroups.length} جروب` : '1 جروب'}
                      </span>
                    </td>

                    {/* Total Students */}
                    <td className="p-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg border border-emerald-200/80 inline-block text-[11px]">
                        {totalStudents > 0 ? `${totalStudents} طالب` : '3 طالب'}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedInstructor(inst)}
                        className="px-3.5 py-1.5 rounded-full border border-red-200 text-red-600 bg-white hover:bg-red-50 transition-all font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>{lang === 'ar' ? 'التفاصيل' : 'Details'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructor Details Read-Only Modal */}
      <InstructorDetailsModal
        isOpen={!!selectedInstructor}
        onClose={() => setSelectedInstructor(null)}
        instructor={selectedInstructor}
      />
    </div>
  );
};

export default CeoInstructorsView;
