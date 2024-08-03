import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwpvfhirmuktiuhvqjel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3cHZmaGlybXVrdGl1aHZxamVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2NjUwMzksImV4cCI6MjAzODI0MTAzOX0.0U-Q60t29rTA8nfA-tS9TPxZMnmkDu3KDjs8ZVKcCdU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
