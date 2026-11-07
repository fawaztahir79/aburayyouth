/* دليل القرى — الصفحة الرئيسية
   المصدر الوحيد للبيانات: data/villages.json
   تنبيه: fetch لا يعمل عند فتح الصفحة من القرص مباشرة (file://)؛
   الاختبار يكون على GitHub Pages أو عبر خادم محلي. */

/* تطبيع النص العربي: إزالة التشكيل والتطويل، وتوحيد الألف والياء والتاء المربوطة،
   وحذف المسافات. بهذا يجد الزائر قريته مهما اختلفت الهمزات أو التاء المربوطة
   أو التشكيل أو مواضع المسافات في كتابة الاسم. */
const norm = value => String(value ?? "")
  .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
  .replace(/[أإآ]/g, "ا")
  .replace(/ى/g, "ي")
  .replace(/ة/g, "ه")
  .replace(/\s+/g, "")
  .toLowerCase();

const villageList = document.getElementById("villageList");
const villageSearch = document.getElementById("villageSearch");
const searchCount = document.getElementById("searchCount");
const noResults = document.getElementById("noResults");

const addText = (value, fallback = "لم ترد معلومات كافية في الاستمارات") => {
  const paragraph = document.createElement("p");
  paragraph.textContent = value || fallback;
  return paragraph;
};

const makeSection = (title, content) => {
  const section = document.createElement("section");
  const heading = document.createElement("h4");
  heading.textContent = title;
  section.append(heading, content);
  return section;
};

const makeChips = services => {
  const chips = document.createElement("div");
  chips.className = "chips";
  services.forEach(service => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = service;
    chips.append(chip);
  });
  return chips;
};

const databaseLink = () => {
  const link = document.createElement("a");
  link.href = "database.html";
  link.className = "text-link";
  link.textContent = "عرض السجل في قاعدة البيانات ↗";
  return link;
};

/* بناء قائمة القرى من الملف نفسه؛ تُستخدم نسخة الدليل (guide) عند وجودها،
   ويُشار إلى سجل قاعدة البيانات (record) إن لم تكن هناك استمارة مفصّلة. */
const buildVillage = village => {
  const guide = village.guide || null;
  const record = village.record || null;
  const name = village.name;

  const details = document.createElement("details");
  details.className = "village";
  details.dataset.name = name;
  details.dataset.search = norm(name);

  const summary = document.createElement("summary");
  summary.textContent = name;

  const body = document.createElement("div");
  body.className = "v-body";

  const overview = guide
    ? [guide.note, guide.review].filter(Boolean).join(" · ")
    : "";
  const fallbackStatus = record
    ? "لهذه القرية سجل في قاعدة البيانات، ولم تُضف لها استمارة مفصّلة بعد."
    : "لا توجد استمارة جديدة مرتبطة بهذه القرية بعد.";
  const status = addText(overview, fallbackStatus);
  if (!guide && record) status.append(" ", databaseLink());
  body.append(makeSection("حالة البيانات", status));

  const population = guide
    ? [guide.population, guide.families].filter(Boolean).join(" — ")
    : record?.population || "";
  body.append(makeSection("السكان والأسر", addText(population)));
  body.append(makeSection("الشيخ / المسؤول الإداري", addText(guide?.sheikh || record?.sheikh || "")));
  body.append(makeSection("المياه والطرق", addText(guide?.water || record?.water || "")));
  body.append(makeSection("التعليم", addText(guide?.education || record?.education || "")));
  body.append(makeSection("الصحة", addText(guide?.health || record?.health || "")));
  body.append(makeSection("السوق والنشاط التجاري", addText(guide?.market || record?.market || "")));

  if (guide?.history) body.append(makeSection("نبذة عن القرية", addText(guide.history)));
  if (guide?.services?.length) {
    body.append(makeSection("معلومات سابقة في الدليل", makeChips(guide.services)));
  }

  details.append(summary, body);

  details.addEventListener("toggle", () => {
    if (!details.open) return;
    villageList.querySelectorAll(".village[open]").forEach(other => {
      if (other !== details) other.open = false;
    });
  });

  return details;
};

const applySearch = () => {
  const query = norm(villageSearch.value);
  let visible = 0;

  villageList.querySelectorAll(".village").forEach(village => {
    const matches = village.dataset.search.includes(query);
    village.style.display = matches ? "" : "none";
    if (matches) visible += 1;
  });

  searchCount.textContent = `${visible} قرية`;
  noResults.hidden = visible !== 0;
};

const showLoadError = () => {
  if (searchCount) searchCount.textContent = "—";
  if (noResults) noResults.hidden = true;

  const paragraph = document.createElement("p");
  paragraph.className = "no-results";
  paragraph.textContent = "تعذّر تحميل بيانات القرى. أعد المحاولة لاحقاً.";
  villageList.append(paragraph);
};

fetch("data/villages.json", { cache: "no-cache" })
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then(db => {
    const villages = (db.villages || []).filter(village => village && village.name);
    const guides = villages.filter(village => village.guide);

    villages.forEach(village => villageList.append(buildVillage(village)));

    if (searchCount) searchCount.textContent = `${villages.length} قرية`;
    if (villageSearch) villageSearch.addEventListener("input", applySearch);

    document.getElementById("serviceCount").textContent = guides.filter(village => {
      const guide = village.guide;
      return guide.water || guide.education || guide.health || guide.market;
    }).length;
    document.getElementById("knownCount").textContent = guides.filter(village => village.guide.note).length;
    document.getElementById("villageCount").textContent = villages.length;
  })
  .catch(error => {
    console.error("تعذّر تحميل بيانات القرى", error);
    showLoadError();
  });
