import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oybxpwsjoycqfdiwvyfq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95Ynhwd3Nqb3ljcWZkaXd2eWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI4NjM1NjAsImV4cCI6MjAzODQzOTU2MH0.OCEtNovvDW6-svhXlx99hyZ-Ew4DeWfOmYqt-kJ0Ltw'

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signInWithGoogle = async (navigate) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
      return;
    }

    console.log('Google sign-in successful:', data);

    // Wait for the profile creation before redirecting
    if (data.user) {
      await insertProfile(data.user);
    }

    // Redirect or handle after profile insertion
    // navigate('/home'); // Example redirect, modify as needed
  } catch (err) {
    console.error('Error during Google sign-in:', err);
  }
};

const insertProfile = async (user) => {
  const { id, email, user_metadata } = user;
  console.log("user data", user);

  const full_name = user_metadata?.full_name || '';

  try {
    const { error: profileError } = await supabase.from('profiles').upsert([
      {
        id,
        full_name,
        email,
      }
    ]);

    if (profileError) {
      console.error('Error inserting profile:', profileError.message);
    } else {
      console.log('Profile created successfully');
      // navigate('/onboard');
    }
  } catch (error) {
    console.error('Error during profile insertion:', error);
  }
};


  

