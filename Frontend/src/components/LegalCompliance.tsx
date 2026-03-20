
import React, { useState } from 'react';
import { Shield, Download, FileText, Eye, AlertCircle } from 'lucide-react';

interface ComplianceSettings {
  dataExport: boolean;
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
  location: boolean;
  notifications: boolean;
}

interface ExportHistory {
  id: string;
  type: 'full_export' | 'data_export' | 'analytics_export';
  date: Date;
  format: string;
  purpose: string;
  status: 'completed' | 'processing' | 'failed';
}

export const LegalCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'data_export' | 'disclaimer'>('privacy');

  const [settings, setSettings] = useState<ComplianceSettings>({
    dataExport: true,
    analytics: false,
    marketing: false,
    thirdParty: false,
    location: false,
    notifications: true
  });

  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      type: 'full_export',
      date: new Date(2024, 2, 15),
      format: 'JSON',
      purpose: 'User requested complete data export',
      status: 'completed'
    },
    {
      id: '2',
      type: 'data_export',
      date: new Date(2024, 2, 10),
      format: 'CSV',
      purpose: 'Export nutrition data only',
      status: 'completed'
    }
  ]);

  const [isExporting, setIsExporting] = useState(false);

  const settingKeys: (keyof ComplianceSettings)[] = [
    'dataExport',
    'analytics',
    'marketing',
    'thirdParty',
    'location',
    'notifications'
  ];

  const score = Math.round(
    (Object.values(settings).filter(Boolean).length / settingKeys.length) * 100
  );

  const handleExport = async (
    type: 'full_export' | 'data_export' | 'analytics_export'
  ) => {
    setIsExporting(true);

    await new Promise((r) => setTimeout(r, 1500));

    const format =
      type === 'analytics_export' || type === 'full_export' ? 'JSON' : 'CSV';

    const newExport: ExportHistory = {
      id: Date.now().toString(),
      type,
      date: new Date(),
      format,
      purpose: `User requested ${type.replace('_', ' ')}`,
      status: 'completed'
    };

    setExportHistory((prev) => [newExport, ...prev]);

    const data =
      type === 'full_export'
        ? generateFullExport()
        : type === 'analytics_export'
        ? generateAnalyticsExport()
        : generateDataExport();

    const blob = new Blob([data], {
      type: format === 'JSON' ? 'application/json' : 'text/csv'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitgenius-${type}-${new Date().toISOString().split('T')[0]}.${
      format === 'JSON' ? 'json' : 'csv'
    }`;
    a.click();
    URL.revokeObjectURL(url);

    setIsExporting(false);
  };

  const generateFullExport = () =>
    JSON.stringify(
      {
        user: { id: 'user_123', email: 'user@example.com' },
        export_date: new Date().toISOString(),
        gdpr_compliant: true
      },
      null,
      2
    );

  const generateAnalyticsExport = () =>
    JSON.stringify(
      {
        analytics: { workouts: 24, calories: 15420 },
        export_date: new Date().toISOString()
      },
      null,
      2
    );

  const generateDataExport = () =>
    'date,type,value\n2024-03-15,weight,75.5';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Legal & Compliance</h2>
          <p className="text-sm text-gray-500">GDPR controls</p>
        </div>

        <div className="flex items-center space-x-2">
          <Shield className="text-green-500" />
          <div>
            <div className="font-bold text-green-600">{score}%</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'privacy', label: 'Privacy', icon: <Eye size={18} /> },
          { key: 'data_export', label: 'Export', icon: <Download size={18} /> },
          { key: 'disclaimer', label: 'Legal', icon: <FileText size={18} /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg ${
              activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRIVACY */}
      {activeTab === 'privacy' && (
        <div className="space-y-4">
          {settingKeys.map((key) => (
            <div
              key={key}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span className="capitalize">{key}</span>

              <button
                role="switch"
                aria-checked={settings[key]}
                onClick={() =>
                  setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                  settings[key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full transform transition ${
                    settings[key] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EXPORT */}
      {activeTab === 'data_export' && (
        <div className="space-y-4">
          {[
            { type: 'full_export', label: 'Export All (JSON)' },
            { type: 'data_export', label: 'Health Data (CSV)' },
            { type: 'analytics_export', label: 'Analytics (JSON)' }
          ].map((btn) => (
            <button
              key={btn.type}
              disabled={isExporting}
              onClick={() => handleExport(btn.type as any)}
              className="w-full py-3 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              {isExporting ? 'Exporting...' : btn.label}
            </button>
          ))}

          <div className="mt-6">
            <h3 className="font-semibold mb-2">History</h3>
            {exportHistory.map((e) => (
              <div key={e.id} className="border p-2 rounded mb-2 text-sm">
                {e.type} • {e.format} • {e.date.toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISCLAIMER */}
      {activeTab === 'disclaimer' && (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded">
            <h3 className="font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle /> Medical Disclaimer
            </h3>
            <p className="text-sm mt-2">
              This app is not a substitute for professional medical advice.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-blue-700">Terms</h3>
            <p className="text-sm mt-2">
              By using this app, you agree to the terms of service.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

