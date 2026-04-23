<template>
  <!-- <Navbar /> -->
  <div class="product-page bg-light min-vh-100 pb-5">
    <div class="py-5 custom-bg-dark text-white mb-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="fw-bold">Daftar Unit & Aset Anda</h2>
            <p class="text-white-50">Kelola dan pantau status garansi serta performa Digital Twin unit Anda.</p>
          </div>
          <div class="col-md-4 text-md-end">
            <span class="badge bg-light text-dark p-2 px-3 rounded-pill fw-bold">
              Total: {{ filteredProducts.length }} Unit
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row g-3 mb-4">
        <div class="col-md-8">
          <div class="input-group shadow-sm">
            <span class="input-group-text bg-white border-end-0">
              <i class="bi bi-search"></i>
            </span>
            <input v-model="searchQuery" type="text" class="form-control border-start-0 ps-0"
              placeholder="Cari berdasarkan Nama atau Serial Number (e.g. TG-2024)...">
          </div>
        </div>
        <div class="col-md-4">
          <select v-model="statusFilter" class="form-select shadow-sm" aria-label="Filter berdasarkan status garansi">
            <option value="All">Semua Status Garansi</option>
            <option value="Aktif">Garansi Aktif</option>
            <option value="Expired">Garansi Habis</option>
          </select>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="product in filteredProducts" :key="product.id" class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm product-card">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="product-icon bg-light rounded d-flex align-items-center justify-content-center p-1"
                  style="width: 100px; height: 100px; overflow: hidden;">

                  <img v-if="product.image" :src="getImageUrl(product.image)" :alt="product.name"
                    class="w-100 h-100 rounded" style="object-fit: cover;">

                  <i v-else class="bi bi-box-seam fs-1 text-primary"></i>
                </div>

                <span :class="['badge', getStatusClass(product.warrantyStatus)]">
                  {{ product.warrantyStatus }}
                </span>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 class="card-title h5 fw-bold mb-1">{{ product.name }}</h5>
                  <p class="text-muted small mb-0">
                    S/N: <span class="fw-medium text-dark">{{ product.serialNumber }}</span>
                  </p>
                </div>

                <div class="bg-white p-2 rounded border d-flex align-items-center justify-content-center shadow-sm"
                  style="width: 80px; height: 80px;" title="Scan untuk detail unit">
                  <qrcode-vue :value="getDetailUrl(product.serialNumber)" :size="60" />
                </div>
              </div>
              <hr class="my-3 opacity-25">

              <div class="d-flex justify-content-between small mb-2">
                <span class="text-muted">Sisa Garansi:</span>
                <span class="fw-bold">{{ getWarrantyText(product.warrantyExpiry) }}</span>
              </div>
              <div class="d-flex justify-content-between small mb-2">
                <span class="text-muted">Berakhir Pada:</span>
                <span class="fw-bold">{{ dayjs(product.warrantyExpiry).format('DD MMMM YYYY') }}</span>
              </div>
              <!-- <div class="d-flex justify-content-between small mb-4">
                <span class="text-muted">Update Terakhir:</span>
                <span>{{ product.lastUpdate }}</span>
              </div> -->

              <div class="d-grid gap-2">
                <router-link :to="'/products/' + product.serialNumber" class="btn btn-outline-success btn-sm fw-bold ">
                  Detail Unit
                </router-link>
                <button @click="toggleServiceRequest(product.id)" :class="[
                  'btn btn-sm fw-bold px-4 rounded-pill transition-all',
                  product.serviceStatus ? 'btn-danger' : 'btn-primary'
                ]">
                  <i :class="['bi me-1', product.serviceStatus ? 'bi-x-circle' : 'bi-tools']"></i>
                  {{ product.serviceStatus ? 'Batalkan Request' : 'Request Service' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredProducts.length === 0" class="col-12 text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="mt-2 text-muted">Tidak ada unit yang ditemukan dengan kriteria tersebut.</p>
        </div>
      </div>
    </div>
  </div>
  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { getImageUrl } from '@/utils/image';
import QrcodeVue from 'qrcode.vue'

// State Management
const route = useRoute()
// const products = ref<any[]>([]);
const loading = ref(true);
const errorMessage = ref('');
const searchQuery = ref('');
const statusFilter = ref('All');

interface Product {
  id: string;
  name: string;
  serialNumber: string;
  warrantyStatus: string;
  status: string;
  serviceStatus: boolean;
  warrantyExpiry: string;
  image: string;
}

const product = ref<Product[]>([]);

useHead({
  // Gunakan kata kunci target (Katalog / Daftar)
  title: 'Katalog Unit & Showcase Industri | Holicindo',

  meta: [
    {
      name: 'description',
      content: 'Jelajahi berbagai pilihan infrastruktur pendingin premium dari Holicindo. Temukan showcase industri terbaik buatan Indonesia untuk kebutuhan komersial Anda.'
    },
    // Open Graph untuk share di sosmed/chat
    { property: 'og:title', content: 'Katalog Unit & Showcase Industri | Holicindo' },
    { property: 'og:description', content: 'Jelajahi berbagai pilihan infrastruktur pendingin premium dari Holicindo.' },
    { property: 'og:type', content: 'website' } // Bukan 'product', karena ini katalog
  ],

  // Schema Markup untuk halaman Daftar (Katalog)
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Katalog Showcase Industri Holicindo",
        "description": "Daftar unit infrastruktur pendingin premium",
        "itemListElement": [
          // Anda bisa mengisi ini secara dinamis jika mau,
          // atau membiarkannya sederhana dengan 2-3 contoh.
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Unit HC-2026",
            "url": "https://domain.com/unit/hc-2026-001"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Unit HC-2027",
            "url": "https://domain.com/unit/hc-2027-002"
          }
        ]
      })
    }
  ]
})

