/* Saathi - Standalone Frontend (No Backend Required) */

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

const LOCAL_LOGOS = {
  uber: "./images/uber.png",
  ola: "./images/ola.png",
  rapido: "./images/rapido.png",
  amazon: "./images/amazon.jpg",
  flipkart: "./images/flipkart.png",
  myntra: "./images/myntra.jpg",
  ajio: "./images/ajio.jpg",
  croma: "./images/croma.jpg",
  swiggy: "./images/swiggy.jpg",
  zomato: "./images/zomato.jpg",
  meesho: "./images/meesho.jpg"
};

function renderPlatform(name) {
  const lower = name.toLowerCase();
  const keyMatch = Object.keys(LOCAL_LOGOS).find(k => lower.includes(k));
  const src = keyMatch ? LOCAL_LOGOS[keyMatch] : null;

  if (!src) return escapeHtml(name);

  return `<span style="display:flex;align-items:center;gap:6px;">
    <img src="${src}" style="height:32px;width:32px;object-fit:contain;" onerror="this.parentElement.innerHTML='${escapeHtml(name)}'">
    ${escapeHtml(name)}
  </span>`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLoading(btn, isLoading) {
  if (!btn) return;
  if (isLoading) {
    btn.dataset.original = btn.textContent;
    btn.textContent = "Comparing...";
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.original || "Compare";
    btn.disabled = false;
  }
}

async function fetchAIInsight(domain, query) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 2000); // 2 second timeout

  try {
    const response = await fetch("http://localhost:8000/ai/insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, query }),
      signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) throw new Error("Backend error");
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    console.warn("AI Insight fetch failed or timed out, using fallback.");
    return null;
  }
}

function renderResultCards(title, cards, insight = "", confidence = "") {
  const root = qs("[data-results]");
  if (!root) return;

  const safeTitle = title ? `<div class="pill">${escapeHtml(title)}</div>` : "";
  const insightText = (insight || "")
    .replace(/<b>/g, "")
    .replace(/<\/b>/g, "")
    .replace(/< b >/g, "")
    .replace(/<\/b >/g, "");

  let confidenceHtml = "";
  if (confidence === "high") {
    confidenceHtml = `<span style="font-size:11px; margin-left:8px; color:#16a34a; font-weight:700">🟢 High Confidence</span>`;
  } else if (confidence === "medium" || insight) {
    confidenceHtml = `<span style="font-size:11px; margin-left:8px; color:#ca8a04; font-weight:700">🟡 Moderate Confidence</span>`;
  }

  const safeInsight = insight ? `<div class="insight-box"><b>Saathi Insight:</b> ${insightText}${confidenceHtml}</div>` : "";

  root.innerHTML = `
    <div class="results">
      ${safeTitle}
      ${cards
      .map((c) => {
        const platformHtml = renderPlatform(c.label || "");
        const label = escapeHtml(c.label || "");
        const meta = escapeHtml(c.meta || "");
        const value = escapeHtml(c.value || "");
        const tag = c.tag ? `<span class="pill">${escapeHtml(c.tag)}</span>` : "";
        const logoStyle = "width:100%;height:100%;max-width:64px;max-height:64px;object-fit:contain;padding:8px;background:white;border-radius:14px;display:flex;align-items:center;justify-content:center;";
        let logo = "";

        if (c.logo && !c.isTravel) {
          if (c.logo.startsWith("<svg")) {
            logo = `<div style="${logoStyle}">${c.logo}</div>`;
          } else {
            logo = `<img src="${c.logo}" style="${logoStyle}" alt="${label}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\'font-weight:bold;color:#2563eb\'>${label[0]}</span>'">`;
          }
        }

        // Extended info for shopping
        let extra = "";
        if (c.lowest_ever && c.peak_price) {
          const recClass = c.recommendation === "Good time to buy" ? "rec-good" : "rec-wait";
          extra = `
              <div class="price-history">
                <span>Lowest Ever: <b>₹${c.lowest_ever.toLocaleString()}</b></span>
                <span>Peak Price: <b>₹${c.peak_price.toLocaleString()}</b></span>
              </div>
              <div class="recommendation ${recClass}">
                ${c.recommendation}
              </div>
            `;
        }

        return `
            <div class="card card-pad">
              <div class="result-row">
                <div class="thumb" aria-hidden="true" style="display:none">${logo}</div>
                <div style="min-width: 0; flex: 1;">
                  <p class="result-title" style="display: flex; align-items: center;">${platformHtml}</p>
                  <p class="result-meta">${meta}</p>
                  ${extra}
                </div>
                <div style="display: grid; justify-items: end; gap: 8px;">
                  <strong>${value}</strong>
                  ${tag}
                </div>
              </div>
            </div>
          `;
      })
      .join("")}
      ${safeInsight}
    </div>
  `;
}

