/* عدّاد زوار موقع شباب إدارية أبوراي — عبر GoatCounter (مجاني، يحترم خصوصية الزوار).
   خطوات التفعيل (مرة واحدة):
   1) سجّل حساباً مجانياً على https://www.goatcounter.com واختر كوداً (code/subdomain).
      نقترح الكود: abu-ray  (فيصبح لوحتك على abu-ray.goatcounter.com).
   2) من إعدادات GoatCounter: Settings ← فعّل خيار إظهار عدد الزوار للعموم
      ("Allow adding visitor counts to pages" / السماح بعرض عدد الزوار).
   3) ضع الكود الذي اخترته في المتغيّر GC_CODE أدناه، ثم ارفع الملف.
   قبل ضبط الكود الصحيح، يعرض العدّاد شرطة (—) ولا يكسر الصفحة. */
(function () {
  "use strict";

  var GC_CODE = "abu-ray"; // ← غيّره إلى كود GoatCounter الذي اخترته عند التسجيل

  var slots = document.querySelectorAll("[data-visitor-count]");

  function render(value) {
    for (var i = 0; i < slots.length; i++) slots[i].textContent = value;
  }

  if (!GC_CODE) { render("—"); return; }

  var base = "https://" + GC_CODE + ".goatcounter.com";

  // 1) تسجيل الزيارة الحالية
  try {
    var s = document.createElement("script");
    s.async = true;
    s.src = "//gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", base + "/count");
    document.head.appendChild(s);
  } catch (e) { /* تجاهل */ }

  // 2) جلب العدد الكلي وعرضه (بأرقام عربية مفصولة بآلاف)
  function loadTotal() {
    if (!slots.length) return;
    fetch(base + "/counter/TOTAL.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (d) {
        var n = parseInt(String(d.count || "0").replace(/[^0-9]/g, ""), 10) || 0;
        var text;
        try { text = n.toLocaleString("en-US"); } catch (e) { text = String(n); }
        render(text);
      })
      .catch(function () { render("—"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadTotal);
  } else {
    loadTotal();
  }
})();
