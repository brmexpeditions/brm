export async function fetchTours() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tours:", error.message);
    return [];
  }

  return data;
}