// --- STANDALONE ENGINES ---

const SHOPPING_DATA = {
  electronics: {
    platforms: ["Amazon", "Flipkart", "Croma"],
    items: {
      "iphone 11": [35000, 45000], "iphone 12": [40000, 50000], "iphone 13": [50000, 60000],
      "iphone 14": [60000, 70000], "iphone 15": [70000, 85000], "iphone pro": [100000, 160000],
      "iphone": [35000, 160000], "samsung s": [40000, 100000], "samsung a": [15000, 30000],
      "oneplus": [25000, 60000], "redmi": [8000, 25000], "realme": [8000, 25000],
      "vivo": [12000, 35000], "oppo": [12000, 35000], "macbook air": [90000, 130000],
      "macbook pro": [150000, 250000], "dell": [40000, 90000], "hp": [40000, 90000],
      "lenovo": [40000, 90000], "gaming laptop": [70000, 150000], "laptop": [40000, 150000],
      "airpods": [10000, 25000], "boat": [500, 3000], "jbl": [2000, 20000],
      "sony": [2000, 20000], "fridge": [12000, 50000], "washing machine": [15000, 40000],
      "microwave": [5000, 15000], "smart tv": [20000, 100000], "straightener": [800, 5000],
      "hair dryer": [700, 4000], "trimmer": [1000, 5000]
    }
  },
  fashion: {
    platforms: ["Myntra", "Ajio", "Meesho"],
    items: {
      "kurti": [200, 500], "kurta set": [1100, 4000], "saree": [500, 8000],
      "dress": [500, 5000], "skirt": [800, 3000], "tops": [400, 1500],
      "t-shirt": [300, 800], "casual shirt": [700, 2000], "formal shirt": [500, 3000],
      "jeans": [1200, 3500], "tracks": [800, 2500], "hoodie": [900, 2500], "blazer": [3000, 8000]
    }
  },
  accessories: {
    platforms: ["Amazon", "Flipkart", "Myntra"],
    items: {
      "smartwatch": [1500, 10000], "analog watch": [500, 5000], "watch": [500, 10000],
      "sunglasses": [300, 3000], "handbag": [800, 5000], "backpack": [700, 4000],
      "wallet": [200, 1500], "belt": [300, 1500], "cap": [200, 800]
    }
  }
};

const AREA_RESTAURANTS = {
  "Kukatpally": ["Mehfil", "Paradise", "Kritunga", "Local Mess"],
  "Hitech City": ["Shah Ghouse", "Cafe Bahar", "Bawarchi Express", "Cloud Kitchens"],
  "Madhapur": ["Shah Ghouse", "Cafe Bahar", "Bawarchi Express", "Cloud Kitchens"],
  "Gachibowli": ["Shah Ghouse", "Sarvi", "Kritunga", "The Great Kabab Factory"],
  "Ameerpet": ["Bawarchi", "Santosh Dhaba", "Local Canteen", "Mehfil"],
  "Secunderabad": ["Alpha Hotel", "Paradise", "Lucky Restaurant", "Blue Fox"],
  "Tolichowki": ["Shah Ghouse", "Shadab", "Imperial", "Pista House"],
  "Mehdipatnam": ["Shah Ghouse", "Pista House", "Diamond Restaurant"],
  "Kompally": ["Kritunga", "Mehfil", "Local Kitchens"],
  "Suchitra": ["Kritunga", "Mehfil", "Local Kitchens"],
  "Balanagar": ["Local Mess", "Santosh Dhaba", "Mehfil"],
  "LB Nagar": ["Kritunga", "Mehfil", "Sagar Ratna"]
};

