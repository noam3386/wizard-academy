import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wsmpyiozoxmyxebyhnou.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzbXB5aW96b3hteXhlYnlobm91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTIzNjIsImV4cCI6MjA4ODU2ODM2Mn0.jlEs9CFBZ4AO1vz3VA_Glx3Mo9y3kD-9iXJN35TY8nE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
