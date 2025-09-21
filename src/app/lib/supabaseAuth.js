import { supabase } from "./supabase";

// You'll need to create this function to get user profile from Supabase
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
};

export const handleGitHubLogin = async () => {
  try {
    // Sign in with GitHub OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Note: After OAuth redirect, you'll handle the user creation in your callback route
    // This function will redirect to GitHub, so we return success here
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// You'll need this function in your auth callback route (pages/auth/callback.js or app/auth/callback/route.js)
export const handleOAuthCallback = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: false, error: error?.message || 'No user found' };
  }

  const userDetails = await getUserProfile(user.id);

  // If the user profile doesn't exist, create one
  if (!userDetails) {
    const newUserProfile = await createUserProfile(user);
    return { success: true, userDetails: newUserProfile };
  }

  return { success: true, userDetails };
};

export const handleLogin = async (prevstate, queryData) => {
  const email = queryData.get('email');
  const password = queryData.get('password');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, message: "Invalid email or password. Please try again." };
      }
      return { success: false, message: "An unexpected error occurred. Please try again later." };
    }

    const userDetails = await getUserProfile(data.user.id);
    return { success: true, userDetails };
  } catch (error) {
    return { success: false, message: "An unexpected error occurred. Please try again later." };
  }
};

export async function handleRegister(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  // Check if passwords match
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, message: 'Your account is already registered. Please try to login' };
      }
      return { success: false, message: "An unexpected error occurred. Please try again later." };
    }

    // Create user profile after successful registration
    if (data.user) {
      const userDetails = await createUserProfile(data.user);
      return { success: true, userDetails };
    }

    return { success: false, message: "Registration failed. Please try again." };
  } catch (error) {
    return { success: false, message: "An unexpected error occurred. Please try again later." };
  }
}

// Function to create a new user document in Supabase
export const createUserProfile = async (userAuth, additionalData = {}) => {
  if (!userAuth) return null;

  // Define the user data structure
  const userProfileData = {
    id: userAuth.id, // Supabase uses 'id' instead of 'uid'
    uid: userAuth.id,
    username: userAuth.user_metadata?.full_name || userAuth.user_metadata?.name || null,
    email: userAuth.email,
    avatar: userAuth.user_metadata?.avatar_url || userAuth.user_metadata?.picture || null,
    bio: '',
    isOnline: true,
    lastSeen: new Date().toISOString(),
    friends: [],
    stats: {
      quizzesTaken: 0,
      battlesWon: 0,
      streak: 0,
    },
    achievements: [],
    created_at: new Date().toISOString(),
    ...additionalData,
  };

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(userProfileData, { 
        onConflict: 'uid',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};

// Helper function to sign out
export const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Helper function to get current session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};