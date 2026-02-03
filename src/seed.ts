import { defaultTours } from './Tours'
import { db } from './YOUR_SUPABASE_FILE' 
// example: './lib/supabase' or './services/supabase'

export async function seedTours() {
  console.log("Starting tour seed...");

  for (const tour of defaultTours) {
    const created = await db.createTour(tour);

    if (!created) {
      console.error("Failed to insert:", tour.title);
    } else {
      console.log("Inserted:", tour.title);
    }
  }

  console.log("✅ Seeding complete");
}
