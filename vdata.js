/* منطق مشترك لقراءة سجلات القرى (record) وتصنيفها.
   تستخدمه لوحة المؤشرات (dashboard.html) وصفحة القرية (village.html) حتى لا يختلف التصنيف بينهما.
   التصنيف آلي من النص الحر في السجل؛ يُعرض النص الأصلي دائماً بجانبه، وما لا يُفهم يُصنَّف «غير محدد». */
(function (root) {
  "use strict";

  /* أسبوع السودان يبدأ بالسبت */
  const DAYS = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
  const DAY_RE = [/السبت/, /الأحد/, /[اإ]ثنين/, /الثلاثاء/, /الأربعاء/, /الخميس/, /الجمعة/];

  const UNKNOWN_RE = /^\s*(غير\s*(معروف|مذكور)|—|-)?\s*$/;
  const START_NONE = /^\s*(لا\s*(يوجد|توجد)|عدم\s*وجود)/;

  const STATUS = {
    good: { icon: "✓", label: "متوفرة أو عاملة" },
    warn: { icon: "!", label: "محدودة أو تحتاج صيانة" },
    bad: { icon: "✕", label: "غير متوفرة" },
    unk: { icon: "–", label: "غير محدد" }
  };
  const mk = (k, label) => ({ k, label });
  const UNK = mk("unk", "غير محدد");

  const classify = {
    water(t) {
      t = String(t || "");
      if (UNKNOWN_RE.test(t)) return UNK;
      if ((START_NONE.test(t) || /غير\s*متوفر/.test(t)) && !/شحيح/.test(t)) return mk("bad", "غير متوفرة");
      if (/شحيح|أمطار|تُنقل|تنقل|متقطع/.test(t)) return mk("warn", "شحيحة أو غير مستقرة");
      if (/متوفر/.test(t)) return mk("good", "متوفرة");
      return UNK;
    },
    education(t) {
      t = String(t || "");
      if (UNKNOWN_RE.test(t)) return UNK;
      if (START_NONE.test(t)) return mk("bad", "لا توجد مدرسة");
      if (/مدرس|مدارس/.test(t)) {
        return /سيئ|صيانة|تحتاج|متوقف/.test(t) ? mk("warn", "مدرسة تحتاج صيانة") : mk("good", "مدرسة قائمة");
      }
      return UNK;
    },
    health(t) {
      t = String(t || "");
      if (UNKNOWN_RE.test(t)) return UNK;
      if (START_NONE.test(t) || /متوقف/.test(t)) return mk("bad", "لا توجد منشأة عاملة");
      if (/جزئي/.test(t)) return mk("warn", "تعمل جزئياً");
      if (/عيادة|نقطة|وحدة|مركز|مستشفى|صيدلية|قابلة/.test(t)) return mk("good", "منشأة عاملة");
      return UNK;
    },
    market(t) {
      t = String(t || "");
      if (UNKNOWN_RE.test(t)) return UNK;
      if (START_NONE.test(t)) return mk("bad", "لا يوجد سوق");
      if (marketDays(t).length) return mk("good", "سوق أسبوعي");
      if (/عدم\s*وجود|لا\s*(يوجد|توجد)/.test(t)) return mk("bad", "لا يوجد سوق");
      return UNK;
    }
  };

  /* أيام السوق كفهارس في DAYS */
  function marketDays(t) {
    const out = [];
    DAY_RE.forEach((re, i) => { if (re.test(String(t || ""))) out.push(i); });
    return out;
  }

  /* عدد السكان: رقم واحد أو مدى (min–max)، أو null إن لم يُذكر.
     لا نجمع الأرقام ولا نختار بينها: المدى يُحفظ كما ورد. */
  function parsePopulation(t) {
    const s = String(t || "")
      .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
      .replace(/[,٬،]/g, "");
    const nums = (s.match(/\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
    if (!nums.length) return null;
    const min = Math.min(...nums), max = Math.max(...nums);
    return { min, max, range: min !== max };
  }

  /* السجل المختصر للقرية إن كان فيه أي قيمة، وإلا null */
  function recordOf(entry) {
    const r = entry && entry.record;
    return r && Object.values(r).some(v => v !== null && v !== undefined && String(v).trim() !== "") ? r : null;
  }

  root.AbuRay = { DAYS, STATUS, classify, marketDays, parsePopulation, recordOf };
  if (typeof module !== "undefined" && module.exports) module.exports = root.AbuRay;
})(typeof window !== "undefined" ? window : globalThis);
