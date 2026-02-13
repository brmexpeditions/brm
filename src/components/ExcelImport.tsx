import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Motorcycle, VehicleCategory, VehicleUsageType } from '../types';

interface ExcelImportProps {
  onImport: (vehicles: Motorcycle[]) => void;
  existingMakes: string[];
  existingModels: { [make: string]: string[] };
  onAddMake: (make: string) => void;
  onAddModel: (make: string, model: string) => void;
  onClose: () => void;
}

type PreviewRow = {
  rawIndex: number; // 0-based index in sheet_to_json output
  vehicleType: VehicleCategory;
  make: string;
  model: string;
  registrationNumber: string;
  ownerName: string;
  usageType: VehicleUsageType;
  errors: string[];
  raw: Record<string, unknown>;
};

const generateId = () => {
  return 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
};

const normalizeKey = (k: string) => k.toLowerCase().replace(/[^a-z0-9]/g, '');

const toStr = (v: unknown) => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
};

const excelDateToString = (excelDate: unknown): string => {
  if (!excelDate) return '';
  if (typeof excelDate === 'string') {
    // Some exports contain "YYYY-MM-DD" already
    const trimmed = excelDate.trim();
    return trimmed;
  }
  if (typeof excelDate === 'number') {
    // Excel serial date
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  return '';
};

const normalizeRow = (row: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row)) {
    out[normalizeKey(k)] = row[k];
  }
  return out;
};

const pick = (nrow: Record<string, unknown>, keys: string[]): string => {
  for (const k of keys) {
    const v = nrow[normalizeKey(k)];
    const s = toStr(v).trim();
    if (s) return s;
  }
  return '';
};

const parseVehicleType = (value: string): VehicleCategory => {
  const v = value.trim().toLowerCase();
  if (v === 'car' || v === 'cars' || v === '4w' || v === 'fourwheeler' || v === 'fourwheel') return 'Car';
  return 'Bike';
};

const parseUsageType = (value: string): VehicleUsageType => {
  const v = value.trim().toLowerCase();
  if (v === 'private') return 'Private';
  if (v === 'commercial' || v === 'commercialvehicle' || v === 'cv') return 'Commercial';
  // default to Commercial (older template)
  return 'Commercial';
};