// STEP 1 — Restaurant Tier System
const RESTAURANT_TIERS = {
  "premium": { base: [240, 320] },
  "mid": { base: [180, 240] },
  "budget": { base: [140, 190] }
};

// STEP 2 — Category Intelligence
const CATEGORY_TIERS = {
  "biryani": "mid", // Often swings to premium
  "tiffins": "budget",
  "pizza": "mid",
  "fast_food": "mid",
  "chinese": "mid",
  "street_food": "budget",
  "north_indian": "mid",
  "south_indian": "budget"
};

// STEP 3 — Area Price Multipliers
const AREA_PRICE_MOD = {
  "Hitech City": 15,
  "Gachibowli": 15,
  "Tolichowki": -10,
  "Secunderabad": -5
};

const FOOD_CONFIG = {
  categories: {
    biryani: {
      dishes: { "chicken biryani": 250, "mutton biryani": 350, "veg biryani": 200, "egg biryani": 220, "hyderabadi biryani": 280 },
      restaurants: [
        { name: "Paradise Biryani", tier: "premium", rating: 4.5, photo: "https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8?w=400&h=160&fit=crop" },
        { name: "Bawarchi", tier: "mid", rating: 4.3, photo: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=160&fit=crop" },
        { name: "Mehfil", tier: "budget", rating: 4.1, photo: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=160&fit=crop" }
      ]
    },
    north_indian: {
      dishes: { "paneer butter masala": 220, "butter chicken": 320, "dal makhani": 180, "naan": 40, "tandoori chicken": 280, "shahi paneer": 240, "chole bhature": 120 },
      restaurants: [
        { name: "Peshawri", tier: "premium", rating: 4.8, photo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=160&fit=crop" },
        { name: "Santosh Dhaba", tier: "mid", rating: 4.2, photo: "https://images.unsplash.com/photo-1601050633647-81a35d37c331?w=400&h=160&fit=crop" },
        { name: "Punjabi Rasoi", tier: "budget", rating: 3.9, photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=160&fit=crop" }
      ]
    },
    south_indian: {
      dishes: { "idli": 60, "vada": 70, "masala dosa": 90, "upma": 50, "mysore masala dosa": 110, "pongal": 80, "uttapam": 100 },
      restaurants: [
        { name: "Chutneys", tier: "premium", rating: 4.6, photo: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&h=160&fit=crop" },
        { name: "Minerva Coffee Shop", tier: "mid", rating: 4.4, photo: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&h=160&fit=crop" },
        { name: "Udipi Veg", tier: "budget", rating: 4.0, photo: "https://images.unsplash.com/photo-1626777559315-b003a7131342?w=400&h=160&fit=crop" }
      ]
    },
    fast_food: {
      dishes: { "burger": 150, "pizza": 350, "french fries": 100, "chicken wings": 250, "pasta": 180, "sandwich": 120, "tacos": 160 },
      restaurants: [
        { name: "McDonald's", tier: "mid", rating: 4.1, photo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=160&fit=crop" },
        { name: "KFC", tier: "mid", rating: 4.2, photo: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&h=160&fit=crop" },
        { name: "Domino's", tier: "premium", rating: 4.3, photo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=160&fit=crop" },
        { name: "Burger King", tier: "mid", rating: 4.1, photo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=160&fit=crop" }
      ]
    },
    chinese: {
      dishes: { "manchurian": 180, "hakka noodles": 160, "fried rice": 150, "spring rolls": 120, "momos": 100, "schezwan rice": 170, "chow mein": 140 },
      restaurants: [
        { name: "Beijing Bites", tier: "premium", rating: 4.4, photo: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=160&fit=crop" },
        { name: "Chung Hua", tier: "mid", rating: 4.2, photo: "https://images.unsplash.com/photo-1541696490-8744a5db022b?w=400&h=160&fit=crop" },
        { name: "Local Chinese", tier: "budget", rating: 3.7, photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=160&fit=crop" }
      ]
    },
    street_food: {
      dishes: { "pani puri": 40, "chaat": 60, "pav bhaji": 80, "vada pav": 30, "samosa": 20, "bhel puri": 50, "dahi puri": 60 },
      restaurants: [
        { name: "Haldiram's", tier: "premium", rating: 4.5, photo: "https://images.unsplash.com/photo-1601050633647-81a35d37c331?w=400&h=160&fit=crop" },
        { name: "Gangotree", tier: "mid", rating: 4.3, photo: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=160&fit=crop" },
        { name: "Street Stall", tier: "budget", rating: 4.0, photo: "https://images.unsplash.com/photo-1606491956689-2ea8ac03c401?w=400&h=160&fit=crop" }
      ]
    }
  }
};

function getShoppingDeals(query) {
  const q = query.toLowerCase();
  let category = "general", range = [500, 5000], platforms = ["Amazon", "Flipkart", "Meesho"];
  for (const [cat, data] of Object.entries(SHOPPING_DATA)) {
    for (const [item, pRange] of Object.entries(data.items)) {
      if (q.includes(item)) { category = cat; range = pRange; platforms = data.platforms; break; }
    }
    if (category !== "general") break;
  }
  const base = Math.floor(Math.random() * (range[1] - range[0])) + range[0];
  const deals = platforms.map(p => {
    let mod = 0.95 + Math.random() * 0.1;
    if (category === "electronics" && p === "Flipkart") mod *= 0.96;
    if (category === "fashion") { if (p === "Myntra") mod *= 1.1; if (p === "Meesho") mod *= 0.85; }
    const current = Math.floor(base * mod);
    const lowest = Math.floor(current * (0.75 + Math.random() * 0.2)), peak = Math.floor(current * (1.1 + Math.random() * 0.3));
    return { label: p, value: `₹${current.toLocaleString()} `, current_price: current, lowest_ever: lowest, peak_price: peak, recommendation: current < lowest * 1.1 ? "Good time to buy" : "Wait for price drop" };
  });
  deals.sort((a, b) => a.current_price - b.current_price);
  deals[0].tag = "Best Deal";
  return { deals, insight: `${deals[0].label} offers the best price.${deals[0].recommendation} !` };
}

function getFoodDeals(dish, area = "Kukatpally") {
  const q = dish.toLowerCase();

  // 1. Determine Category and Tier Bias (Step 2)
  let category = "north_indian";
  for (const [cat, data] of Object.entries(FOOD_CONFIG.categories)) {
    if (Object.keys(data.dishes).some(d => q.includes(d))) {
      category = cat;
      break;
    }
  }
  const categoryBias = CATEGORY_TIERS[category] || "mid";
  let tierPreference = categoryBias;
  if (category === "biryani" && Math.random() < 0.4) tierPreference = "premium";
  if (category === "tiffins" && Math.random() < 0.4) tierPreference = "mid";

  // 2. Map Area-Aware Restaurants (Step 5)
  const areaKey = Object.keys(AREA_RESTAURANTS).find(a => area.includes(a)) || "Kukatpally";
  const restaurantPool = AREA_RESTAURANTS[areaKey];

  const restaurantDeals = restaurantPool.slice(0, 4).map(resName => {
    // Determine restaurant tier (match from FOOD_CONFIG or fallback to category bias)
    let tier = tierPreference;
    for (const catData of Object.values(FOOD_CONFIG.categories)) {
      const match = catData.restaurants.find(r => r.name === resName);
      if (match) { tier = match.tier; break; }
    }

    // 3. Dataset-Driven Base Pricing (Step 1)
    const band = RESTAURANT_TIERS[tier].base;
    let basePrice = Math.floor(band[0] + Math.random() * (band[1] - band[0]));

    // 4. Locality Multiplier (Step 3)
    const localitySurge = AREA_PRICE_MOD[areaKey] || 0;
    basePrice += localitySurge;

    // 5. Swiggy vs Zomato Real Modeling (Step 4)
    // Swiggy: Base + ₹10–₹20
    let swiggyPrice = basePrice + Math.floor(10 + Math.random() * 11);
    // Zomato: Base + ₹0–₹10
    let zomatoPrice = basePrice + Math.floor(Math.random() * 11);

    // Allow ~10% ties
    if (Math.random() < 0.1) {
      zomatoPrice = swiggyPrice;
    }

    return {
      name: resName,
      swiggy: swiggyPrice,
      zomato: zomatoPrice,
      rating: (4.0 + Math.random() * 0.8).toFixed(1),
      time: 20 + Math.floor(Math.random() * 20),
      tier: tier
    };
  });

  // 6. Generate Flat Results for Platform Comparison
  const flatResults = restaurantDeals.map(d => [
    {
      label: `${d.name} (Swiggy)`,
      value: `₹${d.swiggy}`,
      meta: `${d.rating}★ • ${d.time} mins`,
      tag: "Fast Delivery",
      price: d.swiggy
    },
    {
      label: `${d.name} (Zomato)`,
      value: `₹${d.zomato}`,
      meta: `${d.rating}★ • ${d.time + 5} mins`,
      tag: d.zomato < d.swiggy ? "Best Price" : (d.zomato === d.swiggy ? "Price Tie" : "Gold Exclusive"),
      price: d.zomato
    }
  ]).flat();

  // 7. Area-Aware Global Insight (Step 6)
  let insight = `${areaKey} shows consistent pricing for ${dish} across platforms today.`;
  if (AREA_PRICE_MOD[areaKey] > 0) {
    insight = `<b>Saathi Insight:</b> Tech hub areas like ${areaKey} show mild surges during dinner hours.`;
  } else if (AREA_PRICE_MOD[areaKey] < 0) {
    insight = `<b>Saathi Insight:</b> Budget pricing remains stable in the ${areaKey} locality.`;
  } else if (flatResults.some((r, i) => i % 2 === 1 && r.price < flatResults[i - 1].price)) {
    insight = `<b>Saathi Insight:</b> Zomato currently edges ahead in value here.`;
  }

  // 8. Inject "Delivery Secrets" if applicable
  if (q.includes("dosa")) {
    insight = "<b>Delivery Secret:</b> Use Swiggy. Small orders benefit from Swiggy's lower platform fee on low-value carts.";
  } else if (q.includes("haleem")) {
    insight = "<b>Delivery Secret:</b> Use Zomato Gold. The 15-20% flat discount on Gold outweighs the slightly higher base price.";
  } else if (q.includes("pizza")) {
    insight = "<b>Delivery Secret:</b> Always check Zomato first. Pizza chains have the most 'Zomato Gold Exclusive' 1+1 offers.";
  }

  return { results: flatResults, restaurantDeals, insight };
}

function getTravelDeals(p, d, vType = "Cab") {
  // 1. Distance & Surge Simulation based on text inputs
  const combined = (p + d).toLowerCase().replace(/\s/g, "");
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }

  const seed = Math.abs(hash);
  const dist = (seed % 35) + 3; // 3km to 38km
  const surge = 1 + ((seed % 10) / 20); // 1.0 to 1.45 surge

  // 2. Vehicle Configuration
  const V_CONFIG = {
    Bike: { name: "Bike", base: 20, rate: 7 },
    Auto: { name: "Auto", base: 35, rate: 11 },
    Cab: { name: "Cab", base: 55, rate: 17 }
  };
  const cfg = V_CONFIG[vType] || V_CONFIG.Cab;

  // 3. Platform Branding
  const platforms = [
    { name: "Uber", mod: 1.05, meta: "3 min away" },
    { name: "Ola", mod: 1.02, meta: "5 min away" },
    { name: "Rapido", mod: 0.95, meta: "2 min away" }
  ];

  const results = platforms.map(p => {
    // Random fluctuation within 10% for realism
    const variability = 0.9 + (Math.random() * 0.2);
    let pMod = p.mod;

    // Platform Strength Logic
    if (vType === "Bike") {
      if (p.name === "Rapido") pMod *= 0.85; // Rapido cheapest for Bike
      if (p.name === "Uber") pMod *= 0.95; // Uber competitive for Bike
    } else if (vType === "Cab") {
      if (p.name === "Uber") pMod *= 0.92; // Uber generally cheaper than Ola for Cab
      if (p.name === "Rapido") pMod *= 1.3; // Rapido not a major Cab player / premium
    } else if (vType === "Auto") {
      if (p.name === "Ola") pMod *= 0.90; // Ola Auto competitive
      if (p.name === "Uber") pMod *= 1.05; // Uber Auto slightly higher
    }

    let price = Math.floor((cfg.base + (dist * cfg.rate)) * surge * variability * pMod);

    // Formatting meta
    let serviceName = p.name;
    if (vType === "Cab") serviceName += (p.name === "Uber" ? " Go" : " Mini");
    else if (vType === "Bike") serviceName += " Moto";
    else serviceName += " Auto";

    return {
      label: serviceName,
      isTravel: true,
      meta: `${p.meta} • ${vType} `,
      value: `₹${price} `,
      tag: (p.name === "Rapido" && vType === "Bike") || (p.name === "Uber" && vType === "Cab") ? "Best Deal" : "",
      price: price,
      dist: dist
    };
  });

  results.sort((a, b) => a.price - b.price);

  const best = results[0].label;
  const route = `${p} → ${d} (${dist} km)`;
  const insight = `<b>${vType}</b> fares are currently ${surge > 1.2 ? "high" : "stable"}. ${best} is the smartest choice for this trip.`;

  return { results, insight, route };
}

function initTravel() {
  const pickup = qs("[data-travel-pickup]"), drop = qs("[data-travel-drop]"), vehicle = qs("[data-travel-vehicle]"), btn = qs("[data-travel-compare]");
  if (!pickup || !drop || !btn) return;
  btn.onclick = async function () {
    const p = pickup.value.trim(), d = drop.value.trim(), v = vehicle ? vehicle.value : "Cab";
    if (!p || !d) { alert("Enter both Pickup and Drop."); (!p ? pickup : drop).focus(); return; }
    setLoading(btn, true);
    setTimeout(async () => {
      const data = getTravelDeals(p, d, v);
      renderResultCards(data.route, data.results, data.insight);
      setLoading(btn, false);

      const aiData = await fetchAIInsight("travel", `${p} to ${d}`);
      if (aiData) {
        renderResultCards(data.route, data.results, aiData.insight, aiData.confidence);
      }
    }, 600);
  };
}

function initChips() {
  qsa("[data-chip]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const pVal = chip.dataset.pickup, dVal = chip.dataset.drop;
      if (pVal && dVal) {
        const pInp = qs("[data-travel-pickup]"), dInp = qs("[data-travel-drop]");
        if (pInp && dInp) {
          pInp.value = pVal; dInp.value = dVal;
          const btn = qs("[data-travel-compare]");
          if (btn) btn.click();
        }
        return;
      }
      const targetSel = chip.dataset.target, value = chip.dataset.value || chip.textContent || "", input = targetSel ? qs(targetSel) : null;
      if (!input) return;
      input.value = value.trim();
      input.focus();
      if (location.pathname.includes("food.html")) {
        const foodBtn = qs("[data-food-compare]"), resBtn = qs("[data-res-search]");
        if (foodBtn) foodBtn.click(); else if (resBtn) resBtn.click();
      } else {
        const btn = qs(chip.dataset.btn || "#compareBtn") || qs("[data-food-compare]") || qs("[data-travel-compare]");
        if (btn) btn.click();
      }
    });
  });
}

function initShopping() {
  const input = document.getElementById("shopInput"), button = document.getElementById("compareBtn");
  if (!input || !button) return;
  const performSearch = async function () {
    const value = input.value.trim();
    if (!value) { alert("Type a product name first."); return; }
    setLoading(button, true);
    setTimeout(async () => {
      const data = getShoppingDeals(value);
      renderResultCards(`Shopping • ${value} `, data.deals, data.insight);
      setLoading(button, false);

      const aiData = await fetchAIInsight("shopping", value);
      if (aiData) {
        renderResultCards(`Shopping • ${value} `, data.deals, aiData.insight, aiData.confidence);
      }
    }, 600);
  };
  button.onclick = (e) => { e.preventDefault(); performSearch(); };
  input.onkeypress = (e) => { if (e.key === "Enter") { e.preventDefault(); performSearch(); } };
}


const runFoodSearch = async (query) => {
  if (!query) return;

  const foodBtn = qs("[data-food-compare]");
  const resBtn = qs("[data-res-search]");
  const resultsContainer = qs("[data-res-results]");

  if (foodBtn) setLoading(foodBtn, true);
  if (resBtn) resBtn.disabled = true;

  if (resultsContainer) resultsContainer.innerHTML = '<div class="loading-spinner"></div>';

  setTimeout(async () => {
    // Get Selected Area
    const areaSelect = qs("#areaSelect");
    const area = areaSelect ? areaSelect.value : "Kukatpally";

    // 1. Get Comparison Deals (Step 4 & 5)
    const dealsData = getFoodDeals(query, area);
    renderResultCards(`Food • ${query} `, dealsData.results, dealsData.insight);

    // 2. Get Restaurant Discovery Results (Area Aware + Platform Prices)
    if (resultsContainer) {
      renderResCards(dealsData.restaurantDeals);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (foodBtn) setLoading(foodBtn, false);
    if (resBtn) resBtn.disabled = false;

    // 3. Update with AI Insight (Skip if Delivery Secret is present)
    if (!dealsData.insight.includes("Delivery Secret")) {
      try {
        const aiData = await fetchAIInsight("food", `${query} in ${area}`);
        if (aiData) {
          renderResultCards(`Food • ${query} `, dealsData.results, aiData.insight, aiData.confidence);
        }
      } catch (e) {
        console.error("AI Insight Error:", e);
      }
    }
  }, 600);
};

function initFood() {
  const input = qs("[data-food-input]");
  const btn = qs("[data-food-compare]");
  if (!input || !btn) return;

  const trigger = (e) => {
    if (e) e.preventDefault();
    const val = input.value.trim();
    if (!val) { alert("Type a dish name first."); input.focus(); return; }
    runFoodSearch(val);
  };

  btn.onclick = trigger;
  input.onkeypress = (e) => { if (e.key === "Enter") trigger(e); };
}

function initResSearch() {
  const input = qs("[data-res-input]");
  const btn = qs("[data-res-search]");
  if (!input || !btn) return;

  const trigger = (e) => {
    if (e) e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    runFoodSearch(val);
  };

  btn.onclick = trigger;
  input.onkeypress = (e) => { if (e.key === "Enter") trigger(e); };
}

function renderResCards(results) {
  const container = qs("[data-res-results]");
  if (!container) return;
  container.innerHTML = results.map(res => {
    const name = escapeHtml(res.name);
    const rating = res.rating ? `⭐ ${res.rating}` : "No rating";

    // Find restaurant in config to get photo
    let rObj = null;
    for (const cat of Object.values(FOOD_CONFIG.categories)) {
      rObj = cat.restaurants.find(r => r.name === res.name);
      if (rObj) break;
    }
    const imgUrl = rObj ? rObj.photo : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=160&fit=crop";

    return `
      <div class="res-card">
        <img src="${imgUrl}" class="res-img" alt="${name}" onerror="this.src='https://via.placeholder.com/400x160?text=Image+Load+Error'">
        <div class="res-info">
          <div class="res-name" title="${name}">${name}</div>
          <div class="res-rating">${rating}</div>
          <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #1e293b;">
              <span>Swiggy</span>
              <span style="font-weight: 700;">₹${res.swiggy}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; color: #1e293b;">
              <span>Zomato</span>
              <span style="font-weight: 700;">₹${res.zomato} ${res.zomato <= res.swiggy ? '<span style="color: #16a34a; font-size: 10px;">(Cheaper)</span>' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initChips(); initShopping(); initTravel(); initFood(); initResSearch();
});
