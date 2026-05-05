import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,

  setAuth: (userId, accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userId', userId)
    set({ accessToken })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    set({ user: null, accessToken: null })
  },

  isLoggedIn: () => !!localStorage.getItem('accessToken'),
}))

export default useAuthStore
