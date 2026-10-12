// hydrate links + interactions
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // 1) apply links from config
  $$("[data-link]").forEach((el) => {
    const key = el.getAttribute("data-link");
    if (LINKS[key] && !LINKS[key].includes("example.com")) el.href = LINKS[key];
    else if (LINKS[key]) el.href = LINKS[key];
  });
  Object.entries(NUMBERS).forEach(([id, v]) => {
    const n = document.getElementById(id);
    if (n) n.textContent = v;
  });
  const yr = $("#year"); if (yr) yr.textContent = new Date().getFullYear();

  // 2) reveal on scroll
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
  setTimeout(() => $$(".reveal").forEach((el) => el.classList.add("in")), 600); // fallback

  // 3) toast
  const toast = $("#toast");
  let t;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  // 4) copy buttons (numbers + payment links)
  async function copyText(txt) {
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
  }
  function pop(btn) {
    btn.animate([{ transform: "scale(1)" }, { transform: "scale(.9)" }, { transform: "scale(1)" }], { duration: 250 });
  }
  $$("[data-copy-link]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const key = btn.getAttribute("data-copy-link");
      await copyText(LINKS[key] || "");
      showToast("لينك الدفع اتنسخ ✅");
      pop(btn);
    })
  );
  $$("[data-copy]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-copy");
      const txt = (document.getElementById(id)?.textContent || "").replace(/\s/g, "");
      await copyText(txt);
      showToast("اتنسخ ✅ وري الشاشة للكاشير");
      pop(btn);
    })
  );

  // 5) share
  const btnShare = $("#btnShare"); if (btnShare) btnShare.addEventListener("click", async () => {
    const data = { title: "عماد افندي", text: "ادفع بسرعة وسهولة — عماد افندي", url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} }
    else { try { await navigator.clipboard.writeText(location.href); showToast("لينك الصفحة اتنسخ ✅"); } catch {} }
  });

  // 6) save contact (vCard)
  const btnSave = $("#btnSave"); if (btnSave) btnSave.addEventListener("click", () => {
    const v = ["BEGIN:VCARD", "VERSION:3.0", "FN:Emad Afandi - عماد افندي", "ORG:Emad Afandi Cafe", `TEL;TYPE=CELL:${(LINKS.phone || "").replace("tel:", "")}`, `URL:${location.href}`, "END:VCARD"].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([v], { type: "text/vcard;charset=utf-8" }));
    a.download = "emad-afandi.vcf";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("جهة الاتصال نزلت ✅");
  });
})();
