import React, { useState, useEffect } from 'react';
import { Download, Phone, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { getLeads, downloadCSV } from '../services/sheetService';
import { SubmittedLead } from '../types';

interface AdminProps {
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const [leads, setLeads] = useState<SubmittedLead[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  const filteredLeads = leads.filter(l => {
    if (filter === 'ALL') return true;
    if (filter === 'YES') return l.qualified;
    return !l.qualified;
  });

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    alert('Телефонскиот број е копиран: ' + phone);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Администрација</h1>
          </div>
          
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Превземи CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Сите ({leads.length})
          </button>
          <button 
            onClick={() => setFilter('YES')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'YES' ? 'bg-brand-red text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
          >
            Квалификувани ({leads.filter(l => l.qualified).length})
          </button>
          <button 
            onClick={() => setFilter('NO')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === 'NO' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Неквалификувани ({leads.filter(l => !l.qualified).length})
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Статус</th>
                  <th className="p-4 font-semibold text-gray-700">Датум</th>
                  <th className="p-4 font-semibold text-gray-700">Клиент</th>
                  <th className="p-4 font-semibold text-gray-700">Град</th>
                  <th className="p-4 font-semibold text-gray-700">Буџет</th>
                  <th className="p-4 font-semibold text-gray-700">Акција</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">Нема пронајдено резултати.</td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        {lead.qualified ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" /> Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            <XCircle className="w-3 h-3" /> Disqualified
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">
                        {new Date(lead.timestamp).toLocaleDateString('mk-MK')}
                        <div className="text-xs">{new Date(lead.timestamp).toLocaleTimeString('mk-MK', {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-gray-500 text-xs">{lead.rooms.join(', ')}</div>
                      </td>
                      <td className="p-4 text-gray-700">{lead.city}</td>
                      <td className="p-4 text-gray-700">{lead.budget}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => copyPhone(lead.phone)}
                          className="p-2 text-brand-red bg-red-50 rounded-lg hover:bg-red-100 transition"
                          title="Copy Phone"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;