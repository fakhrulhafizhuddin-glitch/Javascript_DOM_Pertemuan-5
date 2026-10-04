const input = document.getElementById("input-tugas");
const tombolTambah = document.getElementById("tambah");
const daftar = document.getElementById("daftar");

const total = document.getElementById("total");
const selesai = document.getElementById("selesai");
const belum = document.getElementById("belum");

const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const jumlah = document.getElementById("jumlah");
const pesanKosong = document.getElementById("kosong");

let tugas = JSON.parse(localStorage.getItem("tugas")) || [];
let filter = "all";


// Menampilkan tanggal
const sekarang = new Date();

document.getElementById("hari").textContent =
    sekarang.toLocaleDateString("id-ID", { weekday: "long" });

document.getElementById("tanggal").textContent =
    sekarang.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// Menampilkan tugas
function tampilkan() {

    daftar.innerHTML = "";

    let data = tugas;

    if (filter === "active")
        data = tugas.filter(t => !t.selesai);

    if (filter === "done")
        data = tugas.filter(t => t.selesai);


    data.forEach(t => {

        const li = document.createElement("li");
        li.className = "task";

        if (t.selesai)
            li.classList.add("selesai");


        const check = document.createElement("button");
        check.className = "check";
        check.textContent = "✓";


        const teks = document.createElement("span");
        teks.className = "teks";
        teks.textContent = t.nama;


        const hapus = document.createElement("button");
        hapus.className = "hapus";
        hapus.textContent = "✕";


        check.onclick = () => {
            t.selesai = !t.selesai;
            simpan();
            tampilkan();
        };


        teks.onclick = () => {
            t.selesai = !t.selesai;
            simpan();
            tampilkan();
        };


        hapus.onclick = () => {
            tugas = tugas.filter(x => x.id !== t.id);
            simpan();
            tampilkan();
        };


        li.append(check, teks, hapus);
        daftar.appendChild(li);

    });


    statistik(data.length);
}


// Menampilkan statistik
function statistik(jumlahData) {

    const sudah = tugas.filter(t => t.selesai).length;

    total.textContent = tugas.length;
    selesai.textContent = sudah;
    belum.textContent = tugas.length - sudah;

    let persen = tugas.length
        ? Math.round(sudah / tugas.length * 100)
        : 0;

    progressBar.style.width = persen + "%";
    progressText.textContent = persen + "%";

    jumlah.textContent = jumlahData + " tugas";

    pesanKosong.style.display =
        jumlahData === 0 ? "block" : "none";
}


// Simpan tugas
function simpan() {
    localStorage.setItem("tugas", JSON.stringify(tugas));
}


// Tambah tugas
function tambah() {

    const nama = input.value.trim();

    if (nama === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    tugas.push({
        id: Date.now(),
        nama: nama,
        selesai: false
    });

    input.value = "";

    simpan();
    tampilkan();
    input.focus();
}


// Tombol tambah
tombolTambah.onclick = tambah;


// Enter
input.addEventListener("keydown", function(e) {
    if (e.key === "Enter")
        tambah();
});


// Filter
document.querySelectorAll(".filter-btn").forEach(button => {

    button.onclick = function() {

        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        filter = this.dataset.filter;

        tampilkan();
    };

});


tampilkan();