export function ExcelImport({
  onImport,
  existingMakes,
  existingModels,
  onAddMake,
  onAddModel,
  onClose,
}: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState<string>('');
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invalidCount = useMemo(
    () => previewRows.filter((r) => r.errors.length > 0).length,
    [previewRows]
  );

  // Download Excel template
  const downloadTemplate = () => {
    const templateData = [
      {
        'Vehicle Type': 'Bike',
        Make: 'Honda',
        Model: 'Activa 6G',
        'Owner Name': 'John Doe',
        'Registration Number': 'MH01AB1234',
        'Chassis Number': 'MBLHA10EY9H123456',
        'Engine Number': 'HA10EYH123456',
        'Current Odometer (KM)': 15000,
        'Usage Type': 'Commercial',
        Insurance: '2025-12-31',
        Pollution: '2025-06-30',
        Fitness: '2025-12-31',
        'Road Tax': '2026-03-31',
        Permit: '2026-03-31',
        Registration: '',
        'Service Interval (Months)': 5,
        'Service Interval (KM)': 5000,
        'Last Service Date': '2024-11-01',
        'Last Service KM': 14000,
      },
      {
        'Vehicle Type': 'Car',
        Make: 'Maruti Suzuki',
        Model: 'Swift',
        'Owner Name': 'Jane Smith',
        'Registration Number': 'MH02CD5678',
        'Chassis Number': 'MA3FJEB1S00123456',
        'Engine Number': 'K12MN1234567',
        'Current Odometer (KM)': 45000,
        'Usage Type': 'Private',
        Insurance: '2025-08-15',
        Pollution: '2025-04-20',
        Fitness: '',
        'Road Tax': '',
        Permit: '',
        Registration: '2035-06-10',
        'Service Interval (Months)': 6,
        'Service Interval (KM)': 10000,
        'Last Service Date': '2024-10-15',
        'Last Service KM': 43000,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);

    ws['!cols'] = [
      { wch: 12 }, // Vehicle Type
      { wch: 18 }, // Make
      { wch: 18 }, // Model
      { wch: 20 }, // Owner Name
      { wch: 18 }, // Registration Number
      { wch: 22 }, // Chassis Number
      { wch: 18 }, // Engine Number
      { wch: 20 }, // Current Odometer
      { wch: 12 }, // Usage Type
      { wch: 14 }, // Insurance
      { wch: 14 }, // Pollution
      { wch: 14 }, // Fitness
      { wch: 14 }, // Road Tax
      { wch: 14 }, // Permit
      { wch: 14 }, // Registration
      { wch: 22 }, // Service Interval Months
      { wch: 18 }, // Service Interval KM
      { wch: 16 }, // Last Service Date
      { wch: 14 }, // Last Service KM
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vehicles');

    const instructionsData = [
      { Field: 'Vehicle Type', Description: 'Bike or Car', Required: 'No', Example: 'Bike' },
      { Field: 'Make', Description: 'Brand name', Required: 'Yes', Example: 'Honda' },
      { Field: 'Model', Description: 'Model name', Required: 'Yes', Example: 'Activa 6G' },
      { Field: 'Registration Number', Description: 'Registration', Required: 'Yes', Example: 'MH01AB1234' },
      { Field: 'Current Odometer (KM)', Description: 'Current odometer', Required: 'No', Example: '15000' },
      { Field: 'Usage Type', Description: 'Private or Commercial', Required: 'No', Example: 'Commercial' },
      { Field: 'Insurance', Description: 'Expiry date (YYYY-MM-DD)', Required: 'Recommended', Example: '2025-12-31' },
      { Field: 'Pollution', Description: 'Expiry date (YYYY-MM-DD)', Required: 'Recommended', Example: '2025-06-30' },
      { Field: 'Fitness', Description: 'Commercial only', Required: 'Commercial only', Example: '2025-12-31' },
      { Field: 'Road Tax', Description: 'Commercial only', Required: 'Commercial only', Example: '2026-03-31' },
      { Field: 'Permit', Description: 'Commercial only', Required: 'Commercial only', Example: '2026-03-31' },
      { Field: 'Registration', Description: 'Private only', Required: 'Private only', Example: '2030-01-15' },
      { Field: 'Service Interval (Months)', Description: 'Default 5', Required: 'No', Example: '5' },
      { Field: 'Service Interval (KM)', Description: 'Default 5000', Required: 'No', Example: '5000' },
      { Field: 'Last Service Date', Description: 'YYYY-MM-DD', Required: 'No', Example: '2024-11-01' },
      { Field: 'Last Service KM', Description: 'KM at last service', Required: 'No', Example: '14000' },
    ];

    const wsInstructions = XLSX.utils.json_to_sheet(instructionsData);
    wsInstructions['!cols'] = [{ wch: 22 }, { wch: 48 }, { wch: 18 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Instructions');

    XLSX.writeFile(wb, 'fleet-guard-vehicle-import-template.xlsx');
  };

  const buildPreview = (rows: Record<string, unknown>[]): PreviewRow[] => {
    return rows
      .map((row, rawIndex) => {
        const nrow = normalizeRow(row);

        const make = pick(nrow, ['make', 'brand', 'vehiclemake']);
        const model = pick(nrow, ['model', 'vehiclemodel']);
        const registrationNumber = pick(nrow, ['registrationnumber', 'registration', 'regno', 'regnumber']);
        const ownerName = pick(nrow, ['ownername', 'owner', 'name']);
        const vehicleType = parseVehicleType(pick(nrow, ['vehicletype', 'type', 'vehicletypebikecar']));
        const usageType = parseUsageType(pick(nrow, ['usagetype', 'usage', 'vehicleusage', 'privatecommercial']));

        const errors: string[] = [];
        if (!make) errors.push('Make is required');
        if (!model) errors.push('Model is required');
        if (!registrationNumber) errors.push('Registration Number is required');

        return {
          rawIndex,
          vehicleType,
          make,
          model,
          registrationNumber,
          ownerName,
          usageType,
          errors,
          raw: row,
        };
      })
      .filter((r) => {
        // Drop completely empty rows
        const hasAny = r.make || r.model || r.registrationNumber || r.ownerName;
        return Boolean(hasAny);
      });
  };

  // Parse Excel file
  const parseExcel = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Prefer a sheet named "Vehicles" (fixes the common issue where Instructions is first)
        const preferred = workbook.SheetNames.find((n) => normalizeKey(n) === 'vehicles');
        const sheetName = preferred || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: false,
        }) as Record<string, unknown>[];

        if (!jsonData.length) {
          setError('No rows found in the selected sheet. Make sure you filled the Vehicles sheet.');
          setPreviewRows([]);
          return;
        }

        const pv = buildPreview(jsonData);
        if (!pv.length) {
          setError('No usable rows found. Please check your Excel file.');
          setPreviewRows([]);
          return;
        }

        setPreviewRows(pv);
      } catch (err) {
        console.error(err);
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx file.');
        setPreviewRows([]);
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
      parseExcel(selectedFile);
    }
  };

  const handleImport = () => {
    setImporting(true);
    setError('');

    try {
      if (!previewRows.length) {
        setError('No preview data to import. Please upload a file first.');
        return;
      }

      const invalid = previewRows.filter((r) => r.errors.length > 0);
      if (invalid.length > 0) {
        const first = invalid[0];
        // +2 because Excel sheet has header row
        throw new Error(`Row ${first.rawIndex + 2}: ${first.errors.join(', ')}`);
      }

      const vehicles: Motorcycle[] = previewRows.map((pRow) => {
        const row = pRow.raw;
        const nrow = normalizeRow(row);

        const make = pRow.make;
        const model = pRow.model;

        // Add make and model to lists if not exists
        if (!existingMakes.includes(make)) {
          onAddMake(make);
        }
        if (!existingModels[make]?.includes(model)) {
          onAddModel(make, model);
        }

        const currentOdometer = Number(pick(nrow, ['currentodometerkm', 'currentodometer', 'odometer', 'odometerkm'])) || 0;

        const usageType = pRow.usageType;

        const insurance = excelDateToString(
          pick(nrow, ['insurance', 'insurancevalidtill', 'insuranceexpiry', 'insurancevalidity', 'insurancetill'])
        );
        const pollution = excelDateToString(
          pick(nrow, ['pollution', 'pollutionvalidtill', 'puc', 'pucvalidtill', 'pollutionexpiry'])
        );
        const fitness = excelDateToString(pick(nrow, ['fitness', 'fitnessvalidtill', 'fitnessexpiry']));
        const roadTax = excelDateToString(pick(nrow, ['roadtax', 'roadtaxvalidtill', 'tax', 'taxvalidtill']));
        const permit = excelDateToString(pick(nrow, ['permit', 'permitvalidtill', 'permitexpiry']));
        const registrationValidity = excelDateToString(
          pick(nrow, ['registration', 'registrationvalidtill', 'rcvalidtill', 'rc', 'registrationexpiry'])
        );

        const serviceIntervalMonths = Number(pick(nrow, ['serviceintervalmonths', 'serviceintervalmonth', 'intervalmonths'])) || 5;
        const serviceIntervalKms = Number(pick(nrow, ['serviceintervalkm', 'serviceintervalkms', 'serviceinterval', 'intervalkm'])) || 5000;
        const lastServiceDate = excelDateToString(pick(nrow, ['lastservicedate', 'service date', 'servicedate']));
        const lastServiceKm = Number(pick(nrow, ['lastservicekm', 'lastservicekms', 'last serviced km', 'lastserviceodometer'])) || 0;

        const vehicle: Motorcycle = {
          id: generateId(),
          vehicleType: pRow.vehicleType,
          vehicleUsage: usageType,
          make,
          model,
          ownerName: pRow.ownerName,
          registrationNumber: pRow.registrationNumber,
          chassisNumber: pick(nrow, ['chassisnumber', 'chassis', 'vin']),
          engineNumber: pick(nrow, ['enginenumber', 'engine']),

          insuranceValidity: insurance,
          pollutionValidity: pollution,
          fitnessValidity: usageType === 'Commercial' ? fitness : undefined,
          roadTaxValidity: usageType === 'Commercial' ? roadTax : undefined,
          permitValidity: usageType === 'Commercial' ? permit : undefined,
          registrationValidity: usageType === 'Private' ? registrationValidity : undefined,

          serviceIntervalMonths,
          serviceIntervalKms,
          lastServiceDate,
          lastServiceKm,

          currentOdometer,
          createdAt: new Date().toISOString(),
          kmReadings: [
            {
              id: 'km_' + generateId(),
              date: new Date().toISOString().split('T')[0],
              kilometers: currentOdometer,
            },
          ],
        };

        return vehicle;
      });

      onImport(vehicles);
      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import vehicles. Please check the data format.';
      setError(msg);
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
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
              <p className="text-gray-400">{previewRows.length} vehicles have been imported to your fleet.</p>
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
                    Download the template to ensure your columns match. Then fill your data in the <strong>Vehicles</strong> sheet.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Excel Template
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
                    accept=".xlsx,.xls"
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
                      <p className="text-gray-300">Click to upload</p>
                      <p className="text-gray-500 text-sm mt-1">.xlsx or .xls files only</p>
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
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Step 3 */}
              {previewRows.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-amber-500 text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      Preview & Import ({previewRows.length} rows)
                    </h3>

                    {invalidCount > 0 && (
                      <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg">
                        {invalidCount} row(s) have missing required fields
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Row</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Type</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Make</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Model</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Registration</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Owner</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Usage</th>
                            <th className="px-4 py-3 text-left text-amber-400 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {previewRows.slice(0, 15).map((row) => (
                            <tr key={row.rawIndex} className={row.errors.length ? 'bg-red-900/10' : 'hover:bg-gray-700/30'}>
                              <td className="px-4 py-3 text-gray-400">{row.rawIndex + 2}</td>
                              <td className="px-4 py-3 text-gray-300">{row.vehicleType === 'Car' ? '🚗 Car' : '🏍️ Bike'}</td>
                              <td className="px-4 py-3 text-gray-200">{row.make || <span className="text-red-300">(missing)</span>}</td>
                              <td className="px-4 py-3 text-gray-200">{row.model || <span className="text-red-300">(missing)</span>}</td>
                              <td className="px-4 py-3 text-white font-medium">{row.registrationNumber || <span className="text-red-300">(missing)</span>}</td>
                              <td className="px-4 py-3 text-gray-300">{row.ownerName || '-'}</td>
                              <td className="px-4 py-3 text-gray-300">{row.usageType}</td>
                              <td className="px-4 py-3">
                                {row.errors.length ? (
                                  <span className="text-xs text-red-300">{row.errors.join(' • ')}</span>
                                ) : (
                                  <span className="text-xs text-green-300">OK</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {previewRows.length > 15 && (
                      <div className="px-4 py-2 bg-gray-700/30 text-center text-gray-400 text-sm">
                        ... and {previewRows.length - 15} more rows
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleImport}
                      disabled={importing}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-xl transition-all disabled:opacity-50"
                    >
                      {importing ? 'Importing…' : `Import ${previewRows.length} Vehicles`}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h4 className="text-amber-400 font-medium mb-2">Tips</h4>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Make sure you filled the <strong>Vehicles</strong> sheet (not Instructions)</li>
                  <li>• Required columns: Make, Model, Registration Number</li>
                  <li>• Dates should be in <strong>YYYY-MM-DD</strong></li>
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
