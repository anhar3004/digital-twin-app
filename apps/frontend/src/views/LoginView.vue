<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <div class="card shadow-lg border-0 login-card">
      <div class="card-body p-5">

        <div class="text-center mb-4">
          <div class="brand-icon mb-3 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor"
              class="bi bi-shield-lock-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 2.861-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915V10a.5.5 0 0 1-1 0V7.915A1.5 1.5 0 0 1 8 5" />
            </svg>
          </div>
          <h3 class="fw-bold text-dark">Akses Portal</h3>
          <p class="text-muted">Masukkan kredensial untuk memverifikasi unit</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="userId" class="form-label fw-semibold">User ID</label>
            <input v-model="loginData.userId" type="text" class="form-control form-control-lg custom-input" id="userId"
              placeholder="Masukkan ID Anda" required>
          </div>

          <div class="mb-4">
            <label for="password" class="form-label fw-semibold">Password</label>
            <input v-model="loginData.password" type="password" class="form-control form-control-lg custom-input"
              id="password" placeholder="••••••••" required>
          </div>

          <div v-if="errorMessage" class="alert alert-danger py-2 mb-3 shadow-sm border-0"
            style="border-radius: 10px; font-size: 0.9rem;">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
          </div>

          <button type="submit"
            class="btn btn-primary btn-lg w-100 fw-bold shadow-sm d-flex align-items-center justify-content-center"
            :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ loading ? 'Memverifikasi...' : 'Masuk Sekarang' }}
          </button>
        </form>

        <div class="text-center mt-4">
          <small class="text-muted">
            Lupa akses? <a href="#" class="text-decoration-none text-primary">Hubungi IT Support</a>
          </small>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const loginData = reactive({
  userId: '',
  password: ''
});

const handleLogin = async () => {
  // Reset state
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: loginData.userId,
        password: loginData.password
      })
    });

    const result = await response.json();

    if (!response.ok) {
      // Jika backend mengirim error (misal: user tidak ditemukan)
      throw new Error(result.error || 'Terjadi kesalahan saat login');
    }

    // SIMPAN DATA KE STORAGE
    localStorage.setItem('auth_token', result.token);
    localStorage.setItem('user_info', JSON.stringify(result.user));

    console.log('Login Berhasil:', result.user.name);

    // UBAH BARIS INI: Arahkan ke halaman product
    router.push('/products');

  } catch (err: any) {
    errorMessage.value = err.message;
    console.error('Login Error:', err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Latar belakang gelap agar kontras dengan kartu login */
.login-container {
  min-height: 100vh;
  background-color: #0b1f38;
  background-image: radial-gradient(circle at 10% 20%, rgba(222, 255, 154, 0.03) 0%, transparent 40%);
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px;
}

.brand-icon {
  width: 70px;
  height: 70px;
  background-color: #deff9a;
  color: #0b1f38;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-input {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.custom-input:focus {
  border-color: #0b1f38;
  box-shadow: 0 0 0 0.25rem rgba(11, 31, 56, 0.1);
}

.btn-primary {
  background-color: #0b1f38;
  border: none;
  border-radius: 12px;
  padding: 12px;
}

.btn-primary:hover {
  background-color: #1a3a5f;
  transform: translateY(-1px);
}
</style>
