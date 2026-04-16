// ===== KONFIGURASI =====
const CONFIG = {
  sheetURL: "https://script.google.com/macros/s/AKfycbxJy11EQXBByYj9KbJR_dnu6t2sYCyUwhLLMqn5fSERYKu1FZ8F9RMQm1DxwAr_dZBXcg/exec",
  waNumber: "",
  storeName: "ALFA STORE",
  scriptURL: "https://script.google.com/macros/s/AKfycbxJy11EQXBByYj9KbJR_dnu6t2sYCyUwhLLMqn5fSERYKu1FZ8F9RMQm1DxwAr_dZBXcg/exec",
  adminPassword: "admin123"
};

// ===== STATE =====
let allProducts = [];
let filteredProducts = [];
let activeFilters = { search: "", kategori: "", kondisi: "", status: "" };
let currentProduct = null;
let isAdminLoggedIn = false;
let editingId = null;
let logoClickCount = 0, logoClickTimer = null;

// ===== SAMPLE DATA =====
const SAMPLE_DATA = [
  { id:"1", nama:"AIRism Polo Shirt UNIQLO", kategori:"baju", gambar:"images/produk1.jpg", ukuran:"S, M, L, XL, XXL", merk:"UNIQLO", kondisi:"Baru", harga:"Rp 175.000", status:"tersedia", deskripsi:"Polo shirt AIRism edisi 2022 dari UNIQLO. Teknologi AIRism membuat bahan terasa sejuk dan ringan sepanjang hari.", tanggal:"2026-06-01" },
  { id:"2", nama:"Celana Pendek Jeans", kategori:"celana", gambar:"images/produk2.jpg", ukuran:"S, M, L, XL, XXL", merk:"Local Brand", kondisi:"Baru", harga:"Rp 95.000", status:"tersedia", deskripsi:"Celana pendek jeans premium bahan denim. Cocok untuk tampilan casual sehari-hari.", tanggal:"2025-06-02" },
  { id:"3", nama:"Longsleeve Stripe OOTDSUPPLY", kategori:"baju", gambar:"images/produk3.jpg", ukuran:"S, M, L, XL", merk:"OOTDSUPPLY", kondisi:"Baru", harga:"Rp 160.000", status:"tersedia", deskripsi:"Kaos longsleeve boxy double stripe Monte Dark Army dari OOTDSUPPLY. Oversize fit dengan kerah polo.", tanggal:"2025-06-03" },
  { id:"4", nama:"Kemeja Abercrombie & Fitch", kategori:"baju", gambar:"images/produk4.jpg", ukuran:"S, M, L, XL", merk:"Abercrombie & Fitch", kondisi:"Baru", harga:"Rp 185.000", status:"tersedia", deskripsi:"Kemeja premium Abercrombie & Fitch, authentic American clothing. Bahan berkualitas tinggi.", tanggal:"2025-06-04" },
  { id:"5", nama:"Baggy Jeans 90s Blue", kategori:"celana", gambar:"images/produk5.jpg", ukuran:"30, 32, 34, 36, 38, 40", merk:"Vintage 90s", kondisi:"Baru", harga:"Rp 195.000", status:"tersedia", deskripsi:"Celana baggy jeans 90s warna biru ukuran regular 40W. Potongan longgar cocok untuk tampilan retro.", tanggal:"2025-06-05" },
  { id:"6", nama:"Baggy Jeans Grey Balenciaga", kategori:"celana", gambar:"images/produk6.jpg", ukuran:"28, 30, 32, 34", merk:"Balenciaga", kondisi:"Baru", harga:"Rp 350.000", status:"tersedia", deskripsi:"Celana baggy jeans warna grey dari Balenciaga. Potongan longgar modern.", tanggal:"2025-06-06" },
  { id:"7", nama:"Kaos Fashion H&M", kategori:"baju", gambar:"images/produk7.jpg", ukuran:"S, M, L, XL", merk:"H&M", kondisi:"Baru", harga:"Rp 120.000", status:"tersedia", deskripsi:"Kaos fashion H&M top quality dengan harga terjangkau. Bahan cotton lembut.", tanggal:"2025-06-07" },
  { id:"8", nama:"Jersey Polo Sadsmile", kategori:"baju", gambar:"images/produk8.jpg", ukuran:"S, M, L, XL", merk:"Sadsmile", kondisi:"Baru", harga:"Rp 135.000", status:"tersedia", deskripsi:"Jersey polo shirt dari Sadsmile. Bahan jersey berkualitas, desain sporty casual.", tanggal:"2025-06-08" },
  { id:"9", nama:"Wide Leg Sweatpants Aelfric Eden", kategori:"celana", gambar:"images/produk9.jpg", ukuran:"S, M, L, XL", merk:"Aelfric Eden", kondisi:"Baru", harga:"Rp 220.000", status:"tersedia", deskripsi:"Celana sweatpants wide leg dari Aelfric Eden. Desain oversized modern, nyaman untuk streetwear.", tanggal:"2025-06-09" },
  { id:"10", nama:"Flannel Shirt Bloods Timberos", kategori:"baju", gambar:"images/produk10.jpg", ukuran:"S, M, L, XL", merk:"Bloods", kondisi:"Baru", harga:"Rp 145.000", status:"tersedia", deskripsi:"Kemeja flannel Bloods seri Timberos warna grey black. Bahan tebal hangat.", tanggal:"2025-06-10" }
];

