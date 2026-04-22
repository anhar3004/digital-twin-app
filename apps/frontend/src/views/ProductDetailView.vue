<template>
  <!-- <Navbar /> -->

  <div v-if="loading" class="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
    <div class="spinner-border text-primary mb-3"></div>
    <p class="text-muted">Mengambil detail unit...</p>
  </div>

  <div v-else-if="error" class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="alert alert-danger shadow-sm rounded-4 p-4">
      <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ error }}
      <hr>
      <router-link to="/products" class="btn btn-outline-danger btn-sm">Kembali ke Daftar</router-link>
    </div>
  </div>

  <div v-else-if="product" class="detail-page bg-light min-vh-100 pb-5 pt-4">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm overflow-hidden rounded-4">
            <div class="product-image-container bg-white d-flex align-items-center justify-content-center p-4">
              <img
                :src="getImageUrl(product.image) || 'https://i0.wp.com/www.holicindo.com/wp-content/uploads/2020/11/Spiral-Mixer-6-kg.jpg?fit=1906%2C1270&ssl=1'"
                :alt="product.name" class="img-fluid rounded object-fit-contain h-100">
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h2 class="fw-bold mb-1">{{ product.name }}</h2>
                <p class="text-muted mb-0">Serial Number: <span class="fw-medium text-dark">{{ product.serialNumber
                    }}</span></p>
                <small class="text-muted">Model ID: {{ product.modelId }}</small>
              </div>
              <span
                :class="['badge rounded-pill px-3 py-2', product.status === 'Expired' ? 'bg-danger' : 'bg-success']">
                {{ product.status }}
              </span>
            </div>

            <div class="mt-3 text-end">
              <span class="badge bg-success-subtle text-success border border-success-subtle p-2 px-3 rounded-3">
                <i class="bi bi-shield-check me-1"></i> Sisa Garansi: {{ getWarrantyText(product.warrantyExpiry) }}
              </span>
              <div class="mb-1">
                <small class="text-muted fw-medium">
                  <i class="bi bi-calendar-event me-1"></i>
                  Berakhir pada: {{ dayjs(product.warrantyExpiry).format('DD MMMM YYYY') }}
                </small>
              </div>
            </div>
            <div class="row mt-4 g-3">
              <div class="col-6 col-md-3">
                <div class="p-3 border rounded-3 bg-white">
                  <small class="text-muted d-block">Tahun Produksi</small>
                  <span class="fw-bold">{{ product.tahunPembuatan }}</span>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="p-3 border rounded-3 bg-white">
                  <small class="text-muted d-block">Lokasi Unit</small>
                  <span class="fw-bold">{{ product.lokasi }}</span>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="p-3 border rounded-3 bg-white">
                  <small class="text-muted d-block">Suhu Operasi</small>
                  <span class="fw-bold text-primary">{{ product.temperature }}°C</span>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="p-3 border rounded-3 bg-white">
                  <small class="text-muted d-block">Kapasitas</small>
                  <span class="fw-bold">{{ product.kapasitas }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div class="card-header bg-white py-3 border-bottom">
              <h5 class="fw-bold mb-0"><i class="bi bi-list-stars me-2 text-primary"></i>Spesifikasi Teknik</h5>
            </div>
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <tbody class="border-top-0">
                  <tr>
                    <td class="ps-4 fw-medium text-muted" width="40%">Tipe Kompresor</td>
                    <td class="fw-semibold">{{ product.tipeKompresor }}</td>
                  </tr>
                  <tr>
                    <td class="ps-4 fw-medium text-muted">Sistem Pendingin</td>
                    <td class="fw-semibold">{{ product.sistemPendingin }}</td>
                  </tr>
                  <tr>
                    <td class="ps-4 fw-medium text-muted">Material Bodi</td>
                    <td class="fw-semibold">{{ product.materialBody }}</td>
                  </tr>
                  <tr>
                    <td class="ps-4 fw-medium text-muted">Spesifikasi Kaca</td>
                    <td class="fw-semibold">{{ product.spesifikasiKaca }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import dayjs from 'dayjs';
import { getImageUrl } from '@/utils/image';

const route = useRoute();
const product = ref<any>(null);


// --- IMPLEMENTASI SEO TEKNIS (TUGAS 4) ---
useHead({
  // Kriteria SEO: Showcase Industri Indonesia
  title: computed(() =>
    product.value
      ? `${product.value.serialNumber} | Showcase Industri Indonesia`
      : 'Memuat Unit... | Holicindo'
  ),
  meta: [
    {
      name: 'description',
      // Kriteria SEO: Infrastruktur Pendingin Premium
      content: computed(() =>
        product.value
          ? `Unit ${product.value.name}. Infrastruktur Pendingin Premium dari Holicindo.`
          : 'Infrastruktur Pendingin Premium Holicindo.'
      )
    },
    // --- TAMBAHAN: Open Graph (OG) Tags untuk Social Media & Chat Sharing ---
    {
      property: 'og:title',
      content: computed(() =>
        product.value
          ? `${product.value.serialNumber} | Showcase Industri Indonesia`
          : 'Holicindo'
      )
    },
    {
      property: 'og:description',
      content: computed(() =>
        product.value
          ? `Unit ${product.value.name}. Infrastruktur Pendingin Premium dari Holicindo.`
          : 'Infrastruktur Pendingin Premium Holicindo.'
      )
    },
    {
      property: 'og:type',
      content: 'product'
    },
    {
      property: 'og:image',
      // Asumsi Anda memiliki properti imageUrl di objek product Anda
      content: computed(() => product.value?.imageUrl || 'https://domain.com/default-showcase.jpg')
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      // --- PENYEMPURNAAN: Melengkapi Schema Product ---
      innerHTML: computed(() => JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.value?.name || 'Unit Holicindo',
        "description": product.value
            ? `Unit ${product.value.name}. Infrastruktur Pendingin Premium dari Holicindo.`
            : 'Infrastruktur Pendingin Premium Holicindo.',
        "image": product.value?.imageUrl || 'https://domain.com/default-showcase.jpg',
        "brand": {
            "@type": "Brand",
            "name": "Holicindo"
        },
        "sku": product.value?.serialNumber,
        // Block Offers sangat direkomendasikan Google agar schema valid
        "offers": {
          "@type": "Offer",
          "url": typeof window !== 'undefined' ? window.location.href : `https://domain.com/unit/${product.value?.serialNumber}`,
          "priceCurrency": "IDR",
          // Anda bisa menyesuaikan logic InStock/OutOfStock jika ada statusnya di backend
          "availability": "https://schema.org/InStock"
        }
      }))
    }
  ]
})

