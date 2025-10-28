import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      checkAuth: async () => {
        try {
          const response = await fetch('https://backend.youware.com/__user_info__');
          const result = await response.json();

          if (result.code === 0) {
            const { encrypted_yw_id, photo_url, display_name } = result.data;
            
            if (encrypted_yw_id) {
              // Get user data from our backend
              const userResponse = await fetch('https://backend.youware.com/api/auth/user-info');
              const userData = await userResponse.json();
              
              if (userData.success && userData.user) {
                set({ 
                  user: userData.user, 
                  isAuthenticated: true, 
                  isLoading: false 
                });
              } else {
                // Create new user if doesn't exist
                const newUser = {
                  encrypted_yw_id,
                  display_name: display_name || 'User',
                  photo_url,
                  role: 'student',
                  is_online: false
                };
                
                set({ 
                  user: newUser, 
                  isAuthenticated: true, 
                  isLoading: false 
                });
              }
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: (user) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);