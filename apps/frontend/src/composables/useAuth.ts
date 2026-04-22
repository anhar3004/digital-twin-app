import { ref } from 'vue'

// Cek apakah ada token/user di localStorage saat aplikasi pertama dibuka
// Sesuaikan 'token' dengan nama key yang Anda gunakan saat login
const tokenExists = localStorage.getItem('token') !== null

// ref() ini yang membuatnya reaktif dan bisa bereaksi di semua halaman!
export const isLoggedIn = ref(tokenExists)

export const setLoginData = (token: string, userId: string) => {
  // 1. Simpan ke localStorage
  localStorage.setItem('token', token)
  localStorage.setItem('userId', userId)
  // 2. Ubah state global (ini yang memicu Navbar berubah)
  isLoggedIn.value = true
}

export const processLogout = () => {
  // 1. Hapus dari localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  // 2. Ubah state global
  isLoggedIn.value = false
}
