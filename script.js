/* =========================================================================
   script.js - KOD FUNGSI JAVASCRIPT UNTUK ZAKAT SABAH (S.O.H)
   ========================================================================= */

// --- 5. SISTEM MODAL / POP-OUT (GLOBAL SCOPE) ---
// Ditulis di luar DOMContentLoaded supaya atribut onclick HTML dapat membaca fungsi ini.

function bukaModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('show');
    }
}

function tutupModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Menutup modal secara automatik jika pengguna klik pada ruang latar belakang hitam
window.addEventListener('click', function(event) {
    // Menyemak jika elemen yang diklik adalah background modal itu sendiri
    if (event.target.classList.contains('modal') || event.target.classList.contains('modal-popout')) {
        event.target.classList.remove('show');
    }
});


/* =========================================================================
   EVENTS & LOGIK DOM UTAMA
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENU MUDAH ALIH (HAMBURGER MENU) ---
    const navLinks = document.querySelector('.nav-links') || document.getElementById('nav-links');
    let mobileMenu = document.getElementById('mobile-menu');
    
    // Rupa bentuk sokongan dinamik untuk membina ikon Menu Hamburger jika ia belum ada di HTML
    if (!mobileMenu && navLinks) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.innerHTML = '☰';
        mobileMenu.style.fontSize = '2rem';
        mobileMenu.style.cursor = 'pointer';
        mobileMenu.style.color = 'var(--primary-teal)';
        mobileMenu.style.display = 'none'; // Secara default disembunyikan pada desktop
        
        // CSS tambahan untuk memastikan ikon muncul hanya pada saiz mobile
        const styleMobile = document.createElement('style');
        styleMobile.innerHTML = `
            @media (max-width: 768px) {
                #mobile-menu { display: block !important; }
            }
        `;
        document.head.appendChild(styleMobile);
        
        const nav = document.querySelector('nav');
        if (nav) nav.insertBefore(mobileMenu, navLinks);
    }

    if (mobileMenu && navLinks) {
        // Fungsi Toggle untuk memaparkan / menyembunyikan menu
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active'); // Merujuk pada pembolehubah CSS terdahulu
            navLinks.classList.toggle('aktif');      // Syarat wajib seperti diminta
            mobileMenu.classList.toggle('buka');
        });

        // Menutup menu secara automatik sebaik sahaja mana-mana pautan link diklik
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active', 'aktif');
                mobileMenu.classList.remove('buka');
            });
        });
    }


    // --- 2. ANIMASI SCROLL (INTERSECTION OBSERVER) ---
    // Mencari sasaran '.section-padded' dan semua 'section' bagi kelancaran animasi
    const elementsToAnimate = document.querySelectorAll('.section-padded, section');
    
    // Menambah kelas awal animasi kepada semua seksyen yang dijumpai
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-animate');
    });

    // Tetapan pemantauan scroll
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Menambah kelas yang mencetuskan animasi CSS apabila pengguna scroll ke bahagian ini
                entry.target.classList.add('terlihat');
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => scrollObserver.observe(el));


    // --- 3. SMOOTH SCROLLING DENGAN OFFSET NEGATIF ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Abaikan tindakan jika pautan hanyalah simbol #
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault(); // Menghalang lompatan lalai sistem HTML
                
                // Offset negatif (-100) supaya tajuk seksyen tidak terlindung di sebalik Navigasi Fixed
                const yOffset = -100; 
                const yPos = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: yPos,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 4. LOGIK KALKULATOR ZAKAT ---
    const formKalkulator = document.getElementById('kalkulator-form') || document.getElementById('form-kalkulator');
    
    if (formKalkulator) {
        formKalkulator.addEventListener('submit', function(e) {
            e.preventDefault(); // Menghalang form daripada refresh muka surat

            // Mengambil semua nilai input yang dimasukkan (Tukar ke nombor Float. Gunakan 0 jika medan dibiarkan kosong)
            const gajiBulanan = parseFloat(document.getElementById('pendapatan-bulanan')?.value || 0);
            const gajiSampingan = parseFloat(document.getElementById('pendapatan-sampingan')?.value || 0);
            
            const tolakanDiri = parseFloat(document.getElementById('diri-sendiri')?.value || 0);
            const tolakanIsteri = parseFloat(document.getElementById('isteri')?.value || 0);
            const tolakanAnak = parseFloat(document.getElementById('anak')?.value || 0);
            const tolakanKWSP = parseFloat(document.getElementById('kwsp')?.value || 0);
            
            // Tetapan Nisab Semasa
            const nisabSemasa = parseFloat(document.getElementById('nisab')?.value || 24000);

            // Pengiraan Logik
            const totalPendapatan = (gajiBulanan * 12) + gajiSampingan;
            const totalTolakan = tolakanDiri + tolakanIsteri + tolakanAnak + tolakanKWSP;
            const baki = totalPendapatan - totalTolakan;
            
            let mesejAlert = '';

            // Syarat A: Cukup Haul dan Melepasi Nisab
            if (baki >= nisabSemasa) {
                const jumlahZakat = baki * 0.025; // Pengiraan bayaran zakat sebanyak 2.5%
                
                mesejAlert = `✓ WAJIB BERZAKAT ✓\n\n` +
                             `📊 RINGKASAN PENGIRAAN:\n` +
                             `• Total Pendapatan Tahunan: RM ${totalPendapatan.toFixed(2)}\n` +
                             `• Total Tolakan (Had Kifayah): RM ${totalTolakan.toFixed(2)}\n` +
                             `• Baki Harta: RM ${baki.toFixed(2)}\n\n` +
                             `✅ STATUS: Melepasi Nisab (RM ${nisabSemasa.toFixed(2)})\n\n` +
                             `💰 JUMLAH ZAKAT DIKENAKAN (2.5%): RM ${jumlahZakat.toFixed(2)}\n\n` +
                             `📌 Panduan: Sila tunaikan zakat anda melalui amil bertauliah atau portal rasmi Zakat Sabah.`;
            } 
            // Syarat B: Ada baki tetapi kurang daripada jumlah Nisab semasa
            else if (baki > 0 && baki < nisabSemasa) {
                mesejAlert = `⚠️ BELUM WAJIB BERZAKAT ⚠️\n\n` +
                             `📊 RINGKASAN PENGIRAAN:\n` +
                             `• Total Pendapatan Tahunan: RM ${totalPendapatan.toFixed(2)}\n` +
                             `• Total Tolakan (Had Kifayah): RM ${totalTolakan.toFixed(2)}\n` +
                             `• Baki Harta: RM ${baki.toFixed(2)}\n\n` +
                             `ℹ️ STATUS: Baki pendapatan anda tidak mencapai paras Nisab semasa (RM ${nisabSemasa.toFixed(2)}). Anda belum diwajibkan untuk membayar zakat pendapatan tahun ini.`;
            } 
            // Syarat C: Baki sifar atau negatif (tolakan melepasi pendapatan)
            else {
                mesejAlert = `✓ TIDAK WAJIB BERZAKAT ✓\n\n` +
                             `📊 RINGKASAN PENGIRAAN:\n` +
                             `• Total Pendapatan Tahunan: RM ${totalPendapatan.toFixed(2)}\n` +
                             `• Total Tolakan (Had Kifayah): RM ${totalTolakan.toFixed(2)}\n` +
                             `• Baki Harta: RM ${baki.toFixed(2)}\n\n` +
                             `ℹ️ STATUS: Pendapatan bersih anda berada di bawah Had Kifayah (keperluan asas) MUIS. Semoga Allah SWT merahmati dan meluaskan pintu rezeki anda pada masa hadapan.`;
            }

            // Paparkan Pop-up Notifikasi Hasil Pengiraan
            alert(mesejAlert);
        });
    }
});