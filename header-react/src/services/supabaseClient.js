import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stucqhmldltibnwrykfr.supabase.co";
const supabaseAnonKey = "sb_publishable_2IgcCo2BbICqfZwwWMykLQ_MMYFUvW2";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
