import React, { useState, useRef } from 'react';
import { Motorcycle, ServiceRecord, CompanySettings } from '../types';

interface DataBackupProps {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  companySettings: CompanySettings;
  savedMakes: string[];
  savedModels: Record<string, string[]>;
  onRestore: (data: {
    motorcycles: Motorcycle[];
    serviceRecords: ServiceRecord[];
    companySettings: CompanySettings;
    savedMakes: string[];
    savedModels: Record<string, string[]>;
  }) => void;
}

const DataBackup: React.FC<DataBackupProps> = ({
  motorcycles,
  serviceRecords,
  companySettings,
  savedMakes,
  savedModels,
  onRestore
}) => {
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(
    localStorage.getItem('lastBackupDate')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Export data to JSON file
  const handleExport = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      companyName: companySettings.companyName || 'Motorcycle Fleet',
      data: {
        motorcycles,
        serviceRecords,
        companySettings,
        savedMakes,
        savedModels
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const now = new Date().toISOString();
    localStorage.setItem('lastBackupDate', now);
    setLastBackup(now);
    showMessage('success', '✅ Backup downloaded successfully!');
  };

  // Import data from JSON file
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Validate the data structure
        if (!parsed.data || !parsed.data.motorcycles) {
          throw new Error('Invalid backup file format');
        }

        setPendingData(parsed.data);
        setShowRestoreConfirm(true);
      } catch (error) {
        showMessage('error', '❌ Invalid backup file. Please select a valid backup.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Confirm restore
  const confirmRestore = () => {
    if (pendingData) {
      onRestore({
        motorcycles: pendingData.motorcycles || [],
        serviceRecords: pendingData.serviceRecords || [],
        companySettings: pendingData.companySettings || {},
        savedMakes: pendingData.savedMakes || [],
        savedModels: pendingData.savedModels || {}
      });
      setShowRestoreConfirm(false);
      setPendingData(null);
      showMessage('success', '✅ Data restored successfully!');
    }
  };

  // Calculate days since last backup
  const getDaysSinceBackup = () => {
    if (!lastBackup) return null;
    const days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysSinceBackup = getDaysSinceBackup();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        💾 Data Backup & Security
      </h2>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Backup Status */}
      <div className={`mb-6 p-4 rounded-xl ${
        !lastBackup 
          ? 'bg-red-100 border-2 border-red-300' 
          : daysSinceBackup !== null && daysSinceBackup > 7 
            ? 'bg-amber-100 border-2 border-amber-300'
            : 'bg-green-100 border-2 border-green-300'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">
            {!lastBackup ? '⚠️' : daysSinceBackup !== null && daysSinceBackup > 7 ? '🔔' : '✅'}
          </span>
          <div>
            <h3 className="font-bold text-lg">
              {!lastBackup 
                ? 'No Backup Found!' 
                : daysSinceBackup !== null && daysSinceBackup > 7 
                  ? 'Backup Recommended'
                  : 'Backup Up to Date'}
            </h3>
            <p className="text-sm opacity-80">
              {!lastBackup 
                ? 'Create your first backup now to protect your data'
                : `Last backup: ${new Date(lastBackup).toLocaleDateString()} (${daysSinceBackup} days ago)`}
            </p>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="mb-6 p-4 bg-gray-100 rounded-xl">
        <h3 className="font-bold text-gray-700 mb-3">📊 Your Data Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white p-3 rounded-lg">
            <span className="text-gray-500">Motorcycles</span>
            <p className="text-xl font-bold text-blue-600">{motorcycles.length}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-gray-500">Service Records</span>
            <p className="text-xl font-bold text-green-600">{serviceRecords.length}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-gray-500">Saved Makes</span>
            <p className="text-xl font-bold text-purple-600">{savedMakes.length}</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <span className="text-gray-500">Saved Models</span>
            <p className="text-xl font-bold text-orange-600">
              {Object.values(savedModels).flat().length}
            </p>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="mb-4">
        <button
          onClick={handleExport}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-3 shadow-lg"
        >
          <span className="text-2xl">📥</span>
          Download Backup File
        </button>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Downloads a .json file with all your data
        </p>
      </div>

      {/* Import Button */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
          id="import-file"
        />
        <label
          htmlFor="import-file"
          className="w-full py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold text-lg hover:from-gray-700 hover:to-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
        >
          <span className="text-2xl">📤</span>
          Restore from Backup File
        </label>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Import a previously downloaded backup file
        </p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 mb-2">💡 Backup Tips</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• <strong>Weekly backup</strong> recommended</li>
          <li>• Save backup files to <strong>Google Drive, Dropbox, or Email</strong></li>
          <li>• Keep <strong>multiple backup versions</strong> (weekly, monthly)</li>
          <li>• Test restore on a different device to verify backup works</li>
          <li>• Enable <strong>Firebase sync</strong> for automatic cloud backup</li>
        </ul>
      </div>

      {/* Cloud Sync Info */}
      <div className="mt-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl p-4">
        <h3 className="font-bold text-orange-800 mb-2">☁️ Cloud Sync (Recommended)</h3>
        <p className="text-sm text-orange-700 mb-3">
          For automatic backup and sync across devices, set up Firebase:
        </p>
        <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
          <li>Go to firebase.google.com and create a project</li>
          <li>Enable Realtime Database</li>
          <li>Add Firebase config in Settings tab</li>
          <li>Your data will sync automatically!</li>
        </ol>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ Confirm Restore</h3>
            <p className="text-gray-700 mb-4">
              This will <strong>replace all current data</strong> with the backup data:
            </p>
            <div className="bg-gray-100 rounded-lg p-3 mb-4 text-sm">
              <p>• {pendingData?.motorcycles?.length || 0} motorcycles</p>
              <p>• {pendingData?.serviceRecords?.length || 0} service records</p>
            </div>
            <p className="text-red-600 text-sm mb-4">
              ⚠️ Current data will be lost. Make a backup first if needed!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRestoreConfirm(false);
                  setPendingData(null);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold"
              >
                Restore Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataBackup;
