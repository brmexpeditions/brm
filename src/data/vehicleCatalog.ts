import type { VehicleCategory } from "@/types";

export type VehicleCatalog = Record<VehicleCategory, { makes: string[]; models: Record<string, string[]> }>;

// Curated common India market options (not exhaustive)
export const VEHICLE_CATALOG: VehicleCatalog = {
  bike: {
    makes: [
      "Hero",
      "Honda",
      "TVS",
      "Bajaj",
      "Royal Enfield",
      "Yamaha",
      "Suzuki",
      "KTM",
      "Jawa",
      "Triumph",
      "BMW Motorrad",
    ],
    models: {
      Hero: ["Splendor Plus", "HF Deluxe", "Passion Pro", "Glamour", "Xtreme 160R"],
      Honda: ["Activa 6G", "Shine", "SP125", "Unicorn", "Hornet 2.0", "H'ness CB350"],
      TVS: ["Apache RTR 160", "Apache RTR 200", "Jupiter", "Ntorq 125", "Raider 125"],
      Bajaj: ["Pulsar 125", "Pulsar 150", "Pulsar NS200", "Platina", "Dominar 400"],
      "Royal Enfield": ["Classic 350", "Bullet 350", "Meteor 350", "Hunter 350", "Himalayan"],
      Yamaha: ["FZ-S", "MT-15", "R15 V4", "Fascino", "Ray ZR"],
      Suzuki: ["Access 125", "Burgman Street", "Gixxer 150", "Gixxer SF"],
      KTM: ["Duke 200", "Duke 250", "Duke 390", "RC 200", "Adventure 390"],
      Jawa: ["Jawa 42", "Jawa Standard", "Jawa Perak"],
      Triumph: ["Speed 400", "Scrambler 400 X"],
      "BMW Motorrad": ["G 310 R", "G 310 GS"],
    },
  },
  car: {
    makes: [
      "Maruti Suzuki",
      "Hyundai",
      "Tata",
      "Mahindra",
      "Kia",
      "Toyota",
      "Honda",
      "Renault",
      "Nissan",
      "Skoda",
      "Volkswagen",
      "MG",
      "Jeep",
    ],
    models: {
      "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "WagonR", "Ertiga", "Brezza", "Alto"],
      Hyundai: ["i10 Nios", "i20", "Venue", "Creta", "Verna"],
      Tata: ["Tiago", "Tigor", "Altroz", "Nexon", "Punch", "Harrier", "Safari"],
      Mahindra: ["Bolero", "Scorpio", "Scorpio-N", "XUV700", "Thar"],
      Kia: ["Seltos", "Sonet", "Carens"],
      Toyota: ["Innova Crysta", "Innova Hycross", "Fortuner", "Glanza"],
      Honda: ["Amaze", "City", "Elevate"],
      Renault: ["Kwid", "Triber", "Kiger"],
      Nissan: ["Magnite"],
      Skoda: ["Kushaq", "Slavia"],
      Volkswagen: ["Taigun", "Virtus", "Polo"],
      MG: ["Astor", "Hector"],
      Jeep: ["Compass", "Meridian"],
    },
  },
};

export const normalizeCategory = (cat?: string): VehicleCategory => {
  return cat === "car" ? "car" : "bike";
};
