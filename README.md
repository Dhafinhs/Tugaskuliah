

# Kelompok 13

## Anggota

#### Dhafin Hamizan Setiawan (2306267145)

#### Rafi Naufal Aryaputra (2306250680)

#### Daffa Bagus Dhiananto (2306250756)

#### Samih Bassam (2306250623)

## Pembagian Tugas

| Nama                      | Tugas             |
| ------------------------- | ----------------- |
| **Samih Bassam**          | Backend, Frontend |
| **Dhafin Hamizan**        | Backend           |
| **Rafi Naufal**           | Docker            |
| **Daffa Bagus Dhiananto** | Frontend          |

---

# Web Review Tempat & Kuliner

Aplikasi web full-stack untuk menampilkan dan mengelola ulasan tempat dan kuliner dengan struktur data fleksibel. Setiap review bisa berisi rating, komentar, dan foto, serta mendukung pencarian cepat berdasarkan lokasi dan rating. Backend dibangun dengan Node.js dan MongoDB, serta seluruh aplikasi dapat dijalankan menggunakan Docker.

## 🔥 Fitur Unggulan

* Review dengan format dinamis (foto, teks, rating)
* Query cepat berdasarkan lokasi atau rating
* Penyimpanan data menggunakan **MongoDB Atlas** (NoSQL)
* Arsitektur berbasis **Docker** untuk kemudahan pengembangan dan deployment

## 🗂️ Struktur Proyek

```
Tugaskuliah/
├── Backend/           # Node.js + Express API terhubung ke MongoDB
├── frontend/          # Antarmuka pengguna (HTML, CSS, JS)
├── Dockerfile         # Konfigurasi Docker untuk membungkus aplikasi
└── README.md
```

## 🧰 Teknologi yang Digunakan

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (via MongoDB Atlas)
* **ORM**: Mongoose
* **Containerization**: Docker

## 🚀 Cara Menjalankan Proyek

### 1. Jalankan Secara Lokal (Tanpa Docker)

#### Backend

```bash
cd Backend
npm install
npm start
```

#### Frontend

Buka langsung `index.html` dalam folder `frontend/` di browser, atau gunakan ekstensi **Live Server** di VS Code.

---

### 2. Jalankan dengan Docker

#### Build dan Run Container:

```bash
docker build -t web-review .  
docker run -p 3000:3000 --env-file ./Backend/.env web-review
```

Aplikasi dapat diakses pada: `http://localhost:3000`

---

## 📦 Contoh Struktur Data Review

```json
{
  "placeName": "Bakso Pak Kumis",
  "location": "Bandung",
  "rating": 4.2,
  "reviewText": "Kuahnya segar dan dagingnya banyak!",
  "images": [
    "https://imgur.com/bakso1.jpg",
    "https://imgur.com/bakso2.jpg"
  ],
  "createdAt": "2025-06-07T12:00:00Z"
}
```

---

## 🛠 Rencana Pengembangan

* Login pengguna (JWT)
* Upload gambar ke Cloudinary
* Rating sistem berbintang
* Integrasi Maps untuk lokasi

---