const EMOJI = { baju:"👕", celana:"👖", default:"🛍️" };


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const DATA_VERSION = "v5-clean";
  if (localStorage.getItem("noirstore_version") !== DATA_VERSION) {
    localStorage.removeItem("noirstore_products");
    localStorage.setItem("noirstore_version", DATA_VERSION);
  }
  loadProducts();
  window.addEventListener("scroll", () => {
    document.getElementById("navbar")?.classList.toggle("scrolled", window.scrollY > 20);
  });
  document.getElementById("navLogo")?.addEventListener("click", () => {
    logoClickCount++;
    clearTimeout(logoClickTimer);
    if (logoClickCount >= 5) { logoClickCount = 0; showAdminLogin(); }
    logoClickTimer = setTimeout(() => { logoClickCount = 0; }, 2000);
  });
});

// ===== LOAD PRODUK =====
async function loadProducts() {
  showLoading(true);
  const localData = localStorage.getItem("noirstore_products");
  if (localData) {
    try { allProducts = JSON.parse(localData); } catch(e) { allProducts = []; }
  }
  if (allProducts.length === 0) allProducts = [...SAMPLE_DATA];
  initApp();
  showLoading(false);
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];tuk nomor handphone wa ke nomor ini 
  return lines.slice(1).map(line => {
    const col = parseCSVLine(line);
    return { id:col[0]?.trim()||"", nama:col[1]?.trim()||"", kategori:col[2]?.trim().toLowerCase()||"", gambar:col[3]?.trim()||"", ukuran:col[4]?.trim()||"", merk:col[5]?.trim()||"", kondisi:col[6]?.trim()||"", harga:col[7]?.trim()||"", status:col[8]?.trim().toLowerCase()||"tersedia", deskripsi:col[9]?.trim()||"", tanggal:col[10]?.trim()||"" };
  }).filter(p => p.nama);
}

function parseCSVLine(line) {
  const result = []; let current = ""; let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ""; }
    else { current += ch; }
  }
  result.push(current); return result;
}

function saveLocal() { localStorage.setItem("noirstore_products", JSON.stringify(allProducts)); }

function initApp() {
  filteredProducts = [...allProducts];
  renderProducts("productGrid", filteredProducts);
  renderProducts("productGridAll", filteredProducts);
  updateStats();
}


// ===== RENDER PRODUK =====
function renderProducts(gridId, products) {
  const grid = document.getElementById(gridId);
  const emptyId = gridId === "productGrid" ? "emptyState" : "emptyStateAll";
  const empty = document.getElementById(emptyId);
  if (!grid) return;
  if (products.length === 0) { grid.innerHTML = ""; if (empty) empty.style.display = "block"; return; }
  if (empty) empty.style.display = "none";
  grid.innerHTML = products.map((p, i) => createCardHTML(p, i)).join("");
}

