# Panduan ALFA STORE

---

## 1. Struktur Folder Project

```
noir-store/
├── index.html       → Halaman utama website
├── style.css        → Semua styling / tampilan
├── app.js           → Logika, data, fitur admin
└── PANDUAN.md       → File ini
```

Cukup 3 file. Tidak perlu framework, tidak perlu install apapun.

---

## 2. Koneksi Google Spreadsheet

### Langkah 1 — Buat Google Spreadsheet

Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru.

Buat **3 sheet** dengan nama persis:
- `PRODUK`
- `TRANSAKSI`  
- `STOK`

### Langkah 2 — Isi Header Sheet PRODUK

Di baris pertama Sheet **PRODUK**, isi kolom ini berurutan:

```
A          B      C          D       E       F      G        H      I        J           K
id | nama | kategori | gambar | ukuran | merk | kondisi | harga | status | deskripsi | tanggal
```

Di baris pertama Sheet **TRANSAKSI**, isi header ini:

```
A         B             C     D            E         F     G       H        I      J         K
tanggal | nama_pembeli | hp | nama_produk | kategori | merk | ukuran | kondisi | harga | catatan | status
```

> Sheet ini akan terisi otomatis setiap kali pembeli submit form pesanan (butuh Apps Script aktif).

Contoh isi data:
```
1 | Kemeja Oversize | baju | https://... | M,L,XL | NOIR | Baru | Rp 185.000 | tersedia | Kemeja premium... | 2025-06-01
```

> Kolom `kategori` isi: `baju` atau `celana` (huruf kecil)  
> Kolom `status` isi: `tersedia` atau `sold` (huruf kecil)  
> Kolom `gambar` isi URL gambar publik (Google Drive, Imgur, dll)

### Langkah 3 — Publish Sheet ke CSV

1. Buka Google Spreadsheet kamu
2. Klik **File** → **Share** → **Publish to web**
3. Pilih sheet **PRODUK**
4. Pilih format **Comma-separated values (.csv)**
5. Klik **Publish** → **OK**
6. Copy link yang muncul

Link akan terlihat seperti ini:
```
https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX/pub?gid=0&single=true&output=csv
```

### Langkah 4 — Pasang Link di app.js

Buka file `app.js`, cari baris ini di bagian atas:

```js
sheetURL: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?gid=0&single=true&output=csv",
```

Ganti dengan link CSV yang kamu copy tadi:

```js
sheetURL: "https://docs.google.com/spreadsheets/d/XXXXXXXXXXXX/pub?gid=0&single=true&output=csv",
```

### Langkah 5 — Ganti Nomor WhatsApp

Masih di `app.js`, cari:

```js
waNumber: "628xxxxxxxxxx",
```

Ganti dengan nomor WA admin (format internasional, tanpa + dan tanpa spasi):

```js
waNumber: "6281234567890",
```

### Langkah 6 — Ganti Password Admin

```js
adminPassword: "admin123"
```

Ganti dengan password yang kamu inginkan.

---

### Cara Upload Gambar Produk (Google Drive)

1. Upload foto ke Google Drive
2. Klik kanan foto → **Share** → ubah ke **Anyone with the link**
3. Copy link, ambil ID-nya:  
   `https://drive.google.com/file/d/FILE_ID/view`
4. Ubah jadi format ini untuk dipakai di kolom gambar:  
   `https://drive.google.com/uc?export=view&id=FILE_ID`

---

### Opsional — Google Apps Script (Catat Transaksi Otomatis)

Jika ingin setiap klik "Ambil" tercatat di sheet TRANSAKSI:

1. Buka Spreadsheet → **Extensions** → **Apps Script**
2. Hapus kode yang ada, paste ini:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TRANSAKSI");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.tanggal,   // A: Tanggal & jam pesan
    data.nama,      // B: Nama produk
    data.kategori,  // C: Baju / Celana
    data.merk,      // D: Merk
    data.ukuran,    // E: Ukuran yang dipilih
    data.kondisi,   // F: Baru / Bekas
    data.harga,     // G: Harga
    "keluar"        // H: Status
  ]);
  return ContentService.createTextOutput("success");
}
```

3. Klik **Deploy** → **New deployment** → pilih type **Web app**
4. Execute as: **Me** | Who has access: **Anyone**
5. Klik **Deploy** → copy URL yang muncul
6. Paste URL ke `app.js`:

```js
scriptURL: "https://script.google.com/macros/s/XXXXX/exec",
```

---

## 3. Cara Deploy (Publish Website)

### Opsi A — GitHub Pages (Gratis, Paling Mudah)

1. Buat akun di [github.com](https://github.com)
2. Klik **New repository** → beri nama misal `noir-store`
3. Upload 3 file: `index.html`, `style.css`, `app.js`
4. Masuk ke **Settings** → **Pages**
5. Source: pilih **main branch** → **/ (root)** → **Save**
6. Website live di:  
   `https://username.github.io/noir-store`

> Gratis selamanya, update cukup edit file di GitHub.

---

### Opsi B — Netlify (Gratis, Drag & Drop)

1. Buka [netlify.com](https://netlify.com) → daftar gratis
2. Drag & drop folder project ke halaman Netlify
3. Website langsung live dengan URL seperti:  
   `https://nama-random.netlify.app`
4. Bisa custom domain sendiri

---

### Opsi C — Vercel (Gratis)

1. Buka [vercel.com](https://vercel.com) → login dengan GitHub
2. Klik **New Project** → import repo GitHub kamu
3. Klik **Deploy** → selesai
4. URL: `https://noir-store.vercel.app`

---

### Opsi D — Hosting Lokal (Test di HP/Laptop)

Cukup buka file `index.html` langsung di browser.  
Atau pakai ekstensi **Live Server** di VS Code.

> Catatan: Fitur fetch Google Sheet mungkin tidak jalan di `file://` karena CORS.  
> Gunakan Live Server atau deploy ke salah satu opsi di atas.

---

## 4. Cara Update Produk (Setelah Deploy)

Karena data diambil dari Google Spreadsheet:

- **Tambah produk** → tambah baris baru di Sheet PRODUK
- **Hapus produk** → hapus baris di Sheet PRODUK  
- **Ubah status** → edit kolom `status` jadi `sold` atau `tersedia`
- **Website otomatis update** saat di-refresh (data live dari sheet)

Atau gunakan **Panel Admin** di website (klik ⚙ Admin di navbar) untuk edit langsung — perubahan tersimpan di localStorage browser.

---

## 5. Ringkasan Konfigurasi app.js

```js
const CONFIG = {
  sheetURL:       "LINK_CSV_SHEET_KAMU",   // wajib diisi
  waNumber:       "6281234567890",          // nomor WA admin
  storeName:      "ALFA STORE",             // nama toko
  instagram:      "@nama_instagram",        // akun instagram
  scriptURL:      "",                       // opsional (Apps Script)
  adminPassword:  "passwordkamu"            // password panel admin
};
```
