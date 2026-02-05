import { useMemo, useState } from "react";
import type { CompanySettings, Motorcycle, ServiceRecord, VehicleType } from "../types";
import { formatDate, getDaysUntil } from "../utils/helpers";

interface AnalyticsProps {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  companySettings: CompanySettings;
  onOpenVehicle?: (vehicleId: string) => void;
}

type DocKey = "registration" | "insurance" | "pollution" | "fitness" | "roadTax";

type ServiceDetailMode = "upcoming" | "overdue" | null;

type DocDetailMode = {
  doc: DocKey;
  status: "expiring" | "expired";
} | null;

const DOCS: Array<{ key: DocKey; label: string; appliesTo: "all" | VehicleType }> = [
  { key: "registration", label: "Registration", appliesTo: "private" },
  { key: "insurance", label: "Insurance", appliesTo: "all" },
  { key: "pollution", label: "Pollution", appliesTo: "all" },
  { key: "fitness", label: "Fitness", appliesTo: "commercial" },
  { key: "roadTax", label: "Road Tax", appliesTo: "commercial" },
];

function clampMin0(n: number) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function safeDateISO(d: Date) {
  return d.toISOString().split("T")[0];
}

function getNextServiceDate(lastServiceDate: string, intervalMonths: number): string {
  const d = new Date(lastServiceDate);
  if (Number.isNaN(d.getTime())) return "";
  const nd = new Date(d);
  nd.setMonth(nd.getMonth() + intervalMonths);
  return safeDateISO(nd);
}