function createCardHTML(p, i) {
  const isSold = p.status === "sold" || p.status === "sold out";
  const isNew = isNewProduct(p.tanggal);
  const emoji = EMOJI[p.kategori] || EMOJI.default;
  const imgHTML = p.gambar
    ? `<img src="${p.gambar}" alt="${p.nama}" loading="lazy" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;color:transparent" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="card-img-placeholder" style="display:none">${emoji}</div>`
    : `<div class="card-img-placeholder">${emoji}</div>`;
  const soldOverlay = isSold ? `<div class="sold-overlay"><div class="sold-overlay-text">SOLD OUT</div><div class="sold-overlay-sub">Produk tidak tersedia</div></div>` : "";
  const badge = (!isSold && isNew) ? `<span class="card-badge badge-new">NEW</span>` : "";
  const footerBtn = isSold
    ? `<button class="card-ambil sold-btn" disabled>✕ Sold Out</button>`
    : `<button class="card-ambil" onclick="event.stopPropagation(); ambilProduk('${p.id}')">Ambil</button>`;
  return `
    <div class="product-card ${isSold ? 'is-sold' : ''}" style="animation-delay:${i * 0.04}s" onclick="${isSold ? '' : `openModal('${p.id}')`}">
      <div class="card-img-wrap">${imgHTML}${soldOverlay}${badge}</div>
      <div class="card-body">
        <div class="card-merk">${p.merk || "—"}</div>
        <div class="card-name">${p.nama}</div>
        <div class="card-meta"><span class="card-tag">📏 ${p.ukuran || "—"}</span><span class="card-tag">${p.kondisi || "—"}</span></div>
        <div class="card-footer"><span class="card-price">${p.harga}</span>${footerBtn}</div>
      </div>
    </div>`;
}

// ===== MODAL DETAIL =====
function openModal(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  const isSold = p.status === "sold" || p.status === "sold out";
  const emoji = EMOJI[p.kategori] || EMOJI.default;
  const imgHTML = p.gambar
    ? `<img src="${p.gambar}" alt="${p.nama}" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;color:transparent" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="modal-img-placeholder" style="display:none">${emoji}</div>`
    : `<div class="modal-img-placeholder">${emoji}</div>`;
  const soldOverlay = isSold ? `<div class="modal-sold-overlay"><div class="modal-sold-text">SOLD OUT</div></div>` : "";
  document.getElementById("modalBody").innerHTML = `
    <div class="modal-img-wrap">${imgHTML}${soldOverlay}</div>
    <div class="modal-info" id="modalCaptureArea">
      <div class="modal-merk">${p.merk || "—"}</div>
      <h2 class="modal-name">${p.nama}</h2>
      <div class="modal-price">${p.harga}</div>
      <div class="modal-tags">
        <span class="modal-tag">📏 ${p.ukuran || "—"}</span>
        <span class="modal-tag">🏷️ ${p.kondisi || "—"}</span>
        <span class="modal-tag">${p.kategori === "baju" ? "👕" : "👖"} ${p.kategori || "—"}</span>
      </div>
      <span class="modal-status-badge ${isSold ? "status-sold" : "status-tersedia"}">${isSold ? "● Sold Out" : "● Tersedia"}</span>
      <p class="modal-desc">${p.deskripsi || "Tidak ada deskripsi."}</p>
      <button class="btn-ambil" onclick="ambilProduk('${p.id}')" ${isSold ? "disabled" : ""}>${isSold ? "✕ Produk Sudah Terjual" : "👉 Ambil Produk Ini"}</button>
    </div>`;
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(e) { if (e.target === document.getElementById("modalOverlay")) closeModalDirect(); }
function closeModalDirect() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  currentProduct = null;
}


