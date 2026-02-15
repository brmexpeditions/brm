import { useState } from "react";
import Layout from "@/components/Layout";

type Bike = {
  id: number;
  name: string;
  brand: string;
  image: string;
  description: string;
  engineCapacity: string;
  power: string;
  torque: string;
  weight: string;
  seatHeight: string;
  topSpeed: string;
  rentalPrice: number;
};

const bikes: Bike[] = [
  {
    id: 1,
    name: "KTM 390 Adventure 2025",
    brand: "KTM",
    image: "https://azwecdnepstoragewebsiteuploads.azureedge.net/PHO_BIKE_90_RE_390-adventure-orange-2024-hero.png",
    description:
      "The KTM 390 Adventure 2025 is built for Nepal bike tours and high-altitude Himalayan rides.",
    engineCapacity: "399cc",
    power: "45 bhp",
    torque: "39 Nm",
    weight: "177 kg",
    seatHeight: "855 mm",
    topSpeed: "170 km/h",
    rentalPrice: 35,
  },
  {
    id: 2,
    name: "Royal Enfield Himalayan 411",
    brand: "Royal Enfield",
    image: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/himalayan/gallery/himalayan-gallery-1.jpg",
    description:
      "The Himalayan 411 is a proven adventure motorcycle perfect for rugged Nepal terrain.",
    engineCapacity: "411cc",
    power: "24.3 bhp",
    torque: "32 Nm",
    weight: "199 kg",
    seatHeight: "800 mm",
    topSpeed: "140 km/h",
    rentalPrice: 28,
  },
  {
    id: 3,
    name: "Royal Enfield Himalayan 450",
    brand: "Royal Enfield",
    image: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/himalayan-450/gallery/himalayan-450-gallery-1.jpg",
    description:
      "The new Himalayan 450 offers improved performance for serious mountain expeditions.",
    engineCapacity: "452cc",
    power: "40 bhp",
    torque: "40 Nm",
    weight: "196 kg",
    seatHeight: "825 mm",
    topSpeed: "160 km/h",
    rentalPrice: 40,
  },
  {
    id: 4,
    name: "Triumph Scrambler 400X",
    brand: "Triumph",
    image: "https://www.triumphmotorcycles.in/content/dam/triumph/motorcycles/scrambler-400-x/my24/images/gallery/scrambler-400-x-gallery-1.jpg",
    description:
      "A lightweight scrambler perfect for mixed terrain and scenic Nepal bike tours.",
    engineCapacity: "398cc",
    power: "40 PS",
    torque: "37.5 Nm",
    weight: "179 kg",
    seatHeight: "835 mm",
    topSpeed: "160 km/h",
    rentalPrice: 38,
  },
  {
    id: 5,
    name: "Royal Enfield Hunter 350",
    brand: "Royal Enfield",
    image: "https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/hunter-350/gallery/hunter-350-gallery-1.jpg",
    description:
      "A stylish and lightweight road-focused motorcycle ideal for city rides and smooth highways.",
    engineCapacity: "349cc",
    power: "20.2 bhp",
    torque: "27 Nm",
    weight: "181 kg",
    seatHeight: "800 mm",
    topSpeed: "130 km/h",
    rentalPrice: 22,
  },
];

export default function Bikes() {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">
          Our Bike Fleet
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {bikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
              onClick={() => setSelectedBike(bike)}
            >
              <img
                src={bike.image}
                alt={bike.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {bike.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {bike.description}
                </p>
                <div className="text-lg font-bold text-amber-600">
                  ${bike.rentalPrice} / day
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bike Detail Modal */}
      {selectedBike && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedBike(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedBike.name}
                </h2>
                <button
                  onClick={() => setSelectedBike(null)}
                  className="text-gray-400 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedBike.image}
                alt={selectedBike.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />

              <p className="text-gray-600 mb-6">
                {selectedBike.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Engine:</strong> {selectedBike.engineCapacity}</div>
                <div><strong>Power:</strong> {selectedBike.power}</div>
                <div><strong>Torque:</strong> {selectedBike.torque}</div>
                <div><strong>Weight:</strong> {selectedBike.weight}</div>
                <div><strong>Seat Height:</strong> {selectedBike.seatHeight}</div>
                <div><strong>Top Speed:</strong> {selectedBike.topSpeed}</div>
              </div>

              <div className="mt-6">
                <div className="text-2xl font-bold text-amber-600">
                  ${selectedBike.rentalPrice} / day
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
