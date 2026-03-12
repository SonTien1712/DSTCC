/* ============================================================
   form.js — DSTCC Website v3
   Handles: B2B form submit (Web3Forms), file upload display,
   drag & drop highlight.
   ============================================================ */

(function () {
    const form = document.getElementById('b2b-form');
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('file-drop-zone');
    if (!form) return;

    // --- File name display ---
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const display = document.getElementById('file-name-display');
            if (!display) return;
            if (this.files.length > 0) {
                const names = Array.from(this.files).map(f => f.name).join(', ');
                display.textContent = '📎 ' + names;
                display.style.display = 'block';
            } else {
                display.style.display = 'none';
            }
        });
    }

    // --- Drag & drop highlight ---
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(ev =>
            dropZone.addEventListener(ev, e => {
                e.preventDefault();
                dropZone.style.borderColor = 'var(--primary)';
                dropZone.style.background = 'rgba(0,63,127,0.04)';
            }, { passive: false })
        );
        ['dragleave', 'drop'].forEach(ev =>
            dropZone.addEventListener(ev, () => {
                dropZone.style.borderColor = '';
                dropZone.style.background = '';
            })
        );
    }

    // --- Form submit via Web3Forms ---
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnLoader = document.getElementById('btn-loading');

        // Show loading state
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline-flex';
        if (btn) btn.disabled = true;

        const restore = () => {
            if (btnText) btnText.style.display = 'inline-flex';
            if (btnLoader) btnLoader.style.display = 'none';
            if (btn) btn.disabled = false;
        };

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            });
            const data = await res.json();

            if (data.success) {
                form.style.display = 'none';
                const successEl = document.getElementById('form-success');
                if (successEl) successEl.style.display = 'block';
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi Hotline: (+84) 913 446 353');
                restore();
            }
        } catch {
            alert('Không thể kết nối. Vui lòng gửi email: DSTCC.JSC@gmail.com');
            restore();
        }
    });
})();