const names = ["ابوتامة","ابوقيد","ابومليسي","اخيضر","البور","الجقومي","الحلفاية","الحمراية","ام بجكة","ام حريرة","ام دودلي","ام رميلة","ام عويشة","ابوموسيقي","بليلة","جبارة","جرابة","جماع","حلة فضل","حمير الوالي","خشوم","سرنمبي","صبي","عطرون","عكاز المدير","عيال نعيم","فلندو","قصاري","كرجة","كوكدة","مربعات","ود جودات","ود فضل","ود ليونة"];

const info = {
  "ابوتامة": { sheikh:"ابو دكة", history:"قرية من قرى إدارية أبوراي، تقع على مسافة تقارب 10 كيلومترات من أبوراي. تتصل بها عدة طرق، وتحتاج مرافقها التعليمية إلى مزيد من العناية.", services:["مياه: مصادر متنوعة","مدرسة أساسية مختلطة","خدمات سوق أسبوعي"] },
  "ابومليسي": { history:"قرية ذات حضور مجتمعي نشط، وتتوفر فيها مصادر مياه ودوانكي، إلى جانب مدرسة أساسية.", services:["دوانكي ومياه شرب","مدرسة أساسية","سوق أسبوعي"] },
  "ام دودلي": { sheikh:"الهادي عبداللطيف محمد عيسى", history:"تقع أم دودلي على مسافة بعيدة من أبوراي، ويعتمد أهلها على مياه الأمطار والحفائر. تعمل القرية على تحسين التعليم والخدمات الأساسية.", services:["مياه أمطار وحفائر","مدرسة أساسية مختلطة","صيدلية / عيادة مطلوبة","سوق أسبوعي"] },
  "ام رميلة": { sheikh:"حمد حماد الله جاد حمد", history:"قرية شرق مدينة أبوراي، يُوصل إليها عبر محطة مياه أبولكيلك. تتميز بجهود أهلها في دعم المدرسة وتحسين البيئة التعليمية.", services:["مياه أمطار وحفائر","مدرسة ابتدائية مختلطة"] },
  "جرابة": { sheikh:"محمد سليمان بشارة (أبو حوه)", history:"قرية كبيرة من قرى الإدارية، تبعد نحو 20 كيلومتراً عن أبوراي، وتضم مدرسة أساسية تخدم البنين والبنات.", services:["دوانكي ومياه شرب","مدرسة أساسية للبنين والبنات","مركز شرطة قريب"] },
  "حمير الوالي": { sheikh:"حامد محمد حامد سليمان", history:"قرية عامرة بالحركة المجتمعية، فيها مدرسة أساسية وسوق أسبوعي يخدم الأهالي والقرى المحيطة.", services:["دوانكي","مدرسة أساسية","نقطة صحية","سوق أسبوعي"] },
  "سرنمبي": { sheikh:"أسامة سليمان", history:"قرية صغيرة في إدارية أبوراي، تحفظ مكانها في ذاكرة المنطقة وتعمل على تطوير الخدمات المتاحة لأهلها.", services:["دوانكي","موقع قريب من مركز رئيسي"] },
  "صبي": { sheikh:"حامد أحمد الطاهر", history:"قرية تتوفر فيها مدرسة أساسية ونقطة صحية وسوق أسبوعي، وتعمل على دعم استمرارية الخدمات.", services:["دوانكي","مدرسة أساسية","نقطة صحية","سوق أسبوعي"] },
  "مربعات": { sheikh:"تور جاموس / فيصل محمد حامد كرجه / محمد حامد كرجه تورجاموس", history:"من القرى التي تتوفر عنها معلومات متعددة في السجل المجتمعي، وتضم مرافق تعليمية وصحية ونشاطاً تجارياً أسبوعياً.", services:["دوانكي","مدرستان","مركز صحي","سوق أسبوعي","نشاط زراعي وتجاري"] },
  "ود ليونة": { sheikh:"حمد حامد مقدم أحمد", history:"قرية ود ليونة، المعروفة في بعض الردود باسم ودليونه، تقع على مسافة تقارب 70 كيلومتراً من أقرب مركز رئيسي. تتميز بنشاط تجاري وزراعي ممتاز، وتضم مدرسة أساسية ووحدة صحية.", services:["دوانكي (2، واحدة عاملة)","مدرسة خالد بن الوليد الأساسية","وحدة صحية عاملة","سوق أسبوعي يوم الاثنين","منتجات زراعية وحيوانية"] }
};

const list = document.getElementById("villageList");
const empty = text => { const p=document.createElement("p"); p.className="empty"; p.textContent=text; return p; };
const makeSection = (title, content) => { const w=document.createElement("section"); const h=document.createElement("h4"); h.textContent=title; w.append(h, content); return w; };

names.forEach(name => {
  const data = info[name] || {};
  const details = document.createElement("details");
  details.className = "village"; details.dataset.name = name;
  const summary = document.createElement("summary"); summary.textContent = name;
  const body = document.createElement("div"); body.className = "v-body";
  const history = document.createElement("p"); history.textContent = data.history || "";
  body.append(makeSection("نبذة عن القرية", data.history ? history : empty("لم تُضف بعد")));
  const sheikh = document.createElement("p"); sheikh.textContent = data.sheikh || "";
  body.append(makeSection("الشيخ / المسؤول الإداري", data.sheikh ? sheikh : empty("لم يُضف بعد")));
  const chips = document.createElement("div"); chips.className = "chips";
  (data.services || []).forEach(service => { const chip=document.createElement("span"); chip.className="chip"; chip.textContent=service; chips.append(chip); });
  body.append(makeSection("الخدمات والمرافق", data.services?.length ? chips : empty("لم تُضف بعد")));
  details.append(summary, body); list.append(details);
  details.addEventListener("toggle", () => { if (details.open) document.querySelectorAll(".village[open]").forEach(other => { if(other !== details) other.open=false; }); });
});

document.getElementById("villageSearch").addEventListener("input", event => {
  const query = event.target.value.trim(); let visible = 0;
  document.querySelectorAll(".village").forEach(village => { const matches = village.dataset.name.includes(query); village.style.display = matches ? "" : "none"; if(matches) visible++; });
  document.getElementById("searchCount").textContent = `${visible} قرية`;
  document.getElementById("noResults").hidden = visible !== 0;
});

document.getElementById("serviceCount").textContent = Object.values(info).reduce((total, village) => total + (village.services?.length || 0), 0);
document.getElementById("knownCount").textContent = Object.keys(info).length;
