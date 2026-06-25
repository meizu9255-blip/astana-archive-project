import React, { useState, useEffect, useMemo, useRef } from "react";
import { exportToExcel } from "../utils/exportToExcel";
import {
  Search,
  Download,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Skeleton from "../components/Skeleton";
import { useLanguage } from "../LanguageContext";
import OfficialCertificateTemplate from "../components/OfficialCertificateTemplate";
import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

export default function Admin() {
  const { t, lang } = useLanguage();
  const a = t.admin;
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAdmin") === "true";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastError, setToastError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [adminTexts, setAdminTexts] = useState({});
  const [pdfOrderData, setPdfOrderData] = useState(null);
  const pdfTemplateRef = useRef(null);

  const statuses = [
    {
      value: "Заявка принята",
      label: lang === "ru" ? "Заявка принята" : "Өтініш қабылданды",
    },
    { value: "В обработке", label: lang === "ru" ? "В обработке" : "Өңделуде" },
    {
      value: "Готово к выдаче",
      label: lang === "ru" ? "Готово к выдаче" : "Беруге дайын",
    },
    { value: "Отклонено", label: lang === "ru" ? "Отклонено" : "Қабылданбады" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsAuthLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        localStorage.setItem("isAdmin", "true");
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setAuthError(data.error || a.errorWrongPass);
      }
    } catch (err) {
      setAuthError(a.errorConnect);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false);
    setRequests([]);
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/requests");
      if (!res.ok) throw new Error(a.errorServer);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(a.errorLoad);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setToastError("");
    try {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === orderId ? { ...req, status: newStatus } : req,
        ),
      );

      const res = await fetch(`/api/admin/requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error(a.errorUpdate);
    } catch (err) {
      setToastError(a.errorDbSave);
      setTimeout(() => setToastError(""), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFileUpload = async (orderId, file) => {
    setUpdatingId(orderId);
    setToastError("");
    try {
      const uploadRes = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: file,
        },
      );
      if (!uploadRes.ok) throw new Error("Ошибка загрузки файла");
      const blob = await uploadRes.json();

      const res = await fetch(`/api/admin/requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: "Готово к выдаче",
          document_url: blob.url,
        }),
      });
      if (!res.ok) throw new Error(a.errorUpdate);

      setRequests((prev) =>
        prev.map((req) =>
          req.id === orderId ? { ...req, document_url: blob.url } : req,
        ),
      );
    } catch (err) {
      setToastError("Не удалось загрузить PDF документ");
      setTimeout(() => setToastError(""), 5000);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleGeneratePDF = async (orderId) => {
    const text = adminTexts[orderId];
    if (!text || text.trim() === "") {
      setToastError(t.admin.enterPdfText);
      setTimeout(() => setToastError(""), 5000);
      return;
    }

    setUpdatingId(orderId);
    setToastError("");

    try {
      const targetOrder = requests.find((r) => r.id === orderId);
      setPdfOrderData({ order: targetOrder, adminText: text });

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!pdfTemplateRef.current) throw new Error("Template ref not found");

      const el = pdfTemplateRef.current;

      const imgData = await toJpeg(el, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (el.offsetHeight * pdfWidth) / el.offsetWidth;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("file", pdfBlob, `certificate_${orderId}.pdf`);

      const uploadRes = await fetch(
        `/api/upload?filename=certificate_${orderId}.pdf`,
        {
          method: "POST",
          body: pdfBlob,
        },
      );

      if (!uploadRes.ok) throw new Error(t.admin.errorUploadPdf);
      const data = await uploadRes.json();

      const updateRes = await fetch(`/api/admin/requests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          status: "Готово к выдаче",
          document_url: data.url,
        }),
      });

      if (!updateRes.ok) throw new Error("Ошибка обновления статуса");

      setRequests((prev) =>
        prev.map((req) =>
          req.id === orderId
            ? { ...req, status: "Готово к выдаче", document_url: data.url }
            : req,
        ),
      );
      setPdfOrderData(null);
    } catch (err) {
      setToastError(t.admin.errorGenPdf);
      setTimeout(() => setToastError(""), 5000);
      setPdfOrderData(null);
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(
    () => ({
      received: requests.filter((r) => r.status === "Заявка принята").length,
      in_progress: requests.filter((r) => r.status === "В обработке").length,
      ready: requests.filter((r) => r.status === "Готово к выдаче").length,
      rejected: requests.filter((r) => r.status === "Отклонено").length,
    }),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const term = searchTerm.toLowerCase();
      const nameMatch =
        req.full_name && req.full_name.toLowerCase().includes(term);
      const iinMatch = req.iin && req.iin.includes(term);
      const phoneMatch = req.phone && req.phone.includes(term);
      const emailMatch = req.email && req.email.toLowerCase().includes(term);
      return nameMatch || iinMatch || phoneMatch || emailMatch;
    });
  }, [requests, searchTerm]);

  const handleExportExcel = async () => {
    const dataToExport = filteredRequests.map((req) => {
      const statusLabel =
        statuses.find((s) => s.value === req.status)?.label || req.status;
      return {
        ...req,
        status: statusLabel,
      };
    });

    await exportToExcel(dataToExport, "Заявки_Астана_Архив.xlsx");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 px-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
            {a.loginTitle}
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={a.passwordPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {authError && (
                <p className="text-red-500 text-sm mt-2">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isAuthLoading}
              aria-label="Login"
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isAuthLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                a.btnLogin
              )}
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
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {a.title}
          </h1>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            {a.btnLogout}
          </button>
        </div>

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {a.statReceived}
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.received}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                <FileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {a.statInProgress}
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.in_progress}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {a.statReady}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.ready}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  {a.statRejected}
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {stats.rejected}
                </p>
              </div>
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        )}

        {toastError && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-lg shadow-sm animate-fade-in-up flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="font-semibold">{toastError}</span>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 mb-6 gap-4">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder={a.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading || updatingId !== null}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg leading-5 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-cyan transition-colors disabled:opacity-60"
              />
            </div>
            <button
              onClick={handleExportExcel}
              aria-label="Export to Excel"
              className="flex items-center w-full sm:w-auto px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
            >
              <Download className="w-4 h-4 mr-2" aria-hidden="true" />
              {a.btnExport}
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-24" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {a.colIdDate}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {a.colFioIin}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {a.colContacts}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {a.colService}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {a.colStatus}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {a.colAction}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-brand-blue dark:text-brand-cyan">
                          {req.id}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(req.date).toLocaleDateString("ru-RU")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                          title={req.full_name}
                        >
                          {req.full_name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {lang === "ru" ? "ИИН" : "ЖСН"}: {req.iin}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm text-slate-800 dark:text-slate-200 max-w-[150px] truncate"
                          title={req.phone}
                        >
                          {req.phone}
                        </div>
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 max-w-[150px] truncate"
                          title={req.email}
                        >
                          {req.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="text-sm text-slate-800 dark:text-slate-200 max-w-xs truncate"
                          title={req.type}
                        >
                          {req.type}
                        </div>
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate"
                          title={req.query}
                        >
                          {req.query}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                          ${
                            req.status === "Заявка принята"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : req.status === "В обработке"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : req.status === "Готово к выдаче"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {statuses.find((s) => s.value === req.status)
                            ?.label || req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-col space-y-2">
                        <select
                          className="border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-sm bg-slate-50 dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                          value={req.status}
                          disabled={isLoading || updatingId === req.id}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value)
                          }
                        >
                          {statuses.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        {req.status === "Готово к выдаче" && (
                          <div className="flex flex-col space-y-2 w-full mt-2">
                            {req.document_url ? (
                              <a
                                href={req.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-blue hover:underline text-xs flex items-center font-bold"
                              >
                                <FileText className="w-4 h-4 mr-1" />{" "}
                                {t.admin.pdfGenerated}
                              </a>
                            ) : (
                              <div className="flex flex-col space-y-2 w-full">
                                <textarea
                                  placeholder={t.admin.pdfTextPlaceholder}
                                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 min-h-[60px] focus:ring-2 focus:ring-brand-blue outline-none resize-y"
                                  value={adminTexts[req.id] || ""}
                                  onChange={(e) =>
                                    setAdminTexts({
                                      ...adminTexts,
                                      [req.id]: e.target.value,
                                    })
                                  }
                                  disabled={updatingId === req.id}
                                />
                                <button
                                  onClick={() => handleGeneratePDF(req.id)}
                                  disabled={updatingId === req.id}
                                  className="w-full cursor-pointer text-xs bg-brand-gold text-brand-dark px-3 py-1.5 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                  <Download className="w-3.5 h-3.5 mr-1" />
                                  {updatingId === req.id
                                    ? "..."
                                    : t.admin.btnGenPdf}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                      >
                        <div className="flex flex-col items-center">
                          <Search className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
                          <p className="text-lg">{a.notFound}</p>
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

      <div className="absolute top-[-9999px] left-[-9999px] opacity-0 pointer-events-none z-[-1]">
        {pdfOrderData && (
          <OfficialCertificateTemplate
            ref={pdfTemplateRef}
            order={pdfOrderData.order}
            adminText={pdfOrderData.adminText}
          />
        )}
      </div>
    </div>
  );
}
