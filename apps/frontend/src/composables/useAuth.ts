import { ref } from 'vue'

const tokenExists = localStorage.getItem('auth_token') !== null
export const isLoggedIn = ref(tokenExists)

export const setLoginData = (token: string, userInfoString: string) => {
  // Simpan dengan key yang Anda inginkan
  localStorage.setItem('auth_token', token)
  localStorage.setItem('user_info', userInfoString)
  
  // Pemicu reaktivitas Navbar
  isLoggedIn.value = true
}

export const processLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_info')
  isLoggedIn.value = false
}