const loading = ref(true);
const error = ref('');

// --- LOGIKA BISNIS ---
const getWarrantyText = (date: string) => {
  if (!date) return '-';
  const now = dayjs().startOf('day');
  const expiry = dayjs(date).startOf('day');
  if (expiry.isBefore(now)) return 'Habis';

  const months = expiry.diff(now, 'month');
  const relativeNow = now.add(months, 'month');
  const days = expiry.diff(relativeNow, 'day');

  let text = '';
  if (months > 0) text += `${months} Bulan `;
  if (days > 0) text += `${days} Hari`;
  return text.trim() || 'Hari Ini';
};

const fetchProductDetail = async () => {
  loading.value = true;
  error.value = ''; // Reset error sebelum fetch
  try {
    const serialNumber = route.params.serialNumber;
    const token = localStorage.getItem('auth_token');

    // Gunakan URL yang fleksibel (opsional: gunakan import.meta.env.VITE_API_URL)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${serialNumber}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error('Unit tidak ditemukan atau akses ditolak');
      throw new Error('Gagal memuat data dari server');
    }

    product.value = await response.json();
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductDetail();
});
</script>

<style scoped>
.product-image-container {
  height: 450px;
  /* Sedikit lebih tinggi untuk kesan premium */
  background-color: #f8f9fa;
}

.product-image-container img {
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-image-container:hover img {
  transform: scale(1.05);
}

.badge {
  font-weight: 600;
  letter-spacing: 0.3px;
}

.table td {
  padding: 1rem 0.75rem;
  border-color: #f1f1f1;
}

/* Animasi sederhana saat data muncul */
.detail-page {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
