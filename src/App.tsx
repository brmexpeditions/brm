import { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { ServiceHistory } from "./components/ServiceHistory";
import Analytics from "./components/Analytics";
import CompanySettings from "./components/CompanySettings";
import AuthScreen from "./components/AuthScreen";
import HelpCenter from "./components/HelpCenter";
import ExcelImportExport from "./components/ExcelImportExport";
import {
  IconChart,
  IconFleet,
  IconHelp,
  IconLogout,
  IconSettings,
  IconWrench,
} from "./components/ui/Icons";
import type {
  CompanySettings as CompanySettingsType,
  Motorcycle,
  ServiceRecord,
} from "./types";
import { useSupabaseFleet } from "@/hooks/useSupabaseFleet";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface User {
  id: string;
  username: string;
  email: string;
  companyName: string;
  phone: string;
}

interface AppData {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  savedMakes: string[];
  savedModels: { [make: string]: string[] };
  companySettings: CompanySettingsType;
  lastBackup?: string;
}

const defaultData: AppData = {
  motorcycles: [],
  serviceRecords: [],
  savedMakes: [
    "Honda",
    "Yamaha",
    "Suzuki",
    "Royal Enfield",
    "Bajaj",
    "TVS",
    "KTM",
    "Hero",
  ],
  savedModels: {
    Honda: ["Activa 6G", "Shine", "Unicorn", "CB350", "Hornet"],
    Yamaha: ["FZ", "R15", "MT15", "Fascino", "Ray ZR"],
    Suzuki: ["Access", "Gixxer", "Burgman"],
    "Royal Enfield": ["Classic 350", "Bullet 350", "Meteor", "Hunter 350"],
    Bajaj: ["Pulsar", "Avenger", "Dominar", "Platina"],
    TVS: ["Apache", "Jupiter", "Ntorq", "Raider"],
    KTM: ["Duke 200", "Duke 390", "RC 200", "Adventure 390"],
    Hero: ["Splendor", "HF Deluxe", "Passion", "Glamour"],
  },
  companySettings: {
    companyName: "",
    tagline: "",
    logo: "",
    email: "",
    phone: "",
    alternatePhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    businessRegNumber: "",
    // Default theme: Golden + Black
    primaryColor: "#D4AF37",
    secondaryColor: "#0B0B0B",
  },
};

function App() {
  // Data store (Supabase + local cache fallback)
  // If Supabase env vars are configured, data is stored per-user in Supabase table: fleet_store
  // Otherwise, the hook falls back to localStorage on this device.
  const { data, setData } = useSupabaseFleet(defaultData);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<
    "fleet" | "service" | "analytics" | "settings" | "help"
  >("fleet");
  const [isBootLoading, setIsBootLoading] = useState(true);

  // Restore session on mount.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) Local session (fast path)
        const savedUser = localStorage.getItem("fleet_current_user");
        if (savedUser) {
          const user = JSON.parse(savedUser) as User;
          if (!cancelled) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
          return;
        }

        // 2) Supabase session (if configured)
        if (isSupabaseConfigured() && supabase) {
          const { data: sessData, error } = await supabase.auth.getSession();
          if (error) throw error;

          const u = sessData.session?.user;
          if (u) {
            const restored: User = {
              id: u.id,
              username: (u.email || "user").split("@")[0],
              email: u.email || "",
              companyName: (u.user_metadata as any)?.companyName || "",
              phone: (u.user_metadata as any)?.phone || "",
            };

            localStorage.setItem("fleet_current_user", JSON.stringify(restored));

            if (!cancelled) {
              setCurrentUser(restored);
              setIsAuthenticated(true);
            }
          }
        }
      } catch (e) {
        console.error("Error restoring session:", e);
      } finally {
        if (!cancelled) setIsBootLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // ignore
    }
    localStorage.removeItem("fleet_current_user");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // --------------------
  // Data mutation helpers
  // --------------------

  const handleAddBike = (bike: Motorcycle) => {
    setData((prev) => ({
      ...prev,
      motorcycles: [...(Array.isArray(prev.motorcycles) ? prev.motorcycles : []), bike],
    }));
  };

  const handleUpdateBike = (updatedBike: Motorcycle) => {
    setData((prev) => ({
      ...prev,
      motorcycles: (Array.isArray(prev.motorcycles) ? prev.motorcycles : []).map((b) =>
        b.id === updatedBike.id ? updatedBike : b
      ),
    }));
  };

  const handleDeleteBike = (bikeId: string) => {
    setData((prev) => ({
      ...prev,
      motorcycles: (Array.isArray(prev.motorcycles) ? prev.motorcycles : []).filter(
        (b) => b.id !== bikeId
      ),
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).filter(
        (r) => r.motorcycleId !== bikeId
      ),
    }));
  };

  const handleAddMake = (make: string) => {
    const trimmed = make.trim();
    if (!trimmed) return;

    setData((prev) => {
      const existing = Array.isArray(prev.savedMakes) ? prev.savedMakes : [];
      if (existing.includes(trimmed)) return prev;
      return { ...prev, savedMakes: [...existing, trimmed] };
    });
  };

  const handleAddModel = (make: string, model: string) => {
    const mk = make.trim();
    const md = model.trim();
    if (!mk || !md) return;

    setData((prev) => {
      const current = prev.savedModels?.[mk] || [];
      if (current.includes(md)) return prev;
      return {
        ...prev,
        savedModels: {
          ...(prev.savedModels || {}),
          [mk]: [...current, md],
        },
      };
    });
  };

  const handleAddServiceRecord = (record: ServiceRecord) => {
    setData((prev) => ({
      ...prev,
      serviceRecords: [...(Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []), record],
    }));
  };

  const handleUpdateServiceRecord = (record: ServiceRecord) => {
    setData((prev) => ({
      ...prev,
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).map((r) =>
        r.id === record.id ? record : r
      ),
    }));
  };

  const handleDeleteServiceRecord = (recordId: string) => {
    setData((prev) => ({
      ...prev,
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).filter(
        (r) => r.id !== recordId
      ),
    }));
  };

  const handleUpdateSettings = (settings: CompanySettingsType) => {
    setData((prev) => ({ ...prev, companySettings: settings }));
  };

  const handleRestoreData = (restoredData: AppData) => {
    setData(() => ({
      ...defaultData,
      ...restoredData,
      motorcycles: Array.isArray(restoredData.motorcycles) ? restoredData.motorcycles : [],
      serviceRecords: Array.isArray(restoredData.serviceRecords)
        ? restoredData.serviceRecords
        : [],
    }));
  };

  const handleApplyExcelImport = (
    payload: { vehicles: Motorcycle[]; serviceRecords: ServiceRecord[] },
    mode: "merge" | "replace"
  ) => {
    setData((prev) => {
      const prevVehicles = Array.isArray(prev.motorcycles) ? prev.motorcycles : [];
      const prevServices = Array.isArray(prev.serviceRecords) ? prev.serviceRecords : [];

      const importedVehicles = Array.isArray(payload.vehicles) ? payload.vehicles : [];
      const importedServices = Array.isArray(payload.serviceRecords)
        ? payload.serviceRecords
        : [];

      // Build maps for matching
      const prevById = new Map(prevVehicles.map((v) => [v.id, v] as const));
      const prevByReg = new Map(
        prevVehicles.map((v) => [v.registrationNumber.toUpperCase(), v] as const)
      );

      const nextVehicles: Motorcycle[] = [];

      if (mode === "replace") {
        nextVehicles.push(...importedVehicles);
      } else {
        // merge: update existing by id or registrationNumber, else add
        const usedPrevIds = new Set<string>();

        for (const imp of importedVehicles) {
          const reg = imp.registrationNumber.toUpperCase();
          const existing = prevById.get(imp.id) || prevByReg.get(reg);

          if (existing) {
            usedPrevIds.add(existing.id);
            nextVehicles.push({
              ...existing,
              ...imp,
              id: existing.id,
              createdAt: existing.createdAt || imp.createdAt,
              kmReadings: Array.isArray(imp.kmReadings) && imp.kmReadings.length > 0
                ? imp.kmReadings
                : (Array.isArray(existing.kmReadings) ? existing.kmReadings : []),
            });
          } else {
            nextVehicles.push(imp);
          }
        }

        // keep vehicles not mentioned in import
        for (const v of prevVehicles) {
          if (!usedPrevIds.has(v.id) && !importedVehicles.some((iv) => iv.id === v.id || iv.registrationNumber.toUpperCase() === v.registrationNumber.toUpperCase())) {
            nextVehicles.push(v);
          }
        }
      }

      const nextVehicleIds = new Set(nextVehicles.map((v) => v.id));
      const nextRegToId = new Map(nextVehicles.map((v) => [v.registrationNumber.toUpperCase(), v.id] as const));

      const normalizeServiceVehicleId = (raw: string) => {
        const key = raw.toUpperCase();
        return nextVehicleIds.has(raw) ? raw : (nextRegToId.get(key) || raw);
      };

      const normalizedImportedServices = importedServices.map((s) => ({
        ...s,
        motorcycleId: normalizeServiceVehicleId(s.motorcycleId),
      }));

      let nextServices: ServiceRecord[] = [];
      if (mode === "replace") {
        nextServices = normalizedImportedServices;
      } else {
        const prevSvcById = new Map(prevServices.map((s) => [s.id, s] as const));
        const merged: ServiceRecord[] = [];

        for (const imp of normalizedImportedServices) {
          const existing = prevSvcById.get(imp.id);
          if (existing) merged.push({ ...existing, ...imp, id: existing.id });
          else merged.push(imp);
        }

        // keep old records not updated
        for (const s of prevServices) {
          if (!merged.some((m) => m.id === s.id)) merged.push(s);
        }

        nextServices = merged;
      }

      // Update saved make/model lists from vehicles
      const makes = Array.isArray(prev.savedMakes) ? prev.savedMakes : [];
      const models = prev.savedModels || {};

      const nextMakes = new Set(makes);
      const nextModels: Record<string, string[]> = { ...models };

      for (const v of nextVehicles) {
        if (v.make) nextMakes.add(v.make);
        if (v.make && v.model) {
          const list = nextModels[v.make] || [];
          if (!list.includes(v.model)) nextModels[v.make] = [...list, v.model];
        }
      }

      return {
        ...prev,
        motorcycles: nextVehicles,
        serviceRecords: nextServices,
        savedMakes: Array.from(nextMakes).sort((a, b) => a.localeCompare(b)),
        savedModels: Object.fromEntries(
          Object.entries(nextModels).map(([mk, list]) => [
            mk,
            Array.from(new Set(list)).sort((a, b) => a.localeCompare(b)),
          ])
        ),
      };
    });
  };

  if (isBootLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🏍️</div>
          <p className="text-xl">Loading Fleet Manager...</p>
        </div>
      </div>
    );
  }

  // Auth gate
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} companySettings={data.companySettings} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="text-white shadow-lg sticky top-0 z-40"
        style={{
          background: `linear-gradient(90deg, ${data.companySettings.secondaryColor || "#0B0B0B"} 0%, #111827 45%, ${data.companySettings.secondaryColor || "#0B0B0B"} 100%)`,
          borderBottom: `1px solid rgba(212, 175, 55, 0.25)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.companySettings.logo ? (
                <img
                  src={data.companySettings.logo}
                  alt="Logo"
                  className="w-10 h-10 rounded-full bg-white p-1"
                />
              ) : (
                <span className="text-3xl">🏍️</span>
              )}
              <div>
                <h1 className="text-xl font-bold">
                  {data.companySettings.companyName || "Fleet Manager"}
                </h1>
                <p
                  className="text-xs hidden sm:block"
                  style={{ color: "rgba(253, 230, 138, 0.85)" }}
                >
                  {data.companySettings.tagline || "Vehicle Fleet Management"}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{currentUser?.username}</p>
                <p
                  className="text-xs"
                  style={{ color: "rgba(253, 230, 138, 0.75)" }}
                >
                  {currentUser?.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                style={{
                  backgroundColor: "rgba(212, 175, 55, 0.12)",
                  border: "1px solid rgba(212, 175, 55, 0.35)",
                  color: "#FDE68A",
                }}
              >
                <IconLogout className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav
        className="shadow-md sticky top-[60px] z-30 overflow-x-auto"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,11,11,0.96) 0%, rgba(17,17,17,0.96) 100%)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.22)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex min-w-max">
            {([
              { id: "fleet", label: "Fleet", Icon: IconFleet },
              { id: "service", label: "Service", Icon: IconWrench },
              { id: "analytics", label: "Analytics", Icon: IconChart },
              { id: "settings", label: "Settings", Icon: IconSettings },
              { id: "help", label: "Help", Icon: IconHelp },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? "text-amber-200"
                    : "text-gray-300 hover:text-amber-100"
                }`}
                style={{
                  borderBottomColor:
                    activeTab === tab.id
                      ? "rgba(212,175,55,0.95)"
                      : "transparent",
                  background:
                    activeTab === tab.id
                      ? "rgba(212,175,55,0.10)"
                      : "transparent",
                }}
              >
                <tab.Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "fleet" && (
          <Dashboard
            motorcycles={data.motorcycles}
            makes={data.savedMakes}
            models={data.savedModels}
            onAddBike={handleAddBike}
            onUpdateBike={handleUpdateBike}
            onDeleteBike={handleDeleteBike}
            onAddMake={handleAddMake}
            onAddModel={handleAddModel}
          />
        )}

        {activeTab === "service" && (
          <ServiceHistory
            motorcycles={data.motorcycles}
            serviceRecords={data.serviceRecords}
            onAddServiceRecord={handleAddServiceRecord}
            onUpdateServiceRecord={handleUpdateServiceRecord}
            onDeleteServiceRecord={handleDeleteServiceRecord}
            onUpdateBike={handleUpdateBike}
          />
        )}

        {activeTab === "analytics" && (
          <Analytics
            motorcycles={data.motorcycles}
            serviceRecords={data.serviceRecords}
            companySettings={data.companySettings}
            onOpenVehicle={(vehicleId) => {
              setActiveTab("fleet");
              // Let Dashboard open the vehicle detail view
              window.dispatchEvent(
                new CustomEvent("fleet:openVehicle", {
                  detail: { vehicleId },
                })
              );
            }}
          />
        )}

        {activeTab === "help" && <HelpCenter />}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <CompanySettings settings={data.companySettings} onUpdate={handleUpdateSettings} />

            <ExcelImportExport
              existingVehicles={data.motorcycles}
              existingServiceRecords={data.serviceRecords}
              onApplyImport={handleApplyExcelImport}
            />

            {/* Data Backup Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                💾 Data Backup & Security
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Vehicles</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {data.motorcycles.length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Service Records</p>
                  <p className="text-2xl font-bold text-green-800">
                    {data.serviceRecords.length}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const exportData = {
                      ...data,
                      exportDate: new Date().toISOString(),
                      version: "1.0",
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `fleet-backup-${new Date().toISOString().split("T")[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);

                    setData((prev) => ({ ...prev, lastBackup: new Date().toISOString() }));
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  📥 Download Backup
                </button>

                <label className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-2">
                  📤 Restore Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const restored = JSON.parse(event.target?.result as string);
                          if (
                            window.confirm(
                              "This will replace all current data. Are you sure?"
                            )
                          ) {
                            handleRestoreData(restored);
                            alert("Data restored successfully!");
                          }
                        } catch {
                          alert("Invalid backup file");
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>

              {data.lastBackup && (
                <p className="mt-4 text-sm text-gray-500">
                  Last backup: {new Date(data.lastBackup).toLocaleString()}
                </p>
              )}

              <div
                className="mt-6 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.22)",
                }}
              >
                <p className="text-sm text-gray-800">
                  <strong>Storage mode:</strong>{" "}
                  {isSupabaseConfigured()
                    ? "Supabase Cloud (per-user) + local cache"
                    : "Local only (on this device/browser)"}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {isSupabaseConfigured()
                    ? "If you face issues, confirm your Supabase table (fleet_store) and RLS policies are set." 
                    : "To keep data safe, download backups regularly."}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                👤 Account Information
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{currentUser?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{currentUser?.companyName || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 mt-8" style={{ borderTop: "1px solid rgba(212,175,55,0.20)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2024 {data.companySettings.companyName || "Fleet Manager"}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
