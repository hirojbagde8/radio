// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xoknmtireuecqobavxxo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva25tdGlyZXVlY3FvYmF2eHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQ5NTQsImV4cCI6MjA2NjI4MDk1NH0.hiI1eXo1HzAbzIc0-3C6DLcXifAG4tqmDN82m-UzasM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);