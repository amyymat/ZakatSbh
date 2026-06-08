/* =========================================================================
   script.js - KOD FUNGSI JAVASCRIPT UNTUK ZAKAT SABAH (S.O.H)
   ========================================================================= */

// --- 1. FUNGSI WINDOW MODAL (TUTORIAL & HAD KIFAYAH) ---\
function bukaModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; /* Menghalang skrol latar belakang apabila modal dibuka */
    }
}

function tutupModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; /* Mengembalikan fungsi skrol asal */
    }
}

// Tutup modal secara automatik jika pengguna klik di luar kawasan putih modal
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});


document.addEventListener('DOMContentLoaded', () => {

    // --- 2. MENU MUDAH ALIH (BURGER MENU FIX) ---\
    const navLinks = document.getElementById('nav-links');
    let mobileMenu = document.getElementById('mobile-menu');
    
    // Membina butang burger dinamik jika belum wujud dalam HTML
    if (!mobileMenu && navLinks) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        
        // Membina 3 garis asli untuk butang burger
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('span');
            mobileMenu.appendChild(line);
        }
        
        // Memasukkan butang burger ke dalam tag nav
        const nav = document.querySelector('nav');
        if (nav) {
            nav.appendChild(mobileMenu);
        }
    }

    // Fungsi Klik: Membuka dan menutup laci menu dengan betul
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active'); // FIX: Diselaraskan dengan CSS .nav-active
            mobileMenu.classList.toggle('toggle');    // Kesan animasi pusingan 3 garis burger
        });
    }

    // Tutup menu secara automatik apabila pengguna klik salah satu pautan menu
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                if (mobileMenu) mobileMenu.classList.remove('toggle');
            }
        });
    });

    // --- 3. ANIMASI INTERAKTIF KABUS (BLUR EFFECT ON SCROLL) ---\
    const elemenAnimasi = document.querySelectorAll('.scroll-animate');

    const pemerhatiSkrol = new IntersectionObserver((kumpulanElemen) => {
        kumpulanElemen.forEach(elemen => {
            if (elemen.isIntersecting) {
                elemen.target.classList.add('terlihat');
            } else {
                elemen.target.classList.remove('terlihat');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    elemenAnimasi.forEach(elemen => {
        pemerhatiSkrol.observe(elemen);
    });
});

// --- 4. ENGINE SISTEM KALKULATOR PENDAPATAN ZAKAT PREMIUM ---\
function hitungZakatPremium() {
    try {
        const gajiBulanan = parseFloat(document.getElementById('gaji_bulanan')?.value || 0);
        const pendapatanLain = parseFloat(document.getElementById('pendapatan_lain')?.value || 0);
        
        const totalPendapatan = (gajiBulanan * 12) + pendapatanLain;

        const tolakanDiri = parseFloat(document.getElementById('tolakan_diri')?.value || 0);
        const tolakanIsteri = parseFloat(document.getElementById('tolakan_isteri')?.value || 0);
        const tolakanAnak = parseFloat(document.getElementById('tolakan_anak')?.value || 0);
        const tolakanIbubapa = parseFloat(document.getElementById('tolakan_ibubapa')?.value || 0);
        const tolakanKWSP = parseFloat(document.getElementById('tolakan_kwsp')?.value || 0);

        const totalTolakan = tolakanDiri + tolakanIsteri + tolakanAnak + tolakanIbubapa + tolakanKWSP;
        
        const nisabSemasa = parseFloat(document.getElementById('nisab')?.value || 24000);
        const baki = totalPendapatan - totalTolakan;
        let mesejAlert = '';

        if (baki >= nisabSemasa) {
            const jumlahZakat = baki * 0.025;
            mesejAlert = `✓ WAJIB BERZAKAT ✓\n\n` +
                         `📊 RINGKASAN PENGIRAAN:\n` +
                         `• Total Pendapatan Tahunan: RM ${totalPendapatan.toFixed(2)}\n` +
                         `• Total Tolakan (Had Kifayah): RM ${totalTolakan.toFixed(2)}\n` +
                         `• Baki Harta: RM ${baki.toFixed(2)}\n\n` +
                         `✅ STATUS: Melepasi Nisab (RM ${nisabSemasa.toFixed(2)})\n\n` +
                         `💰 JUMLAH ZAKAT DIKENAKAN (2.5%): RM ${jumlahZakat.toFixed(2)}`;
        } else if (baki > 0 && baki < nisabSemasa) {
            mesejAlert = `⚠️ BELUM WAJIB BERZAKAT ⚠️\n\n` +
                         `📊 RINGKASAN:\n` +
                         `Baki harta (RM ${baki.toFixed(2)}) tidak mencapai paras Nisab semasa (RM ${nisabSemasa.toFixed(2)}).`;
        } else {
            mesejAlert = `⚠️ TIADA ZAKAT DIKENAKAN ⚠️\n\n` +
                         `Baki pendapatan anda setelah ditolak Had Kifayah adalah negatif (RM ${baki.toFixed(2)}).`;
        }

        alert(mesejAlert);

    } catch (error) {
        alert("Ralat dalam pengiraan. Sila pastikan semua input adalah nombor yang betul.");
    }
}
