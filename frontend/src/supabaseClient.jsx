import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oybxpwsjoycqfdiwvyfq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynhwd3Nqb3ljcWZkaXd2eWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NjM1NjAsImV4cCI6MjAzODQzOTU2MH0.OCEtNovvDW6-svhXlx99hyZ-Ew4DeWfOmYqt-kJ0Ltw'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
  
      if (error) {
        console.error('Google sign-in error:', error.message);
      } else {
        console.log('Google sign-in successful:', data);
  
        // Insert profile data after successful sign-in
        await insertProfile(data.user);
      }
    } catch (err) {
      console.error('Error during Google sign-in:', err);
    }
  }
  
  // Function to insert the user's profile data
  const insertProfile = async (user) => {
    const { id, email, user_metadata } = user;
    const full_name = user_metadata?.full_name || ''; // Retrieve user's full name from OAuth metadata if available
  
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id,
        full_name,  // Insert full name from Google OAuth
        email,      // Insert email from Google OAuth
      }
    ]);
  
    if (profileError) {
      console.error('Error inserting profile:', profileError.message);
    } else {
      console.log('Profile created successfully');
    }
  }
  