function formatDaysLeft(days: number) {
  if (!Number.isFinite(days)) return "N/A";
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

function formatKmLeft(kmLeft: number) {
  if (!Number.isFinite(kmLeft)) return "N/A";
  if (kmLeft < 0) return `${Math.abs(kmLeft).toLocaleString()} km overdue`;
  if (kmLeft === 0) return "Due now";
  return `${kmLeft.toLocaleString()} km left`;
}

const Analytics = ({ motorcycles, serviceRecords, companySettings, onOpenVehicle }: AnalyticsProps) => {
  const openVehicle = (id: string) => {
    if (onOpenVehicle) onOpenVehicle(id);
  };
  const [serviceDetailMode, setServiceDetailMode] = useState<ServiceDetailMode>(null);
  const [docDetailMode, setDocDetailMode] = useState<DocDetailMode>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const safeServiceRecords = Array.isArray(serviceRecords) ? serviceRecords : [];
  const totalVehicles = motorcycles.length;

  const totalServiceCost = safeServiceRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
  const avgServiceCost = safeServiceRecords.length > 0 ? totalServiceCost / safeServiceRecords.length : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(num));
  };

  // -----------------------------
  // Service status computations
  // -----------------------------
  const serviceRows = useMemo(() => {
    return motorcycles
      .map((m) => {
        const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
        const currentKm = kmReadings.length > 0
          ? Math.max(...kmReadings.map((r) => r.kilometers))
          : (m.currentOdometer ?? m.lastServiceKm ?? 0);

        const intervalMonths = m.serviceIntervalMonths || 5;
        const intervalKms = m.serviceIntervalKms || 5000;

        const lastKm = m.lastServiceKm || 0;
        const kmSince = clampMin0(currentKm - lastKm);
        const kmLeft = intervalKms - kmSince;

        const nextDate = m.lastServiceDate ? getNextServiceDate(m.lastServiceDate, intervalMonths) : "";
        const daysLeft = nextDate ? getDaysUntil(nextDate) : Infinity;

        const overdue = kmLeft <= 0 || daysLeft <= 0;
        const upcoming = !overdue && (kmLeft <= 500 || daysLeft <= 15);
        const status: "ok" | "upcoming" | "overdue" = overdue ? "overdue" : upcoming ? "upcoming" : "ok";

        // sort key: overdue first (most overdue), then upcoming (soonest), then ok
        const urgencyKey = overdue
          ? 0
          : upcoming
            ? 1
            : 2;
        const soonest = Math.min(
          Number.isFinite(daysLeft) ? daysLeft : 999999,
          Number.isFinite(kmLeft) ? Math.max(0, Math.ceil(kmLeft / 50)) : 999999
        );

        return {
          id: m.id,
          name: `${m.make} ${m.model}`,
          registrationNumber: m.registrationNumber,
          status,
          currentKm,
          kmLeft,
          daysLeft,
          nextDate,
          intervalMonths,
          intervalKms,
          vehicleCategory: m.vehicleCategory || "bike",
          vehicleType: m.vehicleType || "commercial",
          urgencyKey,
          soonest,
        };
      })
      .sort((a, b) => (a.urgencyKey - b.urgencyKey) || (a.soonest - b.soonest) || a.name.localeCompare(b.name));
  }, [motorcycles]);

  const serviceStatusCount = useMemo(() => {
    return serviceRows.reduce(
      (acc, r) => {
        acc[r.status] += 1;
        return acc;
      },
      { ok: 0, upcoming: 0, overdue: 0 }
    );
  }, [serviceRows]);

  const serviceUpcomingList = useMemo(
    () => serviceRows.filter((r) => r.status === "upcoming"),
    [serviceRows]
  );
  const serviceOverdueList = useMemo(
    () => serviceRows.filter((r) => r.status === "overdue"),
    [serviceRows]
  );

  // -----------------------------
  // Document status computations
  // -----------------------------

  const docRows = useMemo(() => {
    // produces flattened rows for (vehicle x doc)
    const rows: Array<{
      doc: DocKey;
      vehicleId: string;
      vehicleName: string;
      registrationNumber: string;
      vehicleType: VehicleType;
      validTill: string;
      daysLeft: number;
      status: "valid" | "expiring" | "expired";
    }> = [];

    for (const m of motorcycles) {
      const vType: VehicleType = m.vehicleType || "commercial";
      const name = `${m.make} ${m.model}`;

      const docDateByKey: Record<DocKey, string | undefined> = {
        registration: m.registrationValidity,
        insurance: m.insuranceValidity,
        pollution: m.pollutionValidity,
        fitness: m.fitnessValidity,
        roadTax: m.roadTaxValidity,
      };

      for (const d of DOCS) {
        if (d.appliesTo !== "all" && d.appliesTo !== vType) continue;
        const date = docDateByKey[d.key];
        if (!date) continue;

        const daysLeft = getDaysUntil(date);
        const status = daysLeft <= 0 ? "expired" : daysLeft <= 30 ? "expiring" : "valid";

        rows.push({
          doc: d.key,
          vehicleId: m.id,
          vehicleName: name,
          registrationNumber: m.registrationNumber,
          vehicleType: vType,
          validTill: date,
          daysLeft,
          status,
        });
      }
    }

    // sort: expired first then expiring then valid; soonest first
    const statusOrder: Record<string, number> = { expired: 0, expiring: 1, valid: 2 };
    rows.sort((a, b) => {
      return (
        (statusOrder[a.status] - statusOrder[b.status]) ||
        (a.daysLeft - b.daysLeft) ||
        a.vehicleName.localeCompare(b.vehicleName)
      );
    });

    return rows;
  }, [motorcycles]);

  const documentStats = useMemo(() => {
    const stats: Record<DocKey, { expired: number; expiring: number; valid: number }> = {
      registration: { expired: 0, expiring: 0, valid: 0 },
      insurance: { expired: 0, expiring: 0, valid: 0 },
      pollution: { expired: 0, expiring: 0, valid: 0 },
      fitness: { expired: 0, expiring: 0, valid: 0 },
      roadTax: { expired: 0, expiring: 0, valid: 0 },
    };

    for (const r of docRows) {
      stats[r.doc][r.status] += 1;
    }

    return stats;
  }, [docRows]);

  const getDocDetailList = useMemo(() => {
    if (!docDetailMode) return [];
    return docRows.filter((r) => r.doc === docDetailMode.doc && r.status === docDetailMode.status);
  }, [docDetailMode, docRows]);

  // Total KM analysis
  const totalFleetKm = useMemo(() => {
    return motorcycles.reduce((sum, m) => {
      const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
      const maxKm = kmReadings.length > 0
        ? Math.max(...kmReadings.map((r) => r.kilometers))
        : (m.currentOdometer ?? m.lastServiceKm ?? 0);
      return sum + maxKm;
    }, 0);
  }, [motorcycles]);

  const avgKmPerVehicle = totalVehicles > 0 ? totalFleetKm / totalVehicles : 0;

  // Make/model distribution (kept from existing)
  const uniqueMakes = [...new Set(motorcycles.map((m) => m.make))];
  const uniqueModels = [...new Set(motorcycles.map((m) => `${m.make} ${m.model}`))];

  const makeDistribution = motorcycles.reduce((acc, m) => {
    acc[m.make] = (acc[m.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modelDistribution = motorcycles.reduce((acc, m) => {
    const key = `${m.make} ${m.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedMakes = Object.entries(makeDistribution).sort((a, b) => b[1] - a[1]);
  const sortedModels = Object.entries(modelDistribution).sort((a, b) => b[1] - a[1]);

  // Service cost per vehicle
  const serviceCostPerBike = motorcycles
    .map((m) => {
      const bikeServices = safeServiceRecords.filter((s) => s.motorcycleId === m.id);
      const totalCost = bikeServices.reduce((sum, s) => sum + (s.amount || 0), 0);
      return {
        bike: `${m.make} ${m.model}`,
        registration: m.registrationNumber,
        serviceCount: bikeServices.length,
        totalCost,
        avgCost: bikeServices.length > 0 ? totalCost / bikeServices.length : 0,
      };
    })
    .sort((a, b) => b.totalCost - a.totalCost);

  // Monthly service trend
  const monthlyServices = safeServiceRecords.reduce((acc, s) => {
    const month = s.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = { count: 0, cost: 0 };
    acc[month].count++;
    acc[month].cost += s.amount || 0;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);

  const sortedMonths = Object.entries(monthlyServices)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12);

  // Top odometer
  const highestKmBikes = motorcycles
    .map((m) => {
      const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
      const maxKm = kmReadings.length > 0
        ? Math.max(...kmReadings.map((r) => r.kilometers))
        : (m.currentOdometer ?? m.lastServiceKm ?? 0);
      return { ...m, currentKm: maxKm };
    })
    .sort((a, b) => b.currentKm - a.currentKm)
    .slice(0, 5);

  // Most serviced
  const mostServiced = motorcycles
    .map((m) => {
      const count = safeServiceRecords.filter((s) => s.motorcycleId === m.id).length;
      return { bike: `${m.make} ${m.model}`, registration: m.registrationNumber, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Garage/Workshop
  const garageStats = safeServiceRecords.reduce((acc, s) => {
    const garage = s.garage || "Unknown";
    if (!acc[garage]) acc[garage] = { count: 0, cost: 0 };
    acc[garage].count++;
    acc[garage].cost += s.amount || 0;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);

  const sortedGarages = Object.entries(garageStats).sort((a, b) => b[1].count - a[1].count);

  // Fleet Health Score (0-100) - updated to include registration only for private vehicles
  const validDocTotal =
    documentStats.insurance.valid +
    documentStats.pollution.valid +
    documentStats.fitness.valid +
    documentStats.roadTax.valid +
    documentStats.registration.valid;

  const docCountTotal = docRows.filter((r) => r.status === "valid" || r.status === "expiring" || r.status === "expired").length;
  const docHealth = docCountTotal > 0 ? (validDocTotal / docCountTotal) * 100 : 100;

  const serviceHealth = totalVehicles > 0
    ? ((serviceStatusCount.ok * 100 + serviceStatusCount.upcoming * 50 + serviceStatusCount.overdue * 0) / totalVehicles)
    : 100;

  const healthScore = totalVehicles > 0 ? Math.round(serviceHealth * 0.4 + docHealth * 0.6) : 0;

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (totalVehicles === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Data Yet</h2>
          <p className="text-gray-500">Add some vehicles to see analytics and insights!</p>
        </div>
      </div>
    );
  }

  const renderServiceDetail = (mode: Exclude<ServiceDetailMode, null>) => {
    const list = mode === "upcoming" ? serviceUpcomingList : serviceOverdueList;
    const title = mode === "upcoming" ? "Service Upcoming" : "Service Overdue";

    return (
      <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">{title}</div>
            <div className="text-xs text-gray-600">Vehicles: {list.length}</div>
          </div>
          <button
            type="button"
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-amber-200 hover:bg-black"
            onClick={() => setServiceDetailMode(null)}
          >
            Close
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr className="border-b">
                <th className="text-left p-3">Vehicle</th>
                <th className="text-left p-3">Reg.</th>
                <th className="text-right p-3">KM Left</th>
                <th className="text-right p-3">Days Left</th>
                <th className="text-left p-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr
                  key={r.id}
                  className="border-b hover:bg-amber-50 cursor-pointer"
                  onClick={() => openVehicle(r.id)}
                  title="Open vehicle"
                >
                  <td className="p-3 font-medium text-gray-900">{r.name}</td>
                  <td className="p-3 font-mono text-gray-600">{r.registrationNumber}</td>
                  <td className="p-3 text-right">
                    <span className={r.kmLeft <= 0 ? "text-red-700 font-semibold" : r.kmLeft <= 500 ? "text-amber-700 font-semibold" : "text-gray-800"}>
                      {formatKmLeft(r.kmLeft)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={r.daysLeft <= 0 ? "text-red-700 font-semibold" : r.daysLeft <= 15 ? "text-amber-700 font-semibold" : "text-gray-800"}>
                      {formatDaysLeft(r.daysLeft)}
                    </span>
                  </td>
                  <td className="p-3 text-gray-700">{r.nextDate ? formatDate(r.nextDate) : "Not set"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDocDetail = (mode: Exclude<DocDetailMode, null>) => {
    const docLabel = DOCS.find((d) => d.key === mode.doc)?.label || mode.doc;
    const list = getDocDetailList;

    return (
      <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">
              {docLabel}: {mode.status === "expiring" ? "Expiring Soon" : "Expired"}
            </div>
            <div className="text-xs text-gray-600">Vehicles: {list.length}</div>
          </div>
          <button
            type="button"
            className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-amber-200 hover:bg-black"
            onClick={() => setDocDetailMode(null)}
          >
            Close
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white">
              <tr className="border-b">
                <th className="text-left p-3">Vehicle</th>
                <th className="text-left p-3">Reg.</th>
                <th className="text-left p-3">Valid Till</th>
                <th className="text-right p-3">Time Left</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr
                  key={`${r.vehicleId}-${r.doc}`}
                  className="border-b hover:bg-amber-50 cursor-pointer"
                  onClick={() => openVehicle(r.vehicleId)}
                  title="Open vehicle"
                >
                  <td className="p-3 font-medium text-gray-900">{r.vehicleName}</td>
                  <td className="p-3 font-mono text-gray-600">{r.registrationNumber}</td>
                  <td className="p-3 text-gray-700">{formatDate(r.validTill)}</td>
                  <td className="p-3 text-right">
                    <span className={r.daysLeft <= 0 ? "text-red-700 font-semibold" : "text-amber-700 font-semibold"}>
                      {formatDaysLeft(r.daysLeft)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Company Header */}
      {companySettings.companyName && (
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
          {companySettings.logo && (
            <img
              src={companySettings.logo}
              alt="Logo"
              className="h-16 w-16 object-contain rounded-lg"
            />
          )}
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: companySettings.primaryColor || "#1e40af" }}
            >
              {companySettings.companyName}
            </h1>
            {companySettings.tagline && (
              <p className="text-gray-500">{companySettings.tagline}</p>
            )}
          </div>
          <div className="ml-auto text-right text-sm text-gray-500">
            <p>📧 {companySettings.email || "-"}</p>
            <p>📞 {companySettings.phone || "-"}</p>
          </div>
        </div>
      )}

      {/* Fleet Health Score */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Fleet Health Score</h2>
            <p className="text-gray-500 text-sm">
              Based on service status and document validity
            </p>
          </div>
          <div
            className={`text-5xl font-bold rounded-full w-24 h-24 flex items-center justify-center ${getHealthColor(
              healthScore
            )}`}
          >
            {healthScore}
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              healthScore >= 80
                ? "bg-green-500"
                : healthScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{totalVehicles}</div>
          <div className="text-blue-100 text-sm">Total Vehicles</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{uniqueMakes.length}</div>
          <div className="text-purple-100 text-sm">Brands</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{uniqueModels.length}</div>
          <div className="text-indigo-100 text-sm">Models</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{safeServiceRecords.length}</div>
          <div className="text-green-100 text-sm">Total Services</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{formatNumber(totalFleetKm)}</div>
          <div className="text-amber-100 text-sm">Total Fleet KM</div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{formatCurrency(totalServiceCost)}</div>
          <div className="text-rose-100 text-sm">Total Spent</div>
        </div>
      </div>

      {/* Service Status & Document Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Service Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-800">🔧 Service Status</h3>
            <div className="text-xs text-gray-500">
              Based on 5,000km/5 months thresholds (or your configured values per vehicle)
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Service OK
              </span>
              <span className="font-bold text-green-600">{serviceStatusCount.ok} vehicles</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Service Upcoming
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-600">{serviceStatusCount.upcoming}</span>
                {serviceStatusCount.upcoming > 0 && (
                  <button
                    type="button"
                    onClick={() => setServiceDetailMode("upcoming")}
                    className="text-xs px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                  >
                    View
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Service Overdue
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-600">{serviceStatusCount.overdue}</span>
                {serviceStatusCount.overdue > 0 && (
                  <button
                    type="button"
                    onClick={() => setServiceDetailMode("overdue")}
                    className="text-xs px-2 py-1 rounded-md bg-red-50 border border-red-200 text-red-800 hover:bg-red-100"
                  >
                    View
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="mt-4 flex rounded-full overflow-hidden h-6">
            {serviceStatusCount.ok > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${(serviceStatusCount.ok / totalVehicles) * 100}%` }}
              >
                {serviceStatusCount.ok}
              </div>
            )}
            {serviceStatusCount.upcoming > 0 && (
              <div
                className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${(serviceStatusCount.upcoming / totalVehicles) * 100}%` }}
              >
                {serviceStatusCount.upcoming}
              </div>
            )}
            {serviceStatusCount.overdue > 0 && (
              <div
                className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${(serviceStatusCount.overdue / totalVehicles) * 100}%` }}
              >
                {serviceStatusCount.overdue}
              </div>
            )}
          </div>

          {serviceDetailMode && renderServiceDetail(serviceDetailMode)}
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-800">📄 Document Status</h3>
            <div className="text-xs text-gray-500">Expiring = within 30 days</div>
          </div>

          <div className="space-y-3">
            {DOCS.map(({ key, label }) => {
              const stats = documentStats[key];
              const canShow = (stats.expired + stats.expiring + stats.valid) > 0;
              if (!canShow) return null;

              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm items-center gap-2">
                    <span className="font-medium">{label}</span>
                    <span className="text-gray-500 flex items-center gap-2">
                      <span className="text-green-600">{stats.valid}✓</span>
                      <span className="text-amber-600">{stats.expiring}⚠</span>
                      <span className="text-red-600">{stats.expired}✗</span>

                      {stats.expiring > 0 && (
                        <button
                          type="button"
                          onClick={() => setDocDetailMode({ doc: key, status: "expiring" })}
                          className="ml-1 text-[11px] px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                        >
                          View expiring
                        </button>
                      )}
                      {stats.expired > 0 && (
                        <button
                          type="button"
                          onClick={() => setDocDetailMode({ doc: key, status: "expired" })}
                          className="text-[11px] px-2 py-1 rounded-md bg-red-50 border border-red-200 text-red-800 hover:bg-red-100"
                        >
                          View expired
                        </button>
                      )}
                    </span>
                  </div>

                  <div className="flex rounded-full overflow-hidden h-2 bg-gray-200">
                    {stats.valid > 0 && (
                      <div
                        className="bg-green-500"
                        style={{ width: `${(stats.valid / totalVehicles) * 100}%` }}
                      />
                    )}
                    {stats.expiring > 0 && (
                      <div
                        className="bg-amber-500"
                        style={{ width: `${(stats.expiring / totalVehicles) * 100}%` }}
                      />
                    )}
                    {stats.expired > 0 && (
                      <div
                        className="bg-red-500"
                        style={{ width: `${(stats.expired / totalVehicles) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {docDetailMode && renderDocDetail(docDetailMode)}
        </div>
      </div>

      {/* Brand & Model Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏭 Brand Distribution</h3>
          <div className="space-y-3">
            {sortedMakes.map(([make, count], idx) => (
              <div key={make} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500">👑</span>}
                    {make}
                  </span>
                  <span className="text-gray-600">
                    {count} vehicles ({Math.round((count / totalVehicles) * 100)}%)
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(count / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏷️ Model Distribution</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedModels.map(([model, count], idx) => (
              <div key={model} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500">⭐</span>}
                    {model}
                  </span>
                  <span className="text-gray-600">{count} units</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full"
                    style={{ width: `${(count / totalVehicles) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Cost Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Service Cost Analysis</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalServiceCost)}
            </div>
            <div className="text-green-700 text-sm">Total Spent</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(avgServiceCost)}
            </div>
            <div className="text-blue-700 text-sm">Avg per Service</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalVehicles > 0 ? totalServiceCost / totalVehicles : 0)}
            </div>
            <div className="text-purple-700 text-sm">Avg per Vehicle</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-2">Vehicle</th>
                <th className="text-left p-2">Registration</th>
                <th className="text-center p-2">Services</th>
                <th className="text-right p-2">Total Cost</th>
                <th className="text-right p-2">Avg Cost</th>
              </tr>
            </thead>
            <tbody>
              {serviceCostPerBike.slice(0, 10).map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{item.bike}</td>
                  <td className="p-2 text-gray-600">{item.registration}</td>
                  <td className="p-2 text-center">{item.serviceCount}</td>
                  <td className="p-2 text-right font-medium">
                    {formatCurrency(item.totalCost)}
                  </td>
                  <td className="p-2 text-right text-gray-600">
                    {formatCurrency(item.avgCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trend & Top Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Monthly Service Trend</h3>
          {sortedMonths.length > 0 ? (
            <div className="space-y-2">
              {sortedMonths.map(([month, data]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-gray-600">{month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full flex items-center justify-end px-2"
                      style={{
                        width: `${Math.min(
                          (data.cost / Math.max(...sortedMonths.map((m) => m[1].cost))) * 100,
                          100
                        )}%`,
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {formatCurrency(data.cost)}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{data.count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No service data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏁 Highest Odometer Readings</h3>
          <div className="space-y-3">
            {highestKmBikes.map((bike, idx) => (
              <div
                key={bike.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    idx === 0
                      ? "bg-amber-500"
                      : idx === 1
                        ? "bg-gray-400"
                        : idx === 2
                          ? "bg-amber-700"
                          : "bg-gray-300"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium">
                    {bike.make} {bike.model}
                  </div>
                  <div className="text-sm text-gray-500">{bike.registrationNumber}</div>
                </div>
                <span className="font-bold text-blue-600">
                  {formatNumber((bike as any).currentKm)} km
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Workshop Analysis</h3>
          {sortedGarages.length > 0 ? (
            <div className="space-y-3">
              {sortedGarages.slice(0, 5).map(([garage, data], idx) => (
                <div
                  key={garage}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500">🏆</span>}
                    <span className="font-medium">{garage}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.count} services • {formatCurrency(data.cost)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No garage data yet</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔄 Most Serviced Vehicles</h3>
          {mostServiced.filter((m) => m.count > 0).length > 0 ? (
            <div className="space-y-3">
              {mostServiced
                .filter((m) => m.count > 0)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{item.bike}</div>
                      <div className="text-sm text-gray-500">{item.registration}</div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                      {item.count} services
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No service data yet</p>
          )}
        </div>
      </div>

      {/* Complete Fleet List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Complete Fleet Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Make</th>
                <th className="text-left p-3">Model</th>
                <th className="text-left p-3">Registration</th>
                <th className="text-right p-3">Current KM</th>
                <th className="text-center p-3">Services</th>
                <th className="text-right p-3">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {motorcycles.map((m, idx) => {
                const bikeServices = safeServiceRecords.filter((s) => s.motorcycleId === m.id);
                const totalSpent = bikeServices.reduce((sum, s) => sum + (s.amount || 0), 0);
                const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
                const currentKm = kmReadings.length > 0
                  ? Math.max(...kmReadings.map((r) => r.kilometers))
                  : (m.currentOdometer ?? m.lastServiceKm ?? 0);

                return (
                  <tr key={m.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{idx + 1}</td>
                    <td className="p-3 font-medium">{m.make}</td>
                    <td className="p-3">{m.model}</td>
                    <td className="p-3 font-mono">{m.registrationNumber}</td>
                    <td className="p-3 text-right">{formatNumber(currentKm)} km</td>
                    <td className="p-3 text-center">{bikeServices.length}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(totalSpent)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={4} className="p-3">TOTAL</td>
                <td className="p-3 text-right">{formatNumber(totalFleetKm)} km</td>
                <td className="p-3 text-center">{safeServiceRecords.length}</td>
                <td className="p-3 text-right">{formatCurrency(totalServiceCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Average Stats */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-lg font-bold mb-4">📊 Fleet Averages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{formatNumber(avgKmPerVehicle)}</div>
            <div className="text-gray-400 text-sm">Avg KM per Vehicle</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{formatCurrency(avgServiceCost)}</div>
            <div className="text-gray-400 text-sm">Avg Service Cost</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {totalVehicles > 0 ? (safeServiceRecords.length / totalVehicles).toFixed(1) : 0}
            </div>
            <div className="text-gray-400 text-sm">Avg Services/Vehicle</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">
              {formatCurrency(totalVehicles > 0 ? totalServiceCost / totalVehicles : 0)}
            </div>
            <div className="text-gray-400 text-sm">Avg Spent/Vehicle</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Updated: {formatDate(safeDateISO(today))}
      </div>
    </div>
  );
};

export default Analytics;
