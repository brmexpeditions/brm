import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Motorcycle } from '../types';

interface ExcelImportProps {
  onImport: (vehicles: Motorcycle[]) => void;
  existingMakes: string[];
  existingModels: { [make: string]: string[] };
  onAddMake: (make: string) => void;
  onAddModel: (make: string, model: string) => void;
  onClose: () => void;
}

const generateId = () => {
  return 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Normalize column names to handle variations
const normalizeColumnName = (name: string): string => {
  if (!name) return '';
  const normalized = name.toString().toLowerCase().trim()
    .replace(/[\s_-]+/g, '')
    .replace(/validtill/g, '')
    .replace(/validity/g, '')
    .replace(/number/g, '')
    .replace(/current/g, '')
    .replace(/\(km\)/g, '')
    .replace(/\(months\)/g, '')
    .replace(/interval/g, '');
  
  // Map various column names to standard keys
  if (normalized.includes('vehicletype') || normalized === 'type') return 'vehicleType';
  if (normalized === 'make' || normalized.includes('brand')) return 'make';
  if (normalized === 'model') return 'model';
  if (normalized.includes('owner')) return 'ownerName';
  if (normalized.includes('registration') && !normalized.includes('valid')) return 'registrationNumber';
  if (normalized.includes('chassis') || normalized.includes('vin')) return 'chassisNumber';
  if (normalized.includes('engine')) return 'engineNumber';
  if (normalized.includes('odometer') || normalized.includes('km') || normalized.includes('kilometer')) return 'currentOdometer';
  if (normalized.includes('usage') || normalized.includes('private') || normalized.includes('commercial')) return 'usageType';
  if (normalized.includes('insurance')) return 'insuranceValidity';
  if (normalized.includes('pollution') || normalized.includes('puc')) return 'pollutionValidity';
  if (normalized.includes('fitness')) return 'fitnessValidity';
  if (normalized.includes('roadtax') || normalized.includes('tax')) return 'roadTaxValidity';
  if (normalized.includes('permit')) return 'permitValidity';
  if ((normalized.includes('registration') && normalized.includes('valid')) || normalized.includes('rcvalid')) return 'registrationValidity';
  if (normalized.includes('servicemonth') || (normalized.includes('service') && normalized.includes('month'))) return 'serviceIntervalMonths';
  if (normalized.includes('servicekm') || (normalized.includes('service') && normalized.includes('km'))) return 'serviceIntervalKm';
  if (normalized.includes('lastservicedate') || normalized.includes('servicedate')) return 'lastServiceDate';
  if (normalized.includes('lastservicekm') || normalized.includes('servicekm')) return 'lastServiceKm';
  
  return normalized;
};

// Get value from row using flexible column matching
const getRowValue = (row: any, key: string): any => {
  // Direct match
  if (row[key] !== undefined) return row[key];
  
  // Try to find matching column
  for (const col of Object.keys(row)) {
    if (normalizeColumnName(col) === key) {
      return row[col];
    }
  }
  
  return undefined;
};

export function ExcelImport({ onImport, existingMakes, existingModels, onAddMake, onAddModel, onClose }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedVehicles, setParsedVehicles] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download Excel template
  const downloadTemplate = () => {
    const templateData = [
      {
        'Type': 'Bike',
        'Make': 'Honda',
        'Model': 'Activa 6G',
        'Owner': 'John Doe',
        'Registration': 'MH01AB1234',
        'Chassis': 'MBLHA10EY9H123456',
        'Engine': 'HA10EYH123456',
        'Odometer': 15000,
        'Usage': 'Commercial',
        'Insurance': '2025-12-31',
        'Pollution': '2025-06-30',
        'Fitness': '2025-12-31',
        'Road Tax': '2026-03-31',
        'Permit': '2026-06-30',
        'RC Valid': '2030-01-15',
        'Service Months': 5,
        'Service KM': 5000,
        'Last Service': '2024-11-01',
        'Last Service KM': 14000
      },
      {
        'Type': 'Car',
        'Make': 'Maruti Suzuki',
        'Model': 'Swift',
        'Owner': 'Jane Smith',
        'Registration': 'MH02CD5678',
        'Chassis': 'MA3FJEB1S00123456',
        'Engine': 'K12MN1234567',
        'Odometer': 45000,
        'Usage': 'Private',
        'Insurance': '2025-08-15',
        'Pollution': '2025-04-20',
        'Fitness': '',
        'Road Tax': '',
        'Permit': '',
        'RC Valid': '2035-06-10',
        'Service Months': 6,
        'Service KM': 10000,
        'Last Service': '2024-10-15',
        'Last Service KM': 43000
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    
    ws['!cols'] = [
      { wch: 8 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 14 },
      { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 14 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');
    
    const instructionsData = [
      { 'Column': 'Type', 'Description': 'Bike or Car', 'Required': 'Yes' },
      { 'Column': 'Make', 'Description': 'Brand name (Honda, Maruti, etc.)', 'Required': 'Yes' },
      { 'Column': 'Model', 'Description': 'Model name (Activa, Swift, etc.)', 'Required': 'Yes' },
      { 'Column': 'Owner', 'Description': 'Owner name', 'Required': 'No' },
      { 'Column': 'Registration', 'Description': 'Registration number (MH01AB1234)', 'Required': 'Yes' },
      { 'Column': 'Chassis', 'Description': 'Chassis/VIN number', 'Required': 'No' },
      { 'Column': 'Engine', 'Description': 'Engine number', 'Required': 'No' },
      { 'Column': 'Odometer', 'Description': 'Current odometer reading in KM', 'Required': 'No' },
      { 'Column': 'Usage', 'Description': 'Private or Commercial', 'Required': 'Yes' },
      { 'Column': 'Insurance', 'Description': 'Insurance expiry (YYYY-MM-DD)', 'Required': 'Yes' },
      { 'Column': 'Pollution', 'Description': 'PUC expiry (YYYY-MM-DD)', 'Required': 'Yes' },
      { 'Column': 'Fitness', 'Description': 'Fitness expiry (Commercial only)', 'Required': 'No' },
      { 'Column': 'Road Tax', 'Description': 'Road tax expiry (Commercial only)', 'Required': 'No' },
      { 'Column': 'Permit', 'Description': 'Permit expiry (Commercial only)', 'Required': 'No' },
      { 'Column': 'RC Valid', 'Description': 'RC expiry (Private only)', 'Required': 'No' },
      { 'Column': 'Service Months', 'Description': 'Service interval in months', 'Required': 'No' },
      { 'Column': 'Service KM', 'Description': 'Service interval in KM', 'Required': 'No' },
      { 'Column': 'Last Service', 'Description': 'Last service date (YYYY-MM-DD)', 'Required': 'No' },
      { 'Column': 'Last Service KM', 'Description': 'Odometer at last service', 'Required': 'No' },
    ];
    const wsInstructions = XLSX.utils.json_to_sheet(instructionsData);
    wsInstructions['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

    XLSX.writeFile(wb, 'fleet_import_template.xlsx');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      parseExcel(selectedFile);
    }
  };

  const excelDateToString = (excelDate: any): string => {
    if (!excelDate) return '';
    if (typeof excelDate === 'string') {
      if (excelDate.match(/^\d{4}-\d{2}-\d{2}$/)) return excelDate;
      if (excelDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const [day, month, year] = excelDate.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      if (excelDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = excelDate.split('-');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return excelDate;
    }
    if (typeof excelDate === 'number') {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    return '';
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        if (jsonData.length === 0) {
          setError('No data found in the Excel file.');
          return;
        }
        
        // Parse and validate each row
        const parsed: any[] = [];
        const errors: string[] = [];
        
        jsonData.forEach((row: any, index: number) => {
          const make = getRowValue(row, 'make') || '';
          const model = getRowValue(row, 'model') || '';
          const registration = getRowValue(row, 'registrationNumber') || '';
          
          if (!make && !model && !registration) {
            return; // Skip empty rows
          }
          
          if (!make || !model || !registration) {
            errors.push(`Row ${index + 2}: Make, Model, and Registration are required`);
            return;
          }
          
          const vehicleType = (getRowValue(row, 'vehicleType') || 'Bike').toString().trim();
          const usage = (getRowValue(row, 'usageType') || 'Commercial').toString().trim();
          
          parsed.push({
            rowNum: index + 2,
            vehicleType: vehicleType.toLowerCase().includes('car') ? 'Car' : 'Bike',
            make: make.toString().trim(),
            model: model.toString().trim(),
            ownerName: (getRowValue(row, 'ownerName') || '').toString().trim(),
            registrationNumber: registration.toString().trim().toUpperCase(),
            chassisNumber: (getRowValue(row, 'chassisNumber') || '').toString().trim(),
            engineNumber: (getRowValue(row, 'engineNumber') || '').toString().trim(),
            currentOdometer: parseInt(getRowValue(row, 'currentOdometer')) || 0,
            usageType: usage.toLowerCase().includes('private') ? 'Private' : 'Commercial',
            insuranceValidity: excelDateToString(getRowValue(row, 'insuranceValidity')),
            pollutionValidity: excelDateToString(getRowValue(row, 'pollutionValidity')),
            fitnessValidity: excelDateToString(getRowValue(row, 'fitnessValidity')),
            roadTaxValidity: excelDateToString(getRowValue(row, 'roadTaxValidity')),
            permitValidity: excelDateToString(getRowValue(row, 'permitValidity')),
            registrationValidity: excelDateToString(getRowValue(row, 'registrationValidity')),
            serviceIntervalMonths: parseInt(getRowValue(row, 'serviceIntervalMonths')) || 5,
            serviceIntervalKm: parseInt(getRowValue(row, 'serviceIntervalKm')) || 5000,
            lastServiceDate: excelDateToString(getRowValue(row, 'lastServiceDate')),
            lastServiceKm: parseInt(getRowValue(row, 'lastServiceKm')) || 0,
          });
        });
        
        if (errors.length > 0 && parsed.length === 0) {
          setError(errors.join('\n'));
          return;
        }
        
        setParsedVehicles(parsed);
        
        if (errors.length > 0) {
          setError(`${parsed.length} vehicles parsed successfully. ${errors.length} rows skipped due to missing data.`);
        }
        
      } catch (err) {
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (parsedVehicles.length === 0) {
      setError('No valid vehicles to import.');
      return;
    }
    
    setImporting(true);
    setError('');
    
    try {
      const vehicles: Motorcycle[] = parsedVehicles.map((pv) => {
        const make = pv.make;
        const model = pv.model;

        if (!existingMakes.includes(make)) {
          onAddMake(make);
        }
        if (!existingModels[make]?.includes(model)) {
          onAddModel(make, model);
        }

        const vehicle: Motorcycle = {
          id: generateId(),
          make,
          model,
          vehicleType: pv.vehicleType,
          ownerName: pv.ownerName,
          registrationNumber: pv.registrationNumber,
          chassisNumber: pv.chassisNumber,
          engineNumber: pv.engineNumber,
          insuranceValidity: pv.insuranceValidity,
          pollutionValidity: pv.pollutionValidity,
          fitnessValidity: pv.fitnessValidity,
          roadTaxValidity: pv.roadTaxValidity,
          permitValidity: pv.permitValidity,
          registrationValidity: pv.registrationValidity,
          vehicleUsage: pv.usageType,
          serviceIntervalMonths: pv.serviceIntervalMonths,
          serviceIntervalKms: pv.serviceIntervalKm,
          lastServiceDate: pv.lastServiceDate,
          lastServiceKm: pv.lastServiceKm,
          currentOdometer: pv.currentOdometer,
          createdAt: new Date().toISOString(),
          kmReadings: [{
            id: 'km_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            date: new Date().toISOString().split('T')[0],
            kilometers: pv.currentOdometer
          }]
        };

        return vehicle;
      });

      onImport(vehicles);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to import vehicles.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-amber-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Import Vehicles from Excel</h2>
              <p className="text-amber-100 text-xs">Bulk import your fleet data</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Import Successful!</h3>
              <p className="text-gray-400">{parsedVehicles.length} vehicles have been imported.</p>
            </div>
          ) : (
            <>
              {/* Step 1 */}
              <div className="mb-6">
                <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  Download Template
                </h3>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300 text-sm mb-3">
                    Download the template with correct column headers. Fill in your data and upload.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Template
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mb-6">
                <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  Upload Your File
                </h3>
                <div 
                  className="bg-gray-800 rounded-xl p-6 border-2 border-dashed border-gray-600 hover:border-amber-500 transition-colors cursor-pointer text-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  {file ? (
                    <div>
                      <p className="text-green-400 font-medium">{file.name}</p>
                      <p className="text-gray-500 text-sm mt-1">Click to choose a different file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300">Click to upload Excel file</p>
                      <p className="text-gray-500 text-sm mt-1">.xlsx, .xls, or .csv</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm whitespace-pre-line">{error}</p>
                </div>
              )}

              {/* Step 3 - Preview */}
              {parsedVehicles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Preview ({parsedVehicles.length} vehicles ready)
                  </h3>
                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-700/50">
                          <tr>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">#</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Type</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Make</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Model</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Registration</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Owner</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Usage</th>
                            <th className="px-3 py-2 text-left text-amber-400 font-medium">Odometer</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {parsedVehicles.slice(0, 10).map((pv, index) => (
                            <tr key={index} className="hover:bg-gray-700/30">
                              <td className="px-3 py-2 text-gray-400">{index + 1}</td>
                              <td className="px-3 py-2 text-gray-300">
                                {pv.vehicleType === 'Car' ? '🚗' : '🏍️'} {pv.vehicleType}
                              </td>
                              <td className="px-3 py-2 text-gray-300">{pv.make}</td>
                              <td className="px-3 py-2 text-gray-300">{pv.model}</td>
                              <td className="px-3 py-2 text-white font-medium">{pv.registrationNumber}</td>
                              <td className="px-3 py-2 text-gray-300">{pv.ownerName || '-'}</td>
                              <td className="px-3 py-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  pv.usageType === 'Private' 
                                    ? 'bg-blue-500/20 text-blue-400' 
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {pv.usageType}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-gray-300">{pv.currentOdometer.toLocaleString()} km</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsedVehicles.length > 10 && (
                      <div className="px-4 py-2 bg-gray-700/30 text-center text-gray-400 text-sm">
                        ... and {parsedVehicles.length - 10} more vehicles
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={importing}
                      className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      {importing ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Importing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Import {parsedVehicles.length} Vehicles
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h4 className="text-amber-400 font-medium mb-2">💡 Tips</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Column names are flexible (e.g., "Make", "Brand", "make" all work)</li>
                  <li>• Dates can be YYYY-MM-DD, DD/MM/YYYY, or DD-MM-YYYY</li>
                  <li>• Empty rows are automatically skipped</li>
                  <li>• New Makes and Models are auto-added to your lists</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExcelImport;
