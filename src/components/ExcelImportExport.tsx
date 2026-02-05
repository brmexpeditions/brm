import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import type { Motorcycle, ServiceRecord, VehicleCategory, VehicleType } from "@/types";

type ImportMode = "merge" | "replace";

type VehiclesRow = Record<string, any>;

type ImportResult = {
  vehicles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  warnings: string[];
  errors: string[];
};

function toStringSafe(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function toNumberSafe(v: any): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function excelSerialToDateString(serial: number): string {
  // Excel serial date: days since 1899-12-30
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  const yyyy = dateInfo.getUTCFullYear();
  const mm = String(dateInfo.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dateInfo.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toISODateOrEmpty(v: any): string {
  if (v === null || v === undefined || v === "") return "";
  if (typeof v === "number" && Number.isFinite(v)) return excelSerialToDateString(v);
  const s = toStringSafe(v);
  if (!s) return "";

  // Accept YYYY-MM-DD directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try Date parse
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return "";
}

function normalizeCategory(v: any): VehicleCategory {
  const s = toStringSafe(v).toLowerCase();
  return s === "car" ? "car" : "bike";
}

function normalizeVehicleType(v: any): VehicleType {
  const s = toStringSafe(v).toLowerCase();
  return s === "private" ? "private" : "commercial";
}

function makeId(): string {
  // randomUUID not available in some mobile webviews
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function buildTemplateWorkbook(): XLSX.WorkBook {
  const vehiclesHeaders = [
    "id (optional)",
    "vehicleCategory (bike|car)",
    "make*",
    "model*",
    "ownerName",
    "registrationNumber*",
    "chassisNumber",
    "engineNumber",
    "vehicleType (private|commercial)",
    "currentOdometer*",
    "registrationValidity (YYYY-MM-DD)",
    "insuranceValidity (YYYY-MM-DD)",
    "pollutionValidity (YYYY-MM-DD)",
    "fitnessValidity (YYYY-MM-DD)",
    "roadTaxValidity (YYYY-MM-DD)",
    "serviceIntervalMonths",
    "serviceIntervalKms",
    "lastServiceDate (YYYY-MM-DD)",
    "lastServiceKm",
  ];

  const sampleVehicleRow = [
    "",
    "bike",
    "Honda",
    "Activa 6G",
    "",
    "MH01AB1234",
    "",
    "",
    "commercial",
    15000,
    "",
    "2026-01-01",
    "2025-12-31",
    "",
    "",
    5,
    5000,
    "2025-01-15",
    12000,
  ];

  const vehiclesAoA = [vehiclesHeaders, sampleVehicleRow];
  const vehiclesSheet = XLSX.utils.aoa_to_sheet(vehiclesAoA);

  const serviceHeaders = [
    "id (optional)",
    "vehicleId* (matches Vehicles.id or Vehicles.registrationNumber)",
    "date* (YYYY-MM-DD)",
    "kilometers*",
    "workDone*",
    "amount",
    "garage",
    "mechanic",
    "partsReplaced",
    "notes",
  ];

  const sampleServiceRow = [
    "",
    "MH01AB1234",
    "2025-02-01",
    15250,
    "Engine oil change",
    950,
    "Authorized Service",
    "",
    "Engine oil",
    "",
  ];

  const serviceAoA = [serviceHeaders, sampleServiceRow];
  const serviceSheet = XLSX.utils.aoa_to_sheet(serviceAoA);

  // Add a tiny Notes sheet
  const notesAoA = [
    ["Instructions"],
    ["- Fill the Vehicles sheet to add/update vehicles."],
    ["- Required fields: make, model, registrationNumber, currentOdometer."],
    ["- Dates should be YYYY-MM-DD (or normal Excel dates)."],
    ["- ServiceRecords: vehicleId can be Vehicles.id OR registrationNumber."],
    ["- Leave optional fields blank if not applicable."],
  ];
  const notesSheet = XLSX.utils.aoa_to_sheet(notesAoA);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, vehiclesSheet, "Vehicles");
  XLSX.utils.book_append_sheet(wb, serviceSheet, "ServiceRecords");
  XLSX.utils.book_append_sheet(wb, notesSheet, "Notes");
  return wb;
}

function parseWorkbookToData(wb: XLSX.WorkBook): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const vehiclesSheet = wb.Sheets["Vehicles"];
  if (!vehiclesSheet) {
    errors.push('Missing sheet: "Vehicles"');
  }

  const serviceSheet = wb.Sheets["ServiceRecords"];
  // Service sheet is optional

  const vehiclesJson: VehiclesRow[] = vehiclesSheet
    ? (XLSX.utils.sheet_to_json(vehiclesSheet, { defval: "" }) as VehiclesRow[])
    : [];

  const serviceJson: VehiclesRow[] = serviceSheet
    ? (XLSX.utils.sheet_to_json(serviceSheet, { defval: "" }) as VehiclesRow[])
    : [];

  const vehicles: Motorcycle[] = [];

  for (let i = 0; i < vehiclesJson.length; i++) {
    const r = vehiclesJson[i];

    // Support both header styles: exact template headers OR user-friendly column names
    const id = toStringSafe(r["id (optional)"] || r["id"]);
    const vehicleCategory = normalizeCategory(
      r["vehicleCategory (bike|car)"] ?? r["vehicleCategory"]
    );

    const make = toStringSafe(r["make*"] || r["make"]);
    const model = toStringSafe(r["model*"] || r["model"]);
    const ownerName = toStringSafe(r["ownerName"]);
    const registrationNumber = toStringSafe(
      r["registrationNumber*"] || r["registrationNumber"]
    ).toUpperCase();
    const chassisNumber = toStringSafe(r["chassisNumber"]).toUpperCase();
    const engineNumber = toStringSafe(r["engineNumber"]).toUpperCase();

    const vehicleType = normalizeVehicleType(
      r["vehicleType (private|commercial)"] ?? r["vehicleType"]
    );

    const currentOdometer = toNumberSafe(
      r["currentOdometer*"] ?? r["currentOdometer"]
    );

    if (!make || !model || !registrationNumber || !currentOdometer) {
      errors.push(
        `Vehicles row ${i + 2}: Missing required fields (make, model, registrationNumber, currentOdometer)`
      );
      continue;
    }

    const insuranceValidity = toISODateOrEmpty(
      r["insuranceValidity (YYYY-MM-DD)"] ?? r["insuranceValidity"]
    );
    const pollutionValidity = toISODateOrEmpty(
      r["pollutionValidity (YYYY-MM-DD)"] ?? r["pollutionValidity"]
    );
    const registrationValidity = toISODateOrEmpty(
      r["registrationValidity (YYYY-MM-DD)"] ?? r["registrationValidity"]
    );
    const fitnessValidity = toISODateOrEmpty(
      r["fitnessValidity (YYYY-MM-DD)"] ?? r["fitnessValidity"]
    );
    const roadTaxValidity = toISODateOrEmpty(
      r["roadTaxValidity (YYYY-MM-DD)"] ?? r["roadTaxValidity"]
    );

    const serviceIntervalMonths =
      toNumberSafe(r["serviceIntervalMonths"]) || 5;
    const serviceIntervalKms =
      toNumberSafe(r["serviceIntervalKms"]) || 5000;

    const lastServiceDate = toISODateOrEmpty(
      r["lastServiceDate (YYYY-MM-DD)"] ?? r["lastServiceDate"]
    );
    const lastServiceKm = toNumberSafe(r["lastServiceKm"]);

    if (!insuranceValidity || !pollutionValidity) {
      warnings.push(
        `Vehicles row ${i + 2}: insuranceValidity/pollutionValidity missing (alerts may be incomplete).`
      );
    }

    const today = new Date().toISOString().split("T")[0];

    vehicles.push({
      id: id || makeId(),
      vehicleCategory,
      make,
      model,
      ownerName: ownerName || undefined,
      registrationNumber,
      chassisNumber,
      engineNumber: engineNumber || undefined,
      vehicleType,
      registrationValidity: registrationValidity || undefined,
      insuranceValidity: insuranceValidity,
      pollutionValidity: pollutionValidity,
      fitnessValidity: fitnessValidity || undefined,
      roadTaxValidity: roadTaxValidity || undefined,
      serviceIntervalMonths,
      serviceIntervalKms,
      lastServiceDate,
      lastServiceKm,
      kmReadings: [{ id: makeId(), date: today, kilometers: currentOdometer }],
      currentOdometer,
      createdAt: new Date().toISOString(),
    });
  }

  const vehicleIdByReg = new Map<string, string>();
  vehicles.forEach((v) => vehicleIdByReg.set(v.registrationNumber, v.id));

  const serviceRecords: ServiceRecord[] = [];

  for (let i = 0; i < serviceJson.length; i++) {
    const r = serviceJson[i];

    const id = toStringSafe(r["id (optional)"] || r["id"]);
    const vehicleIdRaw = toStringSafe(
      r["vehicleId* (matches Vehicles.id or Vehicles.registrationNumber)"] ||
        r["vehicleId"] ||
        r["vehicleId*"] ||
        r["motorcycleId"]
    );

    const date = toISODateOrEmpty(r["date* (YYYY-MM-DD)"] || r["date"]);
    const kilometers = toNumberSafe(r["kilometers*"] ?? r["kilometers"]);
    const workDone = toStringSafe(r["workDone*"] || r["workDone"]);
    const amount = toNumberSafe(r["amount"]);
    const garage = toStringSafe(r["garage"]);
    const mechanic = toStringSafe(r["mechanic"]);
    const partsReplaced = toStringSafe(r["partsReplaced"]);
    const notes = toStringSafe(r["notes"]);

    if (!vehicleIdRaw || !date || !kilometers || !workDone) {
      // Ignore completely empty rows
      const empty =
        !vehicleIdRaw && !date && !kilometers && !workDone && !amount && !garage;
      if (empty) continue;

      errors.push(
        `ServiceRecords row ${i + 2}: Missing required fields (vehicleId, date, kilometers, workDone)`
      );
      continue;
    }

    const resolvedVehicleId =
      vehicleIdByReg.get(vehicleIdRaw.toUpperCase()) || vehicleIdRaw;

    serviceRecords.push({
      id: id || makeId(),
      motorcycleId: resolvedVehicleId,
      date,
      kilometers,
      workDone,
      amount,
      garage: garage || undefined,
      mechanic: mechanic || undefined,
      partsReplaced: partsReplaced || undefined,
      notes: notes || undefined,
    });
  }

  return { vehicles, serviceRecords, warnings, errors };
}

export default function ExcelImportExport(props: {
  existingVehicles: Motorcycle[];
  existingServiceRecords: ServiceRecord[];
  onApplyImport: (payload: { vehicles: Motorcycle[]; serviceRecords: ServiceRecord[] }, mode: ImportMode) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImportMode>("merge");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => {
    return {
      vehicles: props.existingVehicles.length,
      serviceRecords: props.existingServiceRecords.length,
    };
  }, [props.existingVehicles.length, props.existingServiceRecords.length]);

  const downloadTemplate = () => {
    const wb = buildTemplateWorkbook();
    XLSX.writeFile(wb, "fleet_template.xlsx", { compression: true });
  };

  const handlePickFile = () => {
    fileRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setBusy(true);
    setResult(null);

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const parsed = parseWorkbookToData(wb);
      setResult(parsed);
    } catch (e: any) {
      setResult({
        vehicles: [],
        serviceRecords: [],
        warnings: [],
        errors: [e?.message || "Failed to parse Excel file"],
      });
    } finally {
      setBusy(false);
    }
  };

  const applyImport = () => {
    if (!result) return;
    if (result.errors.length > 0) {
      alert("Please fix the errors before importing.");
      return;
    }

    const confirmText =
      mode === "replace"
        ? "This will REPLACE your current vehicles and service records with the Excel file. Continue?"
        : "This will MERGE vehicles and service records from Excel into your current data. Continue?";

    if (!window.confirm(confirmText)) return;

    props.onApplyImport({ vehicles: result.vehicles, serviceRecords: result.serviceRecords }, mode);
    alert("Excel import applied successfully.");
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">📄 Excel Import / Export</h2>
          <p className="text-sm text-gray-600 mt-1">
            Download a template, fill it in Excel, and upload to load vehicles and service records quickly.
          </p>
        </div>
        <div
          className="text-xs rounded-xl px-3 py-2"
          style={{ backgroundColor: "rgba(212,175,55,0.10)", border: "1px solid rgba(212,175,55,0.22)" }}
        >
          <div className="font-semibold text-gray-900">Current data</div>
          <div className="text-gray-700">Vehicles: {stats.vehicles}</div>
          <div className="text-gray-700">Services: {stats.serviceRecords}</div>
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={downloadTemplate}
          className="px-4 py-2.5 rounded-lg font-semibold bg-gray-900 text-amber-200 hover:bg-black transition-colors"
        >
          ⬇️ Download Excel Template
        </button>

        <button
          type="button"
          onClick={handlePickFile}
          className="px-4 py-2.5 rounded-lg font-semibold bg-amber-50 text-gray-900 border border-amber-200 hover:bg-amber-100 transition-colors"
        >
          ⬆️ Upload Excel File
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />

        <div className="sm:ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">Import mode:</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ImportMode)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
          >
            <option value="merge">Merge (recommended)</option>
            <option value="replace">Replace all</option>
          </select>
        </div>
      </div>

      {busy && (
        <div className="mt-4 text-sm text-gray-600">Reading Excel file…</div>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">Import preview</div>
              <div className="text-sm text-gray-600">
                Vehicles: <strong>{result.vehicles.length}</strong> • Service records: <strong>{result.serviceRecords.length}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={applyImport}
              className="px-4 py-2 rounded-lg font-semibold bg-gray-900 text-amber-200 hover:bg-black"
            >
              Apply Import
            </button>
          </div>

          {(result.errors.length > 0 || result.warnings.length > 0) && (
            <div className="p-4 space-y-3">
              {result.errors.length > 0 && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <div className="font-semibold text-red-800">Errors (must fix)</div>
                  <ul className="list-disc list-inside text-sm text-red-700 mt-1 space-y-1">
                    {result.errors.slice(0, 10).map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                    {result.errors.length > 10 && (
                      <li>…and {result.errors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <div className="font-semibold text-amber-900">Warnings</div>
                  <ul className="list-disc list-inside text-sm text-amber-800 mt-1 space-y-1">
                    {result.warnings.slice(0, 10).map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                    {result.warnings.length > 10 && (
                      <li>…and {result.warnings.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="px-4 py-3 text-xs text-gray-500 border-t bg-white">
            Tip: Keep sheet names as <strong>Vehicles</strong> and <strong>ServiceRecords</strong>. Dates can be Excel dates or YYYY-MM-DD.
          </div>
        </div>
      )}
    </div>
  );
}
