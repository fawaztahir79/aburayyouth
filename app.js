const norm = s => s.replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, "").toLowerCase();

fetch("data/villages.json")
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(db => {
    const names = db.villages.map(village => village.name);
    const info = Object.fromEntries(
      db.villages.filter(village => village.guide).map(village => [village.name, village.guide])
    );
    const list = document.getElementById("villageList");
    const empty = text => {
      const paragraph = document.createElement("p");
      paragraph.className = "empty";
      paragraph.textContent = text;
      return paragraph;
    };
    const makeSection = (title, content) => {
      const wrapper = document.createElement("section");
      const heading = document.createElement("h4");
      heading.textContent = title;
      wrapper.append(heading, content);
      return wrapper;
    };
    const addText = (text, fallback = "لم ترد معلومات كافية في الاستمارات") => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text || fallback;
      return paragraph;
    };

    names.forEach(name => {
      const data = info[name] || {};
      const details = document.createElement("details");
      details.className = "village";
      details.dataset.name = name;
      details.dataset.search = norm(name);

      const summary = document.createElement("summary");
      summary.textContent = name;
      const body = document.createElement("div");
      body.className = "v-body";

      const overview = data.note ? `${data.note}${data.review ? ` · ${data.review}` : ""}` : data.review || "";
      body.append(makeSection("حالة البيانات", addText(overview, "لا توجد استمارة جديدة مرتبطة بهذه القرية بعد.")));
      body.append(makeSection("السكان والأسر", addText([data.population, data.families].filter(Boolean).join(" — "))));
      body.append(makeSection("الشيخ / المسؤول الإداري", addText(data.sheikh)));
      body.append(makeSection("المياه والطرق", addText(data.water)));
      body.append(makeSection("التعليم", addText(data.education)));
      body.append(makeSection("الصحة", addText(data.health)));
      body.append(makeSection("السوق والنشاط التجاري", addText(data.market)));

      if (data.history) body.append(makeSection("نبذة عن القرية", addText(data.history)));
      if (data.services?.length) {
        const chips = document.createElement("div");
        chips.className = "chips";
        data.services.forEach(service => {
          const chip = document.createElement("span");
          chip.className = "chip";
          chip.textContent = service;
          chips.append(chip);
        });
        body.append(makeSection("معلومات سابقة في الدليل", chips));
      }

      details.append(summary, body);
      list.append(details);
      details.addEventListener("toggle", () => {
        if (details.open) {
          document.querySelectorAll(".village[open]").forEach(other => {
            if (other !== details) other.open = false;
          });
        }
      });
    });

    document.getElementById("villageSearch").addEventListener("input", event => {
      const query = norm(event.target.value);
      let visible = 0;
      document.querySelectorAll(".village").forEach(village => {
        const matches = village.dataset.search.includes(query);
        village.style.display = matches ? "" : "none";
        if (matches) visible++;
      });
      document.getElementById("searchCount").textContent = `${visible} قرية`;
      document.getElementById("noResults").hidden = visible !== 0;
    });

    document.getElementById("serviceCount").textContent = Object.values(info)
      .filter(village => village.water || village.education || village.health || village.market).length;
    document.getElementById("knownCount").textContent = Object.values(info).filter(village => village.note).length;
    document.getElementById("villageCount").textContent = names.length;
  })
  .catch(() => {
    const list = document.getElementById("villageList");
    if (list) {
      const paragraph = document.createElement("p");
      paragraph.className = "no-results";
      paragraph.textContent = "تعذّر تحميل بيانات القرى. أعد المحاولة لاحقاً.";
      list.append(paragraph);
    }
  });
