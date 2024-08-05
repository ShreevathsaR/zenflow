
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oybxpwsjoycqfdiwvyfq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynhwd3Nqb3ljcWZkaXd2eWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NjM1NjAsImV4cCI6MjAzODQzOTU2MH0.OCEtNovvDW6-svhXlx99hyZ-Ew4DeWfOmYqt-kJ0Ltw'

export const supabase = createClient(supabaseUrl, supabaseKey)