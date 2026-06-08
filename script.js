/* =========================================================================
   script.js - KOD FUNGSI JAVASCRIPT UNTUK ZAKAT SABAH (S.O.H)
   ========================================================================= */

// --- 1. FUNGSI WINDOW MODAL (TUTORIAL & HAD KIFAYAH) ---
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

    // --- 2. MENU MUDAH ALIH (BURGER MENU FIX NORMAL) ---
    const navLinks = document.getElementById('nav-links');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenu && navLinks) {
        // Buka/Tutup apabila ikon menu ditekan
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('nav-active');
            mobileMenu.innerHTML = navLinks.classList.contains('nav-active') ? '✖' : '☰';
        });

        // Tutup menu jika mana-mana pautan menu ditekan
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                mobileMenu.innerHTML = '☰';
            });
        });

        // Tutup menu jika pengguna klik tempat lain di luar kawasan menu
        document.addEventListener('click', (e) => {
            // Pastikan tidak tertutup apabila tekan butang toggle itu sendiri
            if (navLinks.classList.contains('nav-active') && !navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                mobileMenu.innerHTML = '☰';
            }
        });
    }

    // --- 3. ANIMASI SMOOTH SCROLL KABUS KE JELAS (UP & DOWN) ---
    // Sasaran elemen yang akan menerima impak animasi apabila di-skrol
    const elementsToAnimate = document.querySelectorAll('.card, .issue-item, .verdict-card, .formula-box, #kalkulator-form, table, .team-container, .references-container');
    
    elementsToAnimate.forEach(el => el.classList.add('scroll-animate'));

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('terlihat');
            } else {
                entry.target.classList.remove('terlihat');
            }
        });
    }, { 
        threshold: 0.10,
        rootMargin: "0px 0px -50px 0px"
    });

    elementsToAnimate.forEach(el => scrollObserver.observe(el));


    // --- 4. SMOOTH SCROLLING NAVIGASI INTERN ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const yPos = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top: yPos, behavior: 'smooth' });
            }
        });
    });


    // --- 5. LOGIK KALKULATOR ZAKAT ---
    const formKalkulator = document.getElementById('kalkulator-form');
    
    if (formKalkulator) {
        formKalkulator.addEventListener('submit', function(e) {
            e.preventDefault();

            const pendapatanTahunan = parseFloat(document.getElementById('pendapatan-bulanan')?.value || 0);
            const gajiSampingan = parseFloat(document.getElementById('pendapatan-sampingan')?.value || 0);
            const totalPendapatan = pendapatanTahunan + gajiSampingan;
            
            const tolakanDiri = parseFloat(document.getElementById('diri-sendiri')?.value || 0);
            const tolakanIsteri = parseFloat(document.getElementById('isteri')?.value || 0);
            const tolakanAnak = parseFloat(document.getElementById('anak')?.value || 0);
            const tolakanKWSP = parseFloat(document.getElementById('kwsp')?.value || 0);
            const totalTolakan = tolakanDiri + tolakanIsteri + tolakanAnak + tolakanKWSP;
            
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
                mesejAlert = `✓ TIDAK WAJIB BERZAKAT ✓\n\n` +
                             `📊 RINGKASAN:\n` +
                             `Pendapatan bersih anda berada di bawah Had Kifayah (keperluan asas) MUIS.`;
            }
              alert(mesejAlert);
        });
    }
});