const getDetailUrl = (serialNumber: string) => {
  return `${window.location.origin}/products/${serialNumber}`;
};

const getWarrantyText = (expiryDate: string | Date) => {
  if (!expiryDate) return 'Tidak Ada Data';

  // .startOf('day') akan memaksa waktu menjadi 00:00:00
  const now = dayjs().startOf('day');
  const expiry = dayjs(expiryDate).startOf('day');

  // Jika tanggal hari ini sudah melewati atau sama dengan tanggal expired
  if (expiry.isBefore(now)) {
    return 'Habis';
  }

  if (expiry.isSame(now)) {
    return 'Hari ini';
  }

  // 1. Hitung selisih bulan
  const months = expiry.diff(now, 'month');

  // 2. Tambahkan selisih bulan ke 'now' untuk mencari sisa hari
  const relativeNow = now.add(months, 'month');
  const days = expiry.diff(relativeNow, 'day');

  // 3. Susun teks output
  let result = '';
  if (months > 0) result += `${months} Bulan `;
  if (days > 0) result += `${days} Hari`;

  return result.trim();
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const id = route.params.id;
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });


    if (!response.ok) throw new Error('Gagal mengambil data');

    const data = await response.json();

    // 2. Simpan ke 'product.value' (bukan products)
    product.value = data;

    console.log("Data Produk Berhasil Dimuat:", product.value);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    loading.value = false;
  }
};

const toggleServiceRequest = async (productId: string) => {
  // 1. Cari produk yang spesifik di dalam array
  const targetProduct = product.value.find(p => p.id === productId);
  if (!targetProduct) return;

  // Cek jika ingin membatalkan
  if (targetProduct.serviceStatus && !confirm("Yakin ingin membatalkan permintaan service?")) {
    return;
  }

  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}/service`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();

      // Simpan status lama untuk menentukan pesan alert
      const wasRequested = targetProduct.serviceStatus;

      // 2. Update status di UI
      targetProduct.serviceStatus = data.serviceStatus;

      // 3. Tampilkan Alert Spesifik
      if (data.serviceStatus) {
        alert(`Berhasil! Permintaan service untuk unit ${targetProduct.serialNumber} telah dikirim.`);
      } else {
        alert(`Permintaan service untuk unit ${targetProduct.serialNumber} telah dibatalkan.`);
      }
    } else {
      alert("Gagal memproses permintaan. Silakan coba lagi.");
    }
  } catch (err) {
    console.error("Gagal update service:", err);
    alert("Terjadi kesalahan koneksi ke server.");
  }
};

// Panggil fungsi secara otomatis saat halaman dibuka
onMounted(() => {
  fetchProducts();
});

// Logika Filtering (Disesuaikan dengan field database Anda)
const filteredProducts = computed(() => {
  // Tambahkan ?. dan || []
  return (product.value || []).filter((p: any) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.serialNumber.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesStatus = statusFilter.value === 'All' || p.warrantyStatus === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

// Warna Badge Berdasarkan Status (Disesuaikan jika perlu)
const getStatusClass = (status: string) => {
  if (status === 'Aktif') return 'bg-success';
  if (status === 'Expired') return 'bg-danger';
  if (status === 'Maintenance') return 'bg-warning text-dark';
  return 'bg-secondary';
};
</script>

<style scoped>
.custom-bg-dark {
  background-color: #0b1f38;
}

.bg-accent {
  background-color: #deff9a;
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 15px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.product-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #082f49;
  border: none;
}

.btn-primary:hover {
  background-color: #1a3a5f;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Efek hover agar lebih interaktif */
.btn-danger:hover {
  background-color: #bb2d3b;
  transform: scale(1.05);
}

.btn-primary:hover {
  transform: scale(1.05);
}
</style>
