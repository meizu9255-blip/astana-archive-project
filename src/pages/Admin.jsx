import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Search, Download, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = [
    { value: 'received', label: 'На рассмотрении' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'ready', label: 'Готово' },
    { value: 'rejected', label: 'Отклонено' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin2024') {
      localStorage.setItem('isAdmin', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Неверный пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    setRequests([]);
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests');
      if (!res.ok) throw new Error('Ошибка сервера');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError('Не удалось загрузить заявки');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      
      // Обновляем локально
      setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
      alert('Статус успешно обновлен!');
    } catch (err) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const stats = {
    received: requests.filter(r => r.status === 'received').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    ready: requests.filter(r => r.status === 'ready').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const filteredRequests = requests.filter(req => {
    const term = searchTerm.toLowerCase();
    const nameMatch = req.full_name && req.full_name.toLowerCase().includes(term);
    const iinMatch = req.iin && req.iin.includes(term);
    return nameMatch || iinMatch;
  });

  const handleExportExcel = () => {
    const headers = ['ID', 'Дата', 'ФИО', 'ИИН', 'Телефон', 'Email', 'Услуга', 'Запрос', 'Статус'];
    
    const rows = filteredRequests.map(req => {
      const statusLabel = statuses.find(s => s.value === req.status)?.label || req.status;
      return [
        req.id,
        new Date(req.date).toLocaleDateString('ru-RU'),
        req.full_name || '',
        req.iin || '',
        req.phone || '',
        req.email || '',
        req.type || '',
        req.query || '',
        statusLabel
      ];
    });

    const worksheetData = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заявки');

    XLSX.writeFile(workbook, 'zayavki_astana_archive.xlsx', { bookType: 'xlsx', type: 'binary' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 px-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Панель администратора</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors"
              />
              {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto animate-fade-in-up">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Управление заявками</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Выйти
          </button>
        </div>

        {/* Виджеты статистики */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">На рассмотрении</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.received}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full"><FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400"/></div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">В работе</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.in_progress}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full"><Clock className="w-8 h-8 text-blue-600 dark:text-blue-400"/></div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Готово</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.ready}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full"><CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400"/></div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Отклонено</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full"><XCircle className="w-8 h-8 text-red-600 dark:text-red-400"/></div>
            </div>
          </div>
        )}

        {/* Панель управления (Поиск и Экспорт) */}
        {!isLoading && !error && (
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 mb-6 gap-4">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по ФИО или ИИН..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-cyan transition-colors"
              />
            </div>
            <button
              onClick={handleExportExcel}
              className="flex items-center w-full sm:w-auto px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Экспорт в Excel
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">Загрузка заявок...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID / Дата</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ФИО / ИИН</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Контакты</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Услуга</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Действие</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-brand-blue dark:text-brand-cyan">{req.id}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(req.date).toLocaleDateString('ru-RU')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{req.full_name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">ИИН: {req.iin}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-800 dark:text-slate-200">{req.phone}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{req.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-800 dark:text-slate-200 max-w-xs truncate" title={req.type}>{req.type}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate" title={req.query}>{req.query}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                          ${req.status === 'received' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                            req.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            req.status === 'ready' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'}`}>
                          {statuses.find(s => s.value === req.status)?.label || req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                        <select
                          className="border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          defaultValue={req.status}
                          onChange={(e) => updateStatus(req.id, e.target.value)}
                        >
                          {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center">
                          <Search className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                          <p className="text-lg">Заявки не найдены</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