// ===== TOMBOL AMBIL → CHECKOUT =====
async function ambilProduk(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  closeModalDirect();
  const emoji = EMOJI[p.kategori] || EMOJI.default;
  const imgHTML = p.gambar ? `<div class="co-img"><img src="${p.gambar}" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover" /></div>` : `<div class="co-img">${emoji}</div>`;
  document.getElementById("checkoutProduct").innerHTML = `${imgHTML}<div class="co-merk">${p.merk}</div><div class="co-nama">${p.nama}</div><div class="co-harga">${p.harga}</div><div class="co-tags"><span class="co-tag">🏷️ ${p.kondisi}</span><span class="co-tag">${p.kategori === 'baju' ? '👕' : '👖'} ${p.kategori}</span></div>`;
  const ukuranSelect = document.getElementById("coUkuran");
  ukuranSelect.innerHTML = '<option value="">-- Pilih ukuran --</option>';
  p.ukuran.split(",").map(u => u.trim()).filter(Boolean).forEach(u => {
    const opt = document.createElement("option"); opt.value = u; opt.textContent = u; ukuranSelect.appendChild(opt);
  });
  document.getElementById("coNama").value = "";
  document.getElementById("coHP").value = "";
  document.getElementById("coAlamat").value = "";
  document.getElementById("coJumlah").value = "1";
  document.getElementById("coCatatan").value = "";
  document.getElementById("pesanBtnText").textContent = "Pesan Sekarang";
  document.querySelector(".btn-pesan").disabled = false;
  currentProduct = p;
  document.getElementById("checkoutOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("coNama")?.focus(), 200);
}

function closeCheckout(e) { if (e.target === document.getElementById("checkoutOverlay")) closeCheckoutDirect(); }
function closeCheckoutDirect() {
  document.getElementById("checkoutOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ===== SUBMIT PESANAN =====
async function submitPesan() {
  const p = currentProduct;
  if (!p) return;
  const nama   = document.getElementById("coNama").value.trim();
  const hp     = document.getElementById("coHP").value.trim();
  const alamat = document.getElementById("coAlamat").value.trim();
  const ukuran = document.getElementById("coUkuran").value;
  const jumlah = document.getElementById("coJumlah").value || "1";
  const catatan = document.getElementById("coCatatan").value.trim();
  if (!nama)   { showToast("⚠️ Nama wajib diisi!"); return; }
  if (!hp)     { showToast("⚠️ Nomor HP wajib diisi!"); return; }
  if (!alamat) { showToast("⚠️ Alamat wajib diisi!"); return; }
  if (!ukuran) { showToast("⚠️ Pilih ukuran dulu!"); return; }
  const btn = document.querySelector(".btn-pesan");
  btn.disabled = true;
  document.getElementById("pesanBtnText").textContent = "Memproses...";
  const jml = parseInt(jumlah) || 1;
  const hargaAngka = parseInt(p.harga.replace(/[^0-9]/g, "")) || 0;
  const totalHarga = hargaAngka * jml;
  const totalFormatted = "Rp " + totalHarga.toLocaleString("id-ID");
  const payload = { nama, hp, alamat, ukuran, catatan: catatan||"-", nama_produk:p.nama, kategori:p.kategori, merk:p.merk, harga:totalFormatted, jumlah:jml, deskripsi:p.deskripsi||"-", tanggal:new Date().toLocaleString("id-ID") };
  let berhasil = false;
  if (CONFIG.scriptURL) {
    try {
      await fetch(CONFIG.scriptURL, { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body:JSON.stringify(payload) });
      berhasil = true;
    } catch(e) { berhasil = false; }
  } else {
    const riwayat = JSON.parse(localStorage.getItem("noirstore_pesanan") || "[]");
    riwayat.push(payload);
    localStorage.setItem("noirstore_pesanan", JSON.stringify(riwayat));
    berhasil = true;
  }
  const modal = document.getElementById("checkoutOverlay").querySelector(".modal-checkout");
  modal.innerHTML = `
    <button class="modal-close" onclick="closeCheckoutDirect()">✕</button>
    <div class="checkout-success">
      <div class="success-icon">✅</div>
      <h3 class="success-title">Pesanan Diterima!</h3>
      <p class="success-desc">Terima kasih <strong>${nama}</strong>, pesananmu sudah tercatat. Admin akan segera menghubungi kamu di nomor <strong>${hp}</strong>.</p>
      <div class="success-detail">
        <p>Produk: <span>${p.nama}</span></p>
        <p>Ukuran: <span>${ukuran}</span></p>
        <p>Jumlah: <span>${jml} pcs</span></p>
        <p>Harga satuan: <span>${p.harga}</span></p>
        <p>Total harga: <span>${totalFormatted}</span></p>
        <p>Alamat: <span>${alamat}</span></p>
        ${catatan ? `<p>Catatan: <span>${catatan}</span></p>` : ""}
        <p style="margin-top:10px;font-size:11px;color:var(--gray2)">${berhasil ? "✓ Data berhasil dicatat" : "⚠ Hubungi admin jika tidak ada konfirmasi"}</p>
      </div>
      <button class="btn-tutup" onclick="closeCheckoutDirect()">Tutup</button>
    </div>`;
  showToast("✅ Barang sudah diambil, pesanan tercatat!");
}


// ===== SEARCH & FILTER =====
function handleSearch(val) {
  activeFilters.search = val.toLowerCase();
  const h = document.getElementById("heroSearch");
  const p = document.getElementById("produkSearch");
  if (h && h.value !== val) h.value = val;
  if (p && p.value !== val) p.value = val;
  applyFilters();
}
function doSearch() { const val = document.getElementById("heroSearch")?.value || ""; handleSearch(val); showPage("produk"); }
function setFilter(type, val, btn) {
  // Reset filter lain yang sejenis
  if (val === "semua") {
    activeFilters.kategori = "";
    activeFilters.kondisi = "";
  } else {
    activeFilters[type] = val;
  }
  btn.closest(".hero-filters").querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}
function applyFilters() {
  const kat = document.getElementById("filterKategori")?.value ?? activeFilters.kategori;
  const kon = document.getElementById("filterKondisi")?.value ?? activeFilters.kondisi;
  const sta = document.getElementById("filterStatus")?.value ?? activeFilters.status;
  activeFilters.kategori = kat; activeFilters.kondisi = kon; activeFilters.status = sta;
  filteredProducts = allProducts.filter(p => {
    const matchSearch = !activeFilters.search || p.nama.toLowerCase().includes(activeFilters.search) || p.merk.toLowerCase().includes(activeFilters.search);
    const matchKat = !kat || p.kategori === kat;
    const matchKon = !kon || p.kondisi.toLowerCase() === kon;
    const matchSta = !sta || p.status === sta;
    return matchSearch && matchKat && matchKon && matchSta;
  });
  renderProducts("productGrid", filteredProducts);
  renderProducts("productGridAll", filteredProducts);
}

// ===== NAVIGASI =====
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(`page-${page}`)?.classList.add("active");
  document.querySelectorAll(".nav-link").forEach(l => { l.classList.toggle("active", l.getAttribute("onclick")?.includes(`'${page}'`)); });
  document.getElementById("navMenu")?.classList.remove("open");
  window.scrollTo({ top:0, behavior:"smooth" });
  if (page === "admin") renderAdminTable();
}
function toggleMenu() { document.getElementById("navMenu")?.classList.toggle("open"); }

// ===== STATS =====
function updateStats() {
  const total = allProducts.length;
  const sold = allProducts.filter(p => p.status === "sold" || p.status === "sold out").length;
  animateCount("statTotal", total);
  animateCount("statTersedia", total - sold);
  animateCount("statSold", sold);
}
function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let count = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const timer = setInterval(() => { count = Math.min(count + step, target); el.textContent = count; if (count >= target) clearInterval(timer); }, 40);
}

// ===== ADMIN LOGIN =====
function showAdminLogin() {
  if (isAdminLoggedIn) { showPage("admin"); return; }
  document.getElementById("loginOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("adminPass")?.focus(), 100);
}
function closeLoginModal(e) {
  if (e.target === document.getElementById("loginOverlay")) { document.getElementById("loginOverlay").classList.remove("open"); document.body.style.overflow = ""; }
}
function doAdminLogin() {
  const pass = document.getElementById("adminPass")?.value;
  if (pass === CONFIG.adminPassword) {
    isAdminLoggedIn = true;
    document.getElementById("loginOverlay").classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("adminPass").value = "";
    showPage("admin");
    showToast("✅ Login berhasil! Selamat datang, Admin.");
  } else {
    showToast("❌ Password salah!");
    document.getElementById("adminPass")?.select();
  }
}

// ===== ADMIN TABLE =====
function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;
  if (allProducts.length === 0) { tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--gray);padding:40px">Belum ada produk</td></tr>`; return; }
  tbody.innerHTML = allProducts.map(p => {
    const isSold = p.status === "sold" || p.status === "sold out";
    const imgEl = p.gambar ? `<div class="admin-prod-img"><img src="${p.gambar}" alt="${p.nama}" onerror="this.parentElement.textContent='${EMOJI[p.kategori]||EMOJI.default}'" /></div>` : `<div class="admin-prod-img">${EMOJI[p.kategori]||EMOJI.default}</div>`;
    return `<tr><td><div class="admin-prod-info">${imgEl}<div><div class="admin-prod-name">${p.nama}</div><div class="admin-prod-merk">${p.merk}</div></div></div></td><td style="text-transform:capitalize">${p.kategori}</td><td style="font-weight:700">${p.harga}</td><td style="color:var(--gray)">${p.ukuran}</td><td style="color:var(--gray)">${p.kondisi}</td><td><button class="status-toggle ${isSold ? 'sold' : 'tersedia'}" onclick="toggleStatus('${p.id}')">${isSold ? '✕ Sold Out' : '✓ Tersedia'}</button></td><td><div class="action-btns"><button class="btn-edit" onclick="openEditModal('${p.id}')">✏ Edit</button><button class="btn-delete" onclick="deleteProduct('${p.id}')">🗑</button></div></td></tr>`;
  }).join("");
}

// ===== TOGGLE STATUS =====
function toggleStatus(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  const wasSold = p.status === "sold" || p.status === "sold out";
  p.status = wasSold ? "tersedia" : "sold";
  saveLocal();
  renderAdminTable();
  const fi = filteredProducts.findIndex(x => x.id === id);
  if (fi !== -1) filteredProducts[fi] = p;
  renderProducts("productGrid", filteredProducts);
  renderProducts("productGridAll", filteredProducts);
  updateStats();
  showToast(`${wasSold ? "✅ Produk tersedia kembali" : "🔴 Produk ditandai Sold Out"}: ${p.nama}`);
}

// ===== TAMBAH / EDIT PRODUK =====
function openAddModal() {
  editingId = null;
  document.getElementById("formTitle").textContent = "Tambah Produk";
  document.getElementById("formId").value = "";
  ["formNama","formMerk","formHarga","formUkuran","formGambar","formDeskripsi"].forEach(id => { document.getElementById(id).value = ""; });
  document.getElementById("formKategori").value = "baju";
  document.getElementById("formKondisi").value = "Baru";
  document.getElementById("formStatus").value = "tersedia";
  document.getElementById("editOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function openEditModal(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById("formTitle").textContent = "Edit Produk";
  document.getElementById("formId").value = p.id;
  document.getElementById("formNama").value = p.nama;
  document.getElementById("formMerk").value = p.merk;
  document.getElementById("formHarga").value = p.harga;
  document.getElementById("formUkuran").value = p.ukuran;
  document.getElementById("formGambar").value = p.gambar;
  document.getElementById("formDeskripsi").value = p.deskripsi;
  document.getElementById("formKategori").value = p.kategori;
  document.getElementById("formKondisi").value = p.kondisi;
  document.getElementById("formStatus").value = p.status;
  document.getElementById("editOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeEditModal(e) {
  if (e.target === document.getElementById("editOverlay")) { document.getElementById("editOverlay").classList.remove("open"); document.body.style.overflow = ""; }
}
function saveProduct() {
  const nama = document.getElementById("formNama").value.trim();
  if (!nama) { showToast("⚠️ Nama produk wajib diisi!"); return; }
  const produk = {
    id: editingId || Date.now().toString(), nama,
    merk: document.getElementById("formMerk").value.trim(),
    kategori: document.getElementById("formKategori").value,
    kondisi: document.getElementById("formKondisi").value,
    harga: document.getElementById("formHarga").value.trim(),
    ukuran: document.getElementById("formUkuran").value.trim(),
    gambar: document.getElementById("formGambar").value.trim(),
    deskripsi: document.getElementById("formDeskripsi").value.trim(),
    status: document.getElementById("formStatus").value,
    tanggal: editingId ? (allProducts.find(x=>x.id===editingId)?.tanggal || new Date().toISOString().split("T")[0]) : new Date().toISOString().split("T")[0]
  };
  if (editingId) { const idx = allProducts.findIndex(x => x.id === editingId); if (idx !== -1) allProducts[idx] = produk; showToast("✅ Produk berhasil diperbarui!"); }
  else { allProducts.unshift(produk); showToast("✅ Produk berhasil ditambahkan!"); }
  saveLocal();
  document.getElementById("editOverlay").classList.remove("open");
  document.body.style.overflow = "";
  filteredProducts = [...allProducts];
  renderAdminTable();
  renderProducts("productGrid", filteredProducts);
  renderProducts("productGridAll", filteredProducts);
  updateStats();
}
function deleteProduct(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Hapus produk "${p.nama}"?`)) return;
  allProducts = allProducts.filter(x => x.id !== id);
  filteredProducts = filteredProducts.filter(x => x.id !== id);
  saveLocal();
  renderAdminTable();
  renderProducts("productGrid", filteredProducts);
  renderProducts("productGridAll", filteredProducts);
  updateStats();
  showToast(`🗑 Produk "${p.nama}" dihapus`);
}

// ===== HELPERS =====
function isNewProduct(tanggal) { if (!tanggal) return false; return (new Date() - new Date(tanggal)) / 86400000 <= 7; }
function showLoading(show) { document.getElementById("loadingOverlay")?.classList.toggle("hidden", !show); }
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 3000);
}

// ===== KEYBOARD & ESC =====
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModalDirect();
    closeCheckoutDirect();
    document.getElementById("loginOverlay")?.classList.remove("open");
    document.getElementById("editOverlay")?.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (e.ctrlKey && e.shiftKey && e.key === "A") { showAdminLogin(); }
});
