import React from "react";

const HelpCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h1 className="text-2xl font-semibold text-gray-900">Help</h1>
        <p className="text-sm text-gray-600 mt-1">
          Quick guide for using the Fleet Manager.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">1) Add a vehicle</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>
            Go to <strong>Fleet</strong> tab → click <strong>Add Motorcycle</strong>.
          </li>
          <li>
            Step 1: Choose <strong>Bike</strong> or <strong>Car</strong>, then select <strong>Make</strong> and <strong>Model</strong>.
          </li>
          <li>
            Enter <strong>Registration</strong>, optional <strong>Chassis</strong>/<strong>Engine</strong>, and your <strong>Current Odometer</strong>.
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">2) Documents (Private vs Commercial)</h2>
        <p className="text-sm text-gray-700 mt-2">
          In Step 2, select <strong>Private</strong> or <strong>Commercial</strong>.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>
            <strong>Private:</strong> Registration Validity, Insurance, Pollution
          </li>
          <li>
            <strong>Commercial:</strong> Insurance, Pollution, Fitness, Road Tax
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">3) Service intervals & alerts</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>
            Default service rule is <strong>5 months OR 5000 km</strong> (whichever comes first).
          </li>
          <li>
            Dashboard will show <strong>Overdue</strong> / <strong>Upcoming</strong> alerts automatically.
          </li>
          <li>
            Use the search bar + filters in <strong>Fleet Overview</strong> to find vehicles quickly.
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">4) Service Records</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>
            Go to <strong>Service</strong> tab → <strong>Add Service Record</strong>.
          </li>
          <li>
            Fill: date, odometer, work done, amount, garage, parts, notes.
          </li>
          <li>
            Use the search and bike filter to find old services.
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">5) Backup & Restore</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>
            Go to <strong>Settings</strong> → <strong>Data Backup &amp; Security</strong>.
          </li>
          <li>
            Use <strong>Download Backup</strong> to save a JSON file.
          </li>
          <li>
            Use <strong>Restore Backup</strong> to import it later.
          </li>
        </ul>
        <div
          className="mt-3 rounded-xl p-3 text-sm"
          style={{
            backgroundColor: "rgba(212,175,55,0.10)",
            border: "1px solid rgba(212,175,55,0.22)",
          }}
        >
          Tip: Keep backups in Google Drive/Email/USB so you can recover anytime.
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900">Troubleshooting</h2>
        <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
          <li>
            If data doesn’t appear after login, confirm you’re logging into the same account.
          </li>
          <li>
            If a browser blocks storage (incognito/private restrictions), backups are recommended.
          </li>
          <li>
            If something looks wrong after an update, restore using your backup JSON.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpCenter;
