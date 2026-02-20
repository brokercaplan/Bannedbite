import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════
// DATA: BANNED INGREDIENTS (45+)
// ═══════════════════════════════════
const BANNED_INGREDIENTS = [
  { name:"Red Dye 3", aliases:["erythrosine","fd&c red no. 3","fd&c red #3","red 3","e127","red no. 3","red dye no. 3","red dye #3"], category:"Artificial Color", bannedIn:["EU","Japan","Australia"], reason:"Linked to thyroid tumors in animal studies and hyperactivity in children. FDA announced a ban effective January 2027.", severity:"high" },
  { name:"Red 40", aliases:["allura red","fd&c red no. 40","fd&c red #40","red 40","e129","red no. 40","red dye 40","red dye no. 40","red dye #40","red 40 lake"], category:"Artificial Color", bannedIn:["Austria","Belgium","Denmark","France","Germany","Sweden","Switzerland","Norway"], reason:"Associated with hyperactivity in children. Requires warning labels in the EU.", severity:"high" },
  { name:"Yellow 5", aliases:["tartrazine","fd&c yellow no. 5","fd&c yellow #5","e102","yellow no. 5","yellow dye 5","yellow 5 lake"], category:"Artificial Color", bannedIn:["Austria","Norway","Finland"], reason:"Linked to hyperactivity, allergic reactions, and behavioral issues in children.", severity:"medium" },
  { name:"Yellow 6", aliases:["sunset yellow","fd&c yellow no. 6","fd&c yellow #6","e110","yellow no. 6","yellow dye 6","yellow 6 lake"], category:"Artificial Color", bannedIn:["Norway","Finland","Sweden"], reason:"Connected to hyperactivity and possible carcinogenicity. Warning labels required in EU.", severity:"medium" },
  { name:"Blue 1", aliases:["brilliant blue","fd&c blue no. 1","fd&c blue #1","e133","blue no. 1","blue dye 1","blue 1 lake"], category:"Artificial Color", bannedIn:["Austria","Belgium","France","Germany","Norway","Sweden","Switzerland"], reason:"Potential neurotoxicity and chromosomal damage.", severity:"medium" },
  { name:"Blue 2", aliases:["indigo carmine","fd&c blue no. 2","fd&c blue #2","e132","blue no. 2","blue dye 2","blue 2 lake"], category:"Artificial Color", bannedIn:["Norway"], reason:"Linked to brain tumors in animal studies.", severity:"medium" },
  { name:"Green 3", aliases:["fast green","fd&c green no. 3","green no. 3","green dye 3"], category:"Artificial Color", bannedIn:["EU","Japan"], reason:"Potential carcinogen linked to bladder and testes tumors.", severity:"high" },
  { name:"Titanium Dioxide", aliases:["e171","tio2","titanium oxide"], category:"Color Additive", bannedIn:["EU","France"], reason:"Potential genotoxicity. Banned as food additive in EU since August 2022.", severity:"high" },
  { name:"BHA", aliases:["butylated hydroxyanisole","e320"], category:"Preservative", bannedIn:["Japan","EU (restricted)","UK"], reason:"Classified as 'reasonably anticipated to be a human carcinogen.' Known endocrine disruptor.", severity:"medium" },
  { name:"BHT", aliases:["butylated hydroxytoluene","e321"], category:"Preservative", bannedIn:["Japan","EU (restricted)","UK","Australia","New Zealand"], reason:"Potential endocrine disruptor. Not permitted in cereals in Europe.", severity:"medium" },
  { name:"TBHQ", aliases:["tert-butylhydroquinone","tertiary butylhydroquinone","e319"], category:"Preservative", bannedIn:["Japan","EU (restricted)"], reason:"Linked to immune system disruption, vision disturbances, and tumor growth.", severity:"medium" },
  { name:"Propylparaben", aliases:["propyl paraben","e217"], category:"Preservative", bannedIn:["EU"], reason:"Endocrine disruptor that mimics estrogen. Banned in EU food products since 2006.", severity:"high" },
  { name:"Sodium Nitrite", aliases:["e250"], category:"Preservative", bannedIn:["Norway (restricted)","EU (restricted)"], reason:"Forms carcinogenic nitrosamines when heated.", severity:"low" },
  { name:"Sodium Benzoate", aliases:["e211","benzoate of soda"], category:"Preservative", bannedIn:[], reason:"Can form benzene (a carcinogen) when combined with vitamin C.", severity:"low", watchlist:true },
  { name:"Brominated Vegetable Oil", aliases:["bvo","brominated oil","brominated soybean oil"], category:"Emulsifier", bannedIn:["EU","Japan","India","Brazil","100+ countries"], reason:"Accumulates in body tissue. FDA revoked authorization in 2024.", severity:"high" },
  { name:"Carrageenan", aliases:["e407","irish moss extract","carrageenan gum"], category:"Thickener", bannedIn:["EU (infant formula)"], reason:"Linked to gastrointestinal inflammation. Banned in EU infant formula.", severity:"low" },
  { name:"Potassium Bromate", aliases:["e924","bromated flour","potassium bromate flour","bromated"], category:"Flour Treatment", bannedIn:["EU","UK","Canada","Brazil","China","India","Japan","South Korea"], reason:"Classified as Group 2B possible human carcinogen by IARC. Banned in virtually every developed nation except the US.", severity:"high" },
  { name:"Azodicarbonamide", aliases:["ada","e927a","e927"], category:"Flour Treatment", bannedIn:["EU","UK","Australia","Singapore","Brazil"], reason:"Respiratory sensitizer. Breaks down into semicarbazide (potential carcinogen). Also used in yoga mats.", severity:"high" },
  { name:"Bleached Flour", aliases:["enriched bleached flour","bleached wheat flour","bleached enriched flour"], category:"Flour Treatment", bannedIn:["EU","UK","China","Brazil"], reason:"Flour bleaching agents banned in many countries. EU requires flour to whiten naturally.", severity:"medium" },
  { name:"Partially Hydrogenated Oil", aliases:["partially hydrogenated","pho","partially hydrogenated soybean oil","partially hydrogenated cottonseed oil","partially hydrogenated vegetable oil","trans fat"], category:"Artificial Trans Fat", bannedIn:["EU","Canada","Denmark","Switzerland","USA (phasing out)"], reason:"Strongly linked to heart disease, stroke, and type 2 diabetes.", severity:"high" },
  { name:"Olestra", aliases:["olean"], category:"Fat Substitute", bannedIn:["EU","Canada","UK"], reason:"Causes gastrointestinal issues and blocks absorption of vitamins A, D, E, K.", severity:"medium" },
  { name:"High Fructose Corn Syrup", aliases:["hfcs","high fructose corn syrup 55","high fructose corn syrup 42","corn syrup high fructose"], category:"Sweetener", bannedIn:[], reason:"Not banned but heavily restricted/taxed in EU. Linked to obesity and metabolic syndrome.", severity:"low", watchlist:true },
  { name:"rBGH / rBST", aliases:["recombinant bovine growth hormone","recombinant bovine somatotropin","rbgh","rbst","posilac"], category:"Growth Hormone", bannedIn:["EU","Canada","Australia","Japan","New Zealand","Israel"], reason:"Increases IGF-1 linked to cancer risk. Banned in 30+ countries.", severity:"high" },
  { name:"Ractopamine", aliases:["paylean","optaflexx","topmax"], category:"Growth Promoter", bannedIn:["EU","China","Russia","Taiwan","160+ countries"], reason:"Beta-agonist linked to cardiovascular problems. Used in ~80% of US pigs.", severity:"high" },
  { name:"Caramel Color", aliases:["caramel color iii","caramel color iv","e150c","e150d","4-mei","4-methylimidazole"], category:"Color Additive", bannedIn:[], reason:"Contains 4-MEI, classified as possibly carcinogenic. California requires warning labels.", severity:"low", watchlist:true },
  { name:"Diphenylamine", aliases:["dpa"], category:"Pesticide", bannedIn:["EU"], reason:"Post-harvest pesticide used on US apples. Banned in EU since 2012 due to toxic breakdown products.", severity:"medium" },
  { name:"Atrazine", aliases:[], category:"Pesticide", bannedIn:["EU","Switzerland","Germany","Italy"], reason:"Endocrine disruptor found in US drinking water. Banned in EU since 2004.", severity:"high" },
  { name:"Glyphosate", aliases:["roundup"], category:"Pesticide", bannedIn:["Austria","Belgium (partial)","Germany (phasing out)","Luxembourg","Vietnam","Sri Lanka"], reason:"IARC classified as 'probably carcinogenic.' Used as pre-harvest desiccant on US wheat and oats.", severity:"medium" },
  // Red 3 removed — already covered by Red Dye 3 entry above (same ingredient, different alias)
];

// ═══════════════════════════════════
// DATA: BRAND COMPARISONS
// ═══════════════════════════════════
const BRAND_COMPARISONS = [
  { product:"Fanta Orange", icon:"🍊", us:{ingredients:"Carbonated Water, High Fructose Corn Syrup, Citric Acid, Natural Flavors, Sodium Benzoate, Red 40, Yellow 6", flagged:["Red 40","Yellow 6","High Fructose Corn Syrup","Sodium Benzoate"]}, eu:{ingredients:"Carbonated Water, Sugar, Orange Juice (5%), Citric Acid, Natural Orange Flavoring, Carotenes, Paprika Extract", flagged:[]} },
  { product:"Mountain Dew", icon:"🥤", us:{ingredients:"Carbonated Water, High Fructose Corn Syrup, Concentrated Orange Juice, Citric Acid, Natural Flavor, Sodium Benzoate, Caffeine, Gum Arabic, Yellow 5, BVO", flagged:["Yellow 5","Brominated Vegetable Oil","High Fructose Corn Syrup","Sodium Benzoate"]}, eu:{ingredients:"Carbonated Water, Sugar, Citric Acid, Natural Flavoring, Caffeine, Antioxidant (Ascorbic Acid), Concentrated Lemon Juice", flagged:[]} },
  { product:"Froot Loops", icon:"🥣", us:{ingredients:"Corn Flour Blend, Sugar, Wheat Flour, Oat Flour, Modified Food Starch, Vegetable Oil, Salt, Red 40, Blue 1, Yellow 6, Blue 2, BHT, Natural Flavor", flagged:["Red 40","Blue 1","Yellow 6","Blue 2","BHT"]}, eu:{ingredients:"Cereal Flour (Corn, Wheat, Oat), Sugar, Vegetable Oil, Salt, Beetroot Red, Annatto, Paprika Extract, Curcumin, Natural Flavor", flagged:[]} },
  { product:"Kraft Mac & Cheese", icon:"🧀", us:{ingredients:"Enriched Macaroni (Wheat Flour, Niacin, Iron), Cheese Sauce (Whey, Milk, Milk Protein, Salt, Sodium Tripolyphosphate, Citric Acid, Yellow 5, Yellow 6, Enzymes, Annatto)", flagged:["Yellow 5","Yellow 6"]}, eu:{ingredients:"Durum Wheat Macaroni, Cheese Sauce (Whey, Cheddar Cheese, Butter, Milk Protein, Salt, Paprika Extract, Annatto)", flagged:[]} },
  { product:"Doritos Nacho Cheese", icon:"🔺", us:{ingredients:"Corn, Vegetable Oil, Maltodextrin, Salt, Cheddar Cheese, Whey, Monosodium Glutamate, Romano Cheese, Onion Powder, Garlic Powder, Red 40, Yellow 6, Yellow 5, Dextrose, Natural and Artificial Flavors", flagged:["Red 40","Yellow 6","Yellow 5"]}, eu:{ingredients:"Corn, Vegetable Oil, Cheese Powder (Milk, Salt, Enzymes), Maltodextrin, Salt, Whey Powder, Paprika Extract, Sugar, Onion Powder, Garlic Powder, Natural Flavoring", flagged:[]} },
  { product:"Skittles", icon:"🌈", us:{ingredients:"Sugar, Corn Syrup, Hydrogenated Palm Kernel Oil, Citric Acid, Tapioca Dextrin, Natural and Artificial Flavors, Red 40, Titanium Dioxide, Yellow 5, Yellow 6, Blue 2, Blue 1", flagged:["Red 40","Titanium Dioxide","Yellow 5","Yellow 6","Blue 2","Blue 1"]}, eu:{ingredients:"Sugar, Glucose Syrup, Palm Fat, Citric Acid, Fruit Juice, Maltodextrin, Spirulina, Safflower, Radish, Lemon, Black Carrot, Turmeric", flagged:[]} },
];

// ═══════════════════════════════════
// DATA: REGULATORY STANDARDS (30)
// ═══════════════════════════════════
const STANDARDS_DATA = [
  {topic:"Arsenic in Baby Cereal",category:"Contaminants",icon:"👶",us:{limit:"100 ppb (guidance only)",enforcement:"Non-binding FDA guidance",note:"Not legally enforceable"},eu:{limit:"100 µg/kg for infant rice",enforcement:"Legally binding EU Reg. 2015/1006",note:"Mandatory with penalties"},insight:"Same number, different weight. The US limit is voluntary guidance; the EU limit carries legal penalties for violations."},
  {topic:"Mercury in Fish",category:"Contaminants",icon:"🐟",us:{limit:"1.0 ppm (action level)",enforcement:"FDA action level — rarely enforced",note:"Level doubled after industry lawsuit in 1979"},eu:{limit:"0.3–1.0 ppm by species",enforcement:"Legally binding per species",note:"Stricter for commonly eaten fish"},insight:"The US allows 1 ppm across all fish. The EU sets 0.3 ppm for common species like cod and only allows 1.0 ppm for large predators like swordfish."},
  {topic:"Lead in Candy",category:"Contaminants",icon:"🍬",us:{limit:"0.1 ppm (guidance only)",enforcement:"Non-binding FDA guidance",note:"Not enforceable by law"},eu:{limit:"0.01–0.02 ppm",enforcement:"Legally binding",note:"5–10× stricter than US"},insight:"The EU sets legally binding lead limits 5–10× stricter than the US non-binding guidance. Children's candy is a primary exposure pathway."},
  {topic:"Cadmium in Chocolate",category:"Contaminants",icon:"🍫",us:{limit:"No federal limit",enforcement:"No regulation",note:"Some state-level proposals"},eu:{limit:"0.10–0.80 ppm by cocoa %",enforcement:"Legally binding EU Reg. 488/2014",note:"Tiered by cocoa content"},insight:"The US has no federal cadmium limit for chocolate whatsoever. The EU sets binding limits that vary by cocoa percentage."},
  {topic:"Glyphosate on Wheat",category:"Pesticides",icon:"🌾",us:{limit:"30 ppm",enforcement:"EPA tolerance",note:"43× higher than EU"},eu:{limit:"0.7 ppm (being lowered)",enforcement:"Legally binding MRL",note:"Under review for further reduction"},insight:"The US allows 30 ppm of glyphosate residue on wheat — 43× higher than the EU's 0.7 ppm limit. Glyphosate is sprayed on US wheat as a pre-harvest desiccant."},
  {topic:"Neonicotinoids",category:"Pesticides",icon:"🐝",us:{limit:"Widely permitted",enforcement:"EPA registered for 150M+ acres",note:"No outdoor use restrictions"},eu:{limit:"Banned outdoors since 2018",enforcement:"EU Reg. 2018/784-786",note:"Emergency greenhouse-only use"},insight:"The EU banned outdoor neonicotinoid use in 2018 to protect pollinators. The US still allows widespread use on 150M+ acres with no restrictions."},
  {topic:"Growth Hormones in Beef",category:"Animal Additives",icon:"🥩",us:{limit:"6 hormones approved",enforcement:"FDA/USDA approved",note:"Used in ~90% of feedlot cattle"},eu:{limit:"Banned since 1989",enforcement:"EU Directive 96/22/EC",note:"Zero tolerance"},insight:"The EU has banned growth hormones in beef since 1989. The US approves 6 different hormones used in roughly 90% of feedlot cattle."},
  {topic:"Ractopamine in Pork",category:"Animal Additives",icon:"🐷",us:{limit:"Approved — no withdrawal period",enforcement:"FDA approved 1999",note:"Used in 60–80% of US pigs"},eu:{limit:"Banned",enforcement:"Zero tolerance policy",note:"Banned in 160+ countries"},insight:"Ractopamine is used in 60–80% of US pigs but banned in 160+ countries including the EU, China, and Russia due to cardiovascular risks."},
  {topic:"Chlorine-Washed Poultry",category:"Animal Additives",icon:"🍗",us:{limit:"Permitted — standard practice",enforcement:"USDA approved",note:"Used in virtually all US poultry"},eu:{limit:"Banned since 1997",enforcement:"EU Reg. 853/2004",note:"Must use hygiene throughout production"},insight:"The EU bans chlorine-washed chicken, requiring food safety throughout the production chain rather than chemical decontamination at the end."},
  {topic:"Food Dye Warnings",category:"Food Additives",icon:"🎨",us:{limit:"No warnings required",enforcement:"FDA GRAS or approved",note:"No labeling of behavioral risks"},eu:{limit:"Warning labels mandatory",enforcement:"EU Reg. 1333/2008",note:"'May have adverse effect on activity in children'"},insight:"The EU requires warning labels on 6 artificial colors linking them to hyperactivity in children. The US requires no such warnings."},
  {topic:"Titanium Dioxide (E171)",category:"Food Additives",icon:"⚪",us:{limit:"Permitted (<1% by weight)",enforcement:"FDA approved as GRAS",note:"Found in 1,800+ US products"},eu:{limit:"Banned since Aug 2022",enforcement:"EU Reg. 2022/63",note:"EFSA: 'can no longer be considered safe'"},insight:"The EU banned titanium dioxide in food after EFSA found it could cause DNA damage. The US still permits it in 1,800+ products including candy, gum, and frosting."},
  {topic:"Potassium Bromate",category:"Food Additives",icon:"🍞",us:{limit:"Permitted in flour",enforcement:"FDA approved since 1914",note:"Only California requires warning labels"},eu:{limit:"Banned",enforcement:"Banned EU-wide",note:"Banned in virtually all developed nations"},insight:"Potassium bromate is classified as a possible carcinogen and banned in virtually every developed nation except the US, where it's still in bread and flour products."},
  {topic:"BPA in Food Packaging",category:"Food Packaging",icon:"🍼",us:{limit:"Permitted (except baby bottles)",enforcement:"FDA 'safe at current levels'",note:"No comprehensive ban"},eu:{limit:"Banned entirely Jan 2025",enforcement:"EU Reg. 2024/3190",note:"Complete prohibition in food contact materials"},insight:"The EU banned BPA entirely from all food contact materials in 2025. The US only restricts it in baby bottles and sippy cups."},
  {topic:"PFAS in Packaging",category:"Food Packaging",icon:"🧪",us:{limit:"Voluntary phase-out by 2026",enforcement:"FDA voluntary agreement",note:"No binding federal law"},eu:{limit:"Moving toward total ban",enforcement:"ECHA restriction proposal",note:"Would ban all PFAS in food contact"},insight:"The EU is moving to ban all PFAS 'forever chemicals' in food packaging. The US relies on voluntary industry phase-outs with no binding law."},
  {topic:"GMO Labeling",category:"Labeling",icon:"🧬",us:{limit:"QR codes allowed — 'bioengineered'",enforcement:"USDA National Bioengineered Standard",note:"5% threshold, many exemptions"},eu:{limit:"Mandatory text labels >0.9%",enforcement:"EU Reg. 1829/2003",note:"Clear on-package labeling required"},insight:"The EU requires clear on-package text for any GMO content above 0.9%. The US allows QR codes instead of text and sets a higher 5% threshold with many exemptions."},
  {topic:"Allergen Labeling",category:"Labeling",icon:"⚠️",us:{limit:"9 major allergens (FASTER Act)",enforcement:"FDA mandatory since 2023",note:"Sesame added in 2023"},eu:{limit:"14 major allergens",enforcement:"EU Reg. 1169/2011",note:"Includes celery, mustard, lupin, mollusks, sulfites"},insight:"The EU requires labeling for 14 allergens versus the US requiring only 9. The EU additionally covers celery, mustard, lupin, mollusks, and sulfites."},
  {topic:"Front-of-Pack Warnings",category:"Labeling",icon:"🏷️",us:{limit:"None required",enforcement:"No federal requirement",note:"Industry-funded 'Facts Up Front' voluntary"},eu:{limit:"Nutri-Score / traffic lights",enforcement:"Varies by country — mandatory in some",note:"Chile, Mexico use mandatory black warnings"},insight:"The US has no mandatory front-of-pack nutrition warnings. Many EU countries use Nutri-Score or traffic light labels, while Chile and Mexico require bold warning labels."},
  {topic:"Precautionary Principle",category:"Regulatory Approach",icon:"🛡️",us:{limit:"Risk-based — prove harm first",enforcement:"Manufacturers self-certify GRAS",note:"~10,000 additives, many never reviewed by FDA"},eu:{limit:"Precautionary — prove safety first",enforcement:"EFSA reviews before approval",note:"All additives require pre-market safety assessment"},insight:"The EU requires proof of safety before allowing food additives. The US allows manufacturers to self-certify ingredients as safe (GRAS) — roughly 10,000 additives have never been independently reviewed by the FDA."},
];

// ═══════════════════════════════════
// DATA: PRODUCTS
// ═══════════════════════════════════
const PRODUCTS = [
  {name:"Doritos Nacho Cheese",brand:"Frito-Lay",cat:"Snacks",ingredients:"Corn, Vegetable Oil, Maltodextrin, Salt, Cheddar Cheese, Whey, Monosodium Glutamate, Romano Cheese, Onion Powder, Red 40, Yellow 6, Yellow 5, Natural and Artificial Flavors"},
  {name:"Coca-Cola Classic",brand:"Coca-Cola",cat:"Beverages",ingredients:"Carbonated Water, High Fructose Corn Syrup, Caramel Color, Phosphoric Acid, Natural Flavors, Caffeine"},
  {name:"Froot Loops",brand:"Kellogg's",cat:"Cereals",ingredients:"Corn Flour Blend, Sugar, Wheat Flour, Oat Flour, Modified Food Starch, Vegetable Oil, Salt, Red 40, Blue 1, Yellow 6, Blue 2, BHT, Natural Flavor"},
  {name:"Oreo Cookies",brand:"Mondelez",cat:"Snacks",ingredients:"Unbleached Enriched Flour, Sugar, Palm Oil, Cocoa, High Fructose Corn Syrup, Leavening, Corn Starch, Salt, Soy Lecithin, Vanillin, Chocolate"},
  {name:"Skittles Original",brand:"Mars",cat:"Snacks",ingredients:"Sugar, Corn Syrup, Hydrogenated Palm Kernel Oil, Citric Acid, Natural and Artificial Flavors, Red 40, Titanium Dioxide, Yellow 5, Yellow 6, Blue 2, Blue 1"},
  {name:"Pop-Tarts Strawberry",brand:"Kellogg's",cat:"Breakfast",ingredients:"Enriched Flour, Corn Syrup, High Fructose Corn Syrup, Sugar, Soybean Oil, Bleached Wheat Flour, Red 40, TBHQ, Gelatin, Caramel Color, Yellow 6"},
  {name:"Cheez-It Original",brand:"Kellogg's",cat:"Snacks",ingredients:"Enriched Flour, Vegetable Oil (Soybean, Palm), Cheese (Skim Milk, Cheese Cultures, Salt, Enzymes), Salt, Paprika, Yeast, TBHQ, Annatto Extract"},
  {name:"Mountain Dew",brand:"PepsiCo",cat:"Beverages",ingredients:"Carbonated Water, High Fructose Corn Syrup, Concentrated Orange Juice, Citric Acid, Natural Flavor, Sodium Benzoate, Caffeine, Sodium Citrate, Gum Arabic, Yellow 5, BVO"},
  {name:"Lucky Charms",brand:"General Mills",cat:"Cereals",ingredients:"Oat Flour, Marshmallows (Sugar, Corn Syrup, Dextrose, Gelatin, Artificial Flavor, Yellow 5, Red 40, Yellow 6, Blue 1), Sugar, Corn Starch, Corn Syrup, Trisodium Phosphate, BHT"},
  {name:"Gatorade Orange",brand:"PepsiCo",cat:"Beverages",ingredients:"Water, Sugar, Dextrose, Citric Acid, Salt, Sodium Citrate, Monopotassium Phosphate, Gum Arabic, Glycerol Ester of Rosin, Natural Flavor, Yellow 6, Red 40"},
  {name:"Wonder Bread",brand:"Flowers Foods",cat:"Bread",ingredients:"Enriched Bleached Flour (Wheat Flour, Malted Barley Flour, Niacin, Iron, Thiamine, Riboflavin, Folic Acid), Water, High Fructose Corn Syrup, Yeast, Soybean Oil, Salt, Calcium Sulfate, Azodicarbonamide"},
  {name:"Heinz Yellow Mustard",brand:"Kraft Heinz",cat:"Condiments",ingredients:"Distilled White Vinegar, Mustard Seed, Water, Salt, Turmeric, Paprika, Spice, Natural Flavor, Garlic Powder"},
  {name:"Starbursts Original",brand:"Mars",cat:"Snacks",ingredients:"Sugar, Corn Syrup, Hydrogenated Palm Kernel Oil, Fruit Juice (Apple, Lemon, Strawberry, Orange), Citric Acid, Gelatin, Natural and Artificial Flavors, Red 40, Yellow 5, Yellow 6, Blue 1, Titanium Dioxide"},
  {name:"Trident White Gum",brand:"Mondelez",cat:"Snacks",ingredients:"Sorbitol, Gum Base, Mannitol, Natural and Artificial Flavoring, Xylitol, Acesulfame Potassium, Aspartame, Titanium Dioxide, Sucralose, BHT"},
  {name:"Mentos Freshmint Gum",brand:"Perfetti Van Melle",cat:"Snacks",ingredients:"Sorbitol, Gum Base, Xylitol, Natural and Artificial Flavors, Mannitol, Aspartame, Acesulfame K, Titanium Dioxide, Green 3, BHT"},
  {name:"Duncan Hines Frosting",brand:"Conagra",cat:"Snacks",ingredients:"Sugar, Vegetable Oil (Palm), Water, Corn Syrup, Corn Starch, Titanium Dioxide, Salt, Mono and Diglycerides, Polysorbate 60, Sodium Stearoyl Lactylate, Artificial Flavor"},
  {name:"Trolli Sour Crawlers",brand:"Ferrara",cat:"Snacks",ingredients:"Corn Syrup, Sugar, Gelatin, Modified Food Starch, Fumaric Acid, Citric Acid, Lactic Acid, Titanium Dioxide, Red 40, Yellow 5, Blue 1, Natural and Artificial Flavors"},
  {name:"Ring Pop Blue Raspberry",brand:"Bazooka Candy",cat:"Snacks",ingredients:"Sugar, Corn Syrup, Buffered Lactic Acid, Titanium Dioxide, Natural and Artificial Flavors, Blue 1, Red 3, Yellow 5"},
  {name:"Mott's Applesauce",brand:"Dr Pepper Snapple",cat:"Baby & Kids",ingredients:"Apples, High Fructose Corn Syrup, Water, Ascorbic Acid (Vitamin C)"},
  {name:"Welch's Grape Juice",brand:"Welch's",cat:"Beverages",ingredients:"Grape Juice from Concentrate (Water, Grape Juice Concentrate), Grape Juice, Ascorbic Acid (Vitamin C)"},
  {name:"Lay's Classic Chips",brand:"Frito-Lay",cat:"Snacks",ingredients:"Potatoes, Vegetable Oil (Canola, Corn, Soybean, and/or Sunflower Oil), Salt"},
  {name:"Minute Maid Apple Juice",brand:"Coca-Cola",cat:"Beverages",ingredients:"Water, Apple Juice Concentrate, Ascorbic Acid (Vitamin C)"},
];

const PRODUCT_CATEGORIES = ["all","Beverages","Cereals","Snacks","Bread","Condiments","Prepared Foods","Dairy","Breakfast","Baby & Kids"];

// ═══════════════════════════════════
// DATA: SMARTER SHOPPING — CLEAN SWAPS
// ═══════════════════════════════════
const AFFILIATE_TAG = "shotre06-20";
const amzn = (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&ref=nb_sb_noss&sprefix=${encodeURIComponent(q.substring(0,8))}&tag=${AFFILIATE_TAG}&linkCode=ur2`;

// Category detection: match product name + ingredients to a food category
const CATEGORY_RULES = [
  {cat:"mac & cheese",keys:["mac","macaroni","cheese pasta","shells and cheese","velveeta","kraft dinner"]},
  {cat:"cereal",keys:["cereal","froot loops","lucky charms","cheerios","frosted flakes","cap'n crunch","corn flakes","rice krispies","cinnamon toast"]},
  {cat:"bread",keys:["bread","bun","roll","bagel","muffin","wonder bread","sara lee"]},
  {cat:"soda",keys:["soda","cola","pepsi","coca-cola","sprite","fanta","mountain dew","dr pepper","7-up","ginger ale","root beer"]},
  {cat:"juice & drinks",keys:["juice","fruit drink","punch","lemonade","gatorade","powerade","kool-aid","capri sun","minute maid","welch's","mott's","snapple"]},
  {cat:"chips & snacks",keys:["chip","chips","doritos","cheetos","lay's","pringles","ruffles","pretzel","cracker","cheez-it","goldfish","popcorn","fritos","tostitos","tostados","funyuns","takis"]},
  {cat:"candy & sweets",keys:["candy","gum","chocolate","confection","skittles","starburst","ring pop","gummy","sour","trolli","haribo","jolly rancher","twizzler","m&m","reese","snickers","kit kat","mentos","trident","orbit","pop-tart","frosting","icing","duncan hines"]},
  {cat:"ice cream & frozen",keys:["ice cream","frozen dessert","popsicle","gelato","sorbet","frozen yogurt"]},
  {cat:"condiments & sauces",keys:["ketchup","mustard","mayonnaise","sauce","dressing","vinegar","relish","heinz","french's","hellmann's"]},
  {cat:"yogurt & dairy",keys:["yogurt","cream cheese","sour cream","cottage cheese","dannon","yoplait","chobani"]},
  {cat:"baby food",keys:["baby food","infant","puree","toddler","gerber"]},
  {cat:"oats & breakfast",keys:["oat","granola","oatmeal","pancake","waffle"]},
  {cat:"deli & meat",keys:["turkey","ham","salami","bologna","bacon","hot dog","sausage","deli","oscar mayer","hillshire","boar's head"]},
  {cat:"tortillas & wraps",keys:["tortilla","wrap","flatbread","pita","mission","guerrero"]},
  {cat:"milk alternatives",keys:["oat milk","almond milk","soy milk","coconut milk","plant milk","plant-based","oatly","silk"]},
];
// Ingredient-only fallback rules (checked ONLY when product name doesn't match above)
const INGREDIENT_CATEGORY_RULES = [
  {cat:"mac & cheese",keys:["cheese pasta","shells and cheese"]},
  {cat:"cereal",keys:["corn flour","oat flour","rice flour","wheat flour, sugar","corn meal"]},
  {cat:"bread",keys:["enriched flour","bleached flour","dough conditioner","azodicarbonamide","potassium bromate","bromated"]},
  {cat:"soda",keys:["carbonated water","phosphoric acid"]},
  {cat:"juice & drinks",keys:["fruit drink","bvo","brominated vegetable oil"]},
  {cat:"chips & snacks",keys:["tortilla chip","corn chip","tbhq","cheese flavored"]},
  {cat:"candy & sweets",keys:["sugar, corn syrup","gelatin, modified","shellac","confectioner's glaze","candy base"]},
  {cat:"ice cream & frozen",keys:["milkfat","cream, sugar","polysorbate 80"]},
  {cat:"condiments & sauces",keys:["distilled vinegar","tomato concentrate"]},
  {cat:"yogurt & dairy",keys:["cultured milk","rbgh","rbst","milk protein"]},
  {cat:"oats & breakfast",keys:["rolled oats","steel cut oats"]},
  {cat:"deli & meat",keys:["sodium nitrite","nitrate","ractopamine","mechanically separated"]},
  {cat:"milk alternatives",keys:["oat base","almond base"]},
];
function detectCategory(productName, ingredientText) {
  const nameLower = (productName||"").toLowerCase();
  const ingLower = (ingredientText||"").toLowerCase();
  // First pass: check product NAME against name-focused rules (most reliable)
  for (const rule of CATEGORY_RULES) {
    for (const key of rule.keys) {
      if (nameLower.includes(key)) return rule.cat;
    }
  }
  // Second pass: check INGREDIENTS against ingredient-specific rules (avoids false matches)
  for (const rule of INGREDIENT_CATEGORY_RULES) {
    for (const key of rule.keys) {
      if (ingLower.includes(key)) return rule.cat;
    }
  }
  return "general";
}

// Category-based clean alternatives — each shows 2 products in the SAME food category
const CATEGORY_SWAPS = {
  "mac & cheese":{why:"Most conventional mac & cheese contains artificial dyes (Yellow 5, Yellow 6) for color. Cleaner versions use annatto, turmeric, or paprika instead.",alts:[
    {name:"Annie's Organic Mac & Cheese",note:"Colored with annatto & paprika — no synthetic dyes",q:"Annie's organic shells white cheddar mac cheese"},
    {name:"Goodles Protein Mac & Cheese",note:"Plant-based colors, added protein, no artificial anything",q:"Goodles protein mac and cheese"},
  ]},
  "cereal":{why:"Many popular cereals contain artificial dyes, BHA, BHT, or titanium dioxide. Cleaner cereals use fruit/vegetable juice for color and tocopherols as preservatives.",alts:[
    {name:"Nature's Path Organic EnviroKidz",note:"Kid-friendly flavors, no dyes or synthetic preservatives",q:"Nature's Path EnviroKidz organic cereal"},
    {name:"Cascadian Farm Organic Cereal",note:"No artificial colors, flavors, or preservatives",q:"Cascadian Farm organic cereal"},
  ]},
  "bread":{why:"Conventional bread often contains potassium bromate (possible carcinogen), azodicarbonamide (banned in EU), and bleached flour. Cleaner breads skip all three.",alts:[
    {name:"Dave's Killer Bread",note:"Organic, unbromated, no dough conditioners",q:"Dave's Killer bread organic whole grain"},
    {name:"Ezekiel 4:9 Sprouted Bread",note:"Sprouted grains, no flour, no preservatives",q:"Ezekiel 4:9 sprouted grain bread"},
  ]},
  "soda":{why:"Most sodas contain high fructose corn syrup and caramel color (contains 4-MEI, a possible carcinogen). Cleaner options use real sugar or stevia and natural coloring.",alts:[
    {name:"Olipop Prebiotic Soda",note:"Real sugar, prebiotic fiber, no HFCS or caramel color",q:"Olipop prebiotic soda variety pack"},
    {name:"Zevia Zero Calorie Soda",note:"Stevia-sweetened, no artificial colors or HFCS",q:"Zevia zero calorie soda variety pack"},
  ]},
  "juice & drinks":{why:"Many fruit drinks contain artificial dyes, BVO, sodium benzoate, and more sugar than juice. Cleaner versions are 100% juice with no additives.",alts:[
    {name:"Lakewood Organic Juice",note:"100% juice, cold-pressed, no preservatives",q:"Lakewood organic juice cold pressed"},
    {name:"R.W. Knudsen Simply Nutritious",note:"No added sugar, no sodium benzoate",q:"R.W. Knudsen organic juice"},
  ]},
  "chips & snacks":{why:"Many chips contain TBHQ, artificial colors, and inflammatory seed oils. Cleaner chips use avocado or coconut oil and skip synthetic preservatives.",alts:[
    {name:"Kettle Brand Organic Chips",note:"Organic potatoes, no TBHQ or artificial preservatives",q:"Kettle Brand organic potato chips"},
    {name:"Jackson's Sweet Potato Chips",note:"Avocado oil, only 3 ingredients",q:"Jackson's sweet potato chips avocado oil"},
  ]},
  "candy & sweets":{why:"Most candy is loaded with artificial dyes (Red 40, Blue 1, Yellow 5) and titanium dioxide. Cleaner candy uses fruit and vegetable juice for color.",alts:[
    {name:"YumEarth Organic Candy",note:"Fruit juice colored, no synthetic dyes",q:"YumEarth organic candy variety pack"},
    {name:"Unreal Dark Chocolate Gems",note:"Plant-colored coating, no artificial anything",q:"Unreal dark chocolate candy coated gems"},
  ]},
  "ice cream & frozen":{why:"Many ice creams contain carrageenan (gut irritant), artificial colors, and polysorbate 80. Cleaner brands skip these emulsifiers.",alts:[
    {name:"Three Twins Organic Ice Cream",note:"No carrageenan, no artificial colors",q:"organic ice cream no carrageenan"},
    {name:"Alden's Organic Ice Cream",note:"Organic cream, no synthetic emulsifiers",q:"Alden's organic ice cream"},
  ]},
  "condiments & sauces":{why:"Many condiments contain HFCS, caramel color, sodium benzoate, or calcium disodium EDTA. Cleaner versions use simple ingredients.",alts:[
    {name:"Primal Kitchen Ketchup",note:"No HFCS, sweetened with organic date syrup",q:"Primal Kitchen organic ketchup"},
    {name:"Sir Kensington's Condiments",note:"Non-GMO, no artificial preservatives",q:"Sir Kensington's ketchup mustard"},
  ]},
  "yogurt & dairy":{why:"Conventional dairy may come from cows treated with rBGH/rBST growth hormones (banned in EU, Japan, Canada). Organic dairy prohibits growth hormones.",alts:[
    {name:"Stonyfield Organic Yogurt",note:"No rBGH, no artificial sweeteners",q:"Stonyfield organic yogurt"},
    {name:"Organic Valley Dairy Products",note:"Pasture-raised, no growth hormones",q:"Organic Valley organic milk yogurt"},
  ]},
  "baby food":{why:"Even organic baby food can contain heavy metals from soil contamination. Look for brands that test for heavy metals and use clean sourcing.",alts:[
    {name:"Serenity Kids Baby Food",note:"Meat + veggie pouches, tested for heavy metals",q:"Serenity Kids baby food pouches"},
    {name:"Once Upon a Farm",note:"Cold-pressed organic, transparent sourcing",q:"Once Upon a Farm organic baby food"},
  ]},
  "oats & breakfast":{why:"Non-organic oats frequently test positive for glyphosate (used as pre-harvest desiccant). Organic oats have dramatically lower residues.",alts:[
    {name:"Bob's Red Mill Organic Oats",note:"Organic, glyphosate-free tested",q:"Bob's Red Mill organic rolled oats"},
    {name:"One Degree Organic Sprouted Oats",note:"Sprouted for digestion, transparency-sourced",q:"One Degree organic sprouted oats"},
  ]},
  "deli & meat":{why:"Processed meats often contain sodium nitrite (forms carcinogenic nitrosamines) and may come from animals given ractopamine (banned in 160+ countries).",alts:[
    {name:"Applegate Organic Deli Meat",note:"No nitrites, no antibiotics, organic",q:"Applegate organic deli turkey meat"},
    {name:"Niman Ranch Uncured Meats",note:"No ractopamine, humanely raised",q:"Niman Ranch uncured bacon no nitrite"},
  ]},
  "tortillas & wraps":{why:"Many tortillas contain propylparaben (endocrine disruptor banned in EU) and dough conditioners. Cleaner versions use minimal ingredients.",alts:[
    {name:"Siete Grain-Free Tortillas",note:"Almond or cassava flour, no preservatives",q:"Siete almond flour tortillas grain free"},
    {name:"Angelic Bakehouse Sprouted Wraps",note:"Sprouted grains, no propylparaben",q:"Angelic Bakehouse sprouted grain wraps"},
  ]},
  "milk alternatives":{why:"Many plant milks contain carrageenan (gut irritant) and 'natural flavors' that can mask dozens of compounds. Cleaner versions skip both.",alts:[
    {name:"Oatly Oat Milk",note:"No carrageenan, simple ingredients",q:"Oatly oat milk original barista"},
    {name:"MALK Organic Oat Milk",note:"3 ingredients: water, oats, salt",q:"MALK organic oat milk"},
  ]},
  "general":{why:"Many conventional products contain additives banned in other countries. Look for organic or EU-imported alternatives with fewer synthetic ingredients.",alts:[
    {name:"Search Organic Alternatives",note:"Organic products skip most synthetic additives",q:"organic food alternatives no artificial ingredients"},
    {name:"EU-Imported Foods on Amazon",note:"Made under stricter EU food safety laws",q:"European imported food organic"},
  ]},
};

// ═══════════════════════════════════
// UTILITIES
// ═══════════════════════════════════
const SEV = { high:{label:"HIGH RISK",color:"#D32F2F",bg:"#FFF5F5",bd:"#FFCDD2"}, medium:{label:"MODERATE",color:"#EF6C00",bg:"#FFF8E1",bd:"#FFE0B2"}, low:{label:"WATCH",color:"#F9A825",bg:"#FFFDE7",bd:"#FFF9C4"} };

// Country flag emoji mapping
const FLAG=c=>{const m={"EU":"🇪🇺","Japan":"🇯🇵","Australia":"🇦🇺","Austria":"🇦🇹","Belgium":"🇧🇪","Denmark":"🇩🇰","France":"🇫🇷","Germany":"🇩🇪","Sweden":"🇸🇪","Switzerland":"🇨🇭","Norway":"🇳🇴","Finland":"🇫🇮","UK":"🇬🇧","Canada":"🇨🇦","Brazil":"🇧🇷","China":"🇨🇳","India":"🇮🇳","South Korea":"🇰🇷","Russia":"🇷🇺","Taiwan":"🇹🇼","New Zealand":"🇳🇿","Israel":"🇮🇱","Singapore":"🇸🇬","Vietnam":"🇻🇳","Sri Lanka":"🇱🇰","Luxembourg":"🇱🇺"};const k=Object.keys(m).find(k=>c.toLowerCase().includes(k.toLowerCase()));return k?m[k]:"🚫";};
const SAMPLES = [
  { name:"Popular Fruit Drink", ingredients:"Water, High Fructose Corn Syrup, Citric Acid, Natural and Artificial Flavors, Red 40, Sodium Benzoate, Blue 1, BHT" },
  { name:"Sandwich Bread", ingredients:"Enriched Bleached Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine, Riboflavin, Folic Acid, Potassium Bromate), Water, High Fructose Corn Syrup, Soybean Oil, Azodicarbonamide, TBHQ, Yellow 5" },
  { name:"Kids Cereal", ingredients:"Corn Flour, Sugar, Oat Flour, Modified Corn Starch, Salt, Red 3, Yellow 6, Blue 1, BHA, Titanium Dioxide" },
  { name:"Baby Food Pouch", ingredients:"Organic Apple Puree, Organic Spinach, Organic Pear Puree, Organic Kale, Citric Acid, Ascorbic Acid (Vitamin C)" },
  { name:"Classic Potato Chips", ingredients:"Potatoes, Vegetable Oil (Canola, Corn, Soybean, and/or Sunflower Oil), Salt" },
];
const FREE_LIMIT = 3;

function matchIngredients(inputText) {
  const text = inputText.toLowerCase().replace(/[()]/g,' ');
  const results = [];
  for (const item of BANNED_INGREDIENTS) {
    const allNames = [item.name.toLowerCase(), ...item.aliases.map(a=>a.toLowerCase())];
    for (const name of allNames) {
      const regex = name.length < 4 ? new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i') : null;
      if (regex ? regex.test(text) : text.includes(name)) { results.push({...item, matchedTerm:name}); break; }
    }
  }
  results.sort((a,b)=>({high:0,medium:1,low:2}[a.severity]??3)-({high:0,medium:1,low:2}[b.severity]??3));
  return results;
}

const PESTICIDE_RISK_DATA = [
  { crop:"cauliflower", keywords:["cauliflower"], chemical:"Imidacloprid", detectionRate:57.5, type:"Neonicotinoid" },
  { crop:"lettuce", keywords:["lettuce","romaine","iceberg lettuce"], chemical:"Imidacloprid", detectionRate:45.6, type:"Neonicotinoid" },
  { crop:"cherries", keywords:["cherry","cherries","cherry juice"], chemical:"Acetamiprid", detectionRate:45.9, type:"Neonicotinoid" },
  { crop:"spinach", keywords:["spinach"], chemical:"Imidacloprid", detectionRate:38.7, type:"Neonicotinoid" },
  { crop:"kale", keywords:["kale"], chemical:"Imidacloprid", detectionRate:31.4, type:"Neonicotinoid" },
  { crop:"potatoes", keywords:["potato","potatoes","potato starch","potato flakes","potato flour"], chemical:"Imidacloprid", detectionRate:31.2, type:"Neonicotinoid" },
  { crop:"cilantro", keywords:["cilantro","coriander"], chemical:"Imidacloprid", detectionRate:30.6, type:"Neonicotinoid" },
  { crop:"apples", keywords:["apple","apples","apple juice","apple puree","applesauce","apple concentrate","apple sauce"], chemical:"Acetamiprid", detectionRate:29.5, type:"Neonicotinoid" },
  { crop:"grapes", keywords:["grape","grapes","grape juice","raisins"], chemical:"Imidacloprid", detectionRate:28.9, type:"Neonicotinoid" },
  { crop:"collard greens", keywords:["collard greens","collards"], chemical:"Imidacloprid", detectionRate:24.9, type:"Neonicotinoid" },
  { crop:"pears", keywords:["pear","pears","pear juice"], chemical:"Acetamiprid", detectionRate:24.1, type:"Neonicotinoid" },
  { crop:"strawberries", keywords:["strawberry","strawberries","strawberry puree"], chemical:"Acetamiprid", detectionRate:21.3, type:"Neonicotinoid" },
  { crop:"celery", keywords:["celery"], chemical:"Imidacloprid", detectionRate:20.9, type:"Neonicotinoid" },
];

function copyText(text,label){
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>alert((label||"Text")+" copied!")).catch(()=>fallbackCopy(text,label));}else{fallbackCopy(text,label);}
}
function fallbackCopy(text,label){try{const ta=document.createElement("textarea");ta.value=text;ta.style.cssText="position:fixed;opacity:0";document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);alert((label||"Text")+" copied!");}catch(e){prompt("Copy this text:",text);}}

function matchPesticideRisks(inputText) {
  const text = inputText.toLowerCase();
  const results = []; const seen = new Set();
  for (const item of PESTICIDE_RISK_DATA) {
    if (seen.has(item.crop)) continue;
    for (const kw of item.keywords) {
      if (text.includes(kw)) { results.push(item); seen.add(item.crop); break; }
    }
  }
  results.sort((a,b) => b.detectionRate - a.detectionRate);
  return results;
}

function generateFDAReport(productName, flagged) {
  const items = flagged.map(i=>`• ${i.name} (${i.category}) — ${i.severity.toUpperCase()} RISK\n  Banned in: ${i.bannedIn.filter(c=>!c.includes('restricted')).join(', ')||'Under review'}\n  Reason: ${i.reason}`).join('\n\n');
  return { subject:`Food Safety Concern: ${productName}`, body:`To: FDA Center for Food Safety (CFSAN)\n\nRE: Safety Concern — "${productName}"\n\nThis product contains ingredients banned in other developed nations:\n\n${items}\n\nI request the FDA review these ingredients in light of international regulatory decisions.\n\n[Your Name]\n[Your City, State]`, email:'CFSAN-Adverse-Event@fda.hhs.gov' };
}

function generateCongressLetter(repName, productName, flagged) {
  const items = flagged.slice(0,5).map(i=>`• ${i.name}: ${i.reason.split('.')[0]}. Banned in ${i.bannedIn.slice(0,3).join(', ')}.`).join('\n');
  return { subject:'Constituent Concern: Food Ingredients Banned in Other Countries', body:`Dear ${repName || '[Representative/Senator]'},\n\nAs your constituent, I am writing about food safety.\n\n${productName ? `"${productName}" contains:\n${items}\n\n` : ''}The same companies sell cleaner versions in Europe because regulations require it.\n\nI urge you to:\n1. Support legislation requiring FDA review of ingredients banned elsewhere\n2. Mandate warning labels on restricted additives\n3. Close the GRAS self-certification loophole\n\nAmerican families deserve equal food safety protections.\n\n[Your Name]\n[Your Address]` };
}

// ═══════════════════════════════════
// COMPONENTS — Premium Light Theme
// ═══════════════════════════════════
function IngredientCard({item,index}) {
  const [exp,setExp]=useState(false);
  const c=SEV[item.severity];
  const bannedClean = (item.bannedIn||[]).filter(x=>!x.includes('restricted')&&!x.includes('countries'));
  const restrictedClean = (item.bannedIn||[]).filter(x=>x.includes('restricted')||x.includes('countries'));
  return (
    <div onClick={()=>setExp(!exp)} style={{background:"#fff",border:`1px solid ${c.bd}`,borderRadius:16,padding:0,marginBottom:12,cursor:"pointer",transition:"all 0.2s",animation:`slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${index*0.06}s both`,overflow:"hidden"}}>
      {/* Risk severity bar at top */}
      <div style={{height:4,background:c.color,borderRadius:"16px 16px 0 0"}}/>
      <div style={{padding:"14px 18px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{background:c.color,color:"#fff",fontSize:9,fontWeight:700,letterSpacing:1.2,padding:"3px 8px",borderRadius:6,fontFamily:"var(--mono)"}}>{c.label}</span>
              <span style={{fontSize:12,color:"#57534E",fontFamily:"var(--mono)",letterSpacing:0.5}}>{item.category}</span>
            </div>
            <h3 style={{margin:0,fontSize:17,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{item.name}</h3>
          </div>
          <span style={{color:"#78716C",fontSize:14,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0)"}}>▾</span>
        </div>

        {/* Country flag badges - always visible */}
        {bannedClean.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:10,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#78716C",fontFamily:"var(--mono)",marginRight:2}}>Banned in</span>
            {bannedClean.slice(0,6).map((country,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:12,background:c.bg,border:`1px solid ${c.bd}`,borderRadius:6,padding:"2px 7px",color:"#44403C",fontFamily:"var(--mono)"}}>
                {FLAG(country)} {country.replace(' (restricted)','').replace(/\d+\+?\s*countries/,'')}
              </span>
            ))}
            {bannedClean.length>6&&<span style={{fontSize:12,color:"#78716C",fontFamily:"var(--mono)"}}>+{bannedClean.length-6}</span>}
          </div>
        )}

        {/* Expanded detail */}
        {exp&&(
          <div style={{marginTop:14,animation:"fadeIn 0.2s"}}>
            <p style={{margin:"0 0 14px",fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>{item.reason}</p>

            {/* Visual risk bar */}
            <div style={{background:"#F5F5F4",borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#78716C",fontFamily:"var(--mono)",letterSpacing:1,marginBottom:10}}>GLOBAL STATUS</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:18}}>🇺🇸</span>
                <div style={{flex:1,height:24,background:"#FFF5F5",borderRadius:6,border:"1px solid #FFCDD2",display:"flex",alignItems:"center",paddingLeft:10}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#D32F2F",fontFamily:"var(--mono)"}}>LEGAL IN US</span>
                </div>
              </div>
              {bannedClean.length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{FLAG(bannedClean[0])}</span>
                  <div style={{flex:1,height:24,background:"#F0FDF4",borderRadius:6,border:"1px solid #BBF7D0",display:"flex",alignItems:"center",paddingLeft:10}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#166534",fontFamily:"var(--mono)"}}>BANNED IN {bannedClean.length} REGION{bannedClean.length!==1?"S":""}</span>
                  </div>
                </div>
              )}
              {restrictedClean.length>0&&(
                <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
                  <span style={{fontSize:18}}>⚠️</span>
                  <div style={{flex:1}}>
                    <span style={{fontSize:12,color:"#78716C",fontFamily:"var(--body)"}}>{restrictedClean.join(", ")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PesticideRiskCard({item,index}) {
  const [exp,setExp]=useState(false);
  const rc=item.detectionRate>=40?"#D32F2F":item.detectionRate>=25?"#EF6C00":"#F9A825";
  const rl=item.detectionRate>=40?"HIGH":item.detectionRate>=25?"ELEVATED":"MODERATE";
  const cropTips={
    strawberries:{wash:"Soak in water with baking soda for 12–15 min",buy:"Buy organic — #1 on Dirty Dozen",alt:"Blueberries (lower residue when organic)"},
    apples:{wash:"Baking soda soak removes most surface residue",buy:"Buy organic or peel (lose some fiber)",alt:"Pears have lower detection rates"},
    spinach:{wash:"Rinse leaves individually under running water",buy:"Organic spinach has far fewer residues",alt:"Broccoli or cabbage (Clean Fifteen)"},
    potatoes:{wash:"Peel to remove most surface pesticides",buy:"Buy organic or Japanese imports",alt:"Sweet potatoes — not treated with chlorpropham"},
    grapes:{wash:"Rinse clusters under running water, remove stems",buy:"Organic grapes or imported from EU",alt:"Kiwi or pineapple (Clean Fifteen)"},
    tomatoes:{wash:"Rinse thoroughly; cooking reduces residues",buy:"Organic for fresh; conventional canned is lower",alt:"Canned tomatoes often test cleaner"},
    cherries:{wash:"Soak in baking soda + water solution",buy:"Buy organic during season; frozen organic off-season",alt:"Frozen organic cherries are affordable"},
    pears:{wash:"Peel or scrub firmly under running water",buy:"Organic pears when available",alt:"Bananas and avocados (very low residue)"},
    peppers:{wash:"Scrub with vegetable brush under water",buy:"Organic bell peppers worth it",alt:"Onions or sweet corn (Clean Fifteen)"},
    celery:{wash:"Separate stalks and wash each individually",buy:"One of the highest-residue crops — buy organic",alt:"Cucumbers (lower residue conventional)"},
    lettuce:{wash:"Discard outer leaves; soak inner leaves",buy:"Organic or hydroponic/greenhouse-grown",alt:"Cabbage has very low residue levels"},
    wheat:{wash:"Cannot wash grain — it's in the product",buy:"Organic flour or EU-imported bread",alt:"Bob's Red Mill or King Arthur (unbromated)"},
    corn:{wash:"Husk removes most surface residue",buy:"Fresh corn is Clean Fifteen — low risk",alt:"Frozen organic if concerned"},
  };
  const tips=cropTips[item.crop.toLowerCase()]||{wash:"Wash thoroughly under running water",buy:"Choose organic when available",alt:"Check the Clean Fifteen list for lower-residue swaps"};
  return (
    <div onClick={()=>setExp(!exp)} style={{background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:16,padding:"16px 20px",marginBottom:10,cursor:"pointer",transition:"all 0.2s",animation:`slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${index*0.06}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{background:rc,color:"#fff",fontSize:9,fontWeight:700,letterSpacing:1.2,padding:"3px 8px",borderRadius:6,fontFamily:"var(--mono)"}}>{rl}</span>
            <span style={{fontSize:12,color:"#7C3AED",fontFamily:"var(--mono)",letterSpacing:0.5}}>Pesticide Residue</span>
          </div>
          <h3 style={{margin:0,fontSize:17,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{item.crop.charAt(0).toUpperCase()+item.crop.slice(1)} — {item.detectionRate}% detection</h3>
        </div>
        <span style={{color:"#78716C",fontSize:14,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0)"}}>▾</span>
      </div>
      {exp&&(
        <div style={{marginTop:14,animation:"fadeIn 0.2s"}}>
          <p style={{margin:"0 0 12px",fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>
            USDA testing found <strong style={{color:rc}}>{item.detectionRate}%</strong> of US {item.crop} samples contained <strong style={{color:"#1C1917"}}>{item.chemical}</strong> ({item.type}). Neonicotinoids are systemic — absorbed into the plant — so they <strong>cannot be washed off</strong>.
          </p>
          {/* MITIGATION TIPS */}
          <div style={{background:"#fff",borderRadius:10,padding:"12px 14px",marginBottom:10,border:"1px solid #EDE9FE"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)",letterSpacing:1,marginBottom:8}}>WHAT YOU CAN DO</div>
            {[
              {label:"Wash",tip:tips.wash},
              {label:"Buy",tip:tips.buy},
              {label:"Swap",tip:tips.alt},
            ].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:i<2?6:0}}>
                <span style={{fontSize:12,fontWeight:700,color:"#7C3AED",fontFamily:"var(--mono)",width:32,flexShrink:0,marginTop:1}}>{t.label}</span>
                <span style={{fontSize:13,color:"#57534E",lineHeight:1.5,fontFamily:"var(--body)"}}>{t.tip}</span>
              </div>
            ))}
          </div>
          <div style={{background:"#ECFDF5",borderRadius:8,padding:"8px 12px",border:"1px solid #A7F3D0"}}>
            <p style={{margin:0,fontSize:13,color:"#065F46",lineHeight:1.5,fontFamily:"var(--body)"}}>
              <strong>Don't stop eating {item.crop}.</strong> The health benefits of produce far outweigh pesticide risks. These tips help reduce exposure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SmartShoppingPanel({flaggedItems,productName,ingredientText}) {
  const hasFlagged = flaggedItems&&flaggedItems.length>0;
  const cat = detectCategory(productName||"",ingredientText||"");
  const swap = hasFlagged ? (CATEGORY_SWAPS[cat]||CATEGORY_SWAPS["general"]) : null;
  const flaggedNames = hasFlagged ? flaggedItems.map(f=>f.name).join(", ") : "";
  const cleanName = (productName||"").replace(/\s*\(.*?\)/g,"").trim();
  const [expanded,setExpanded]=useState(false);
  const catLabel = cat!=="general"?cat.split(" ").map(w=>w[0].toUpperCase()+w.slice(1)).join(" "):"Version";
  return (
    <div style={{marginTop:20,animation:"slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both"}}>
      <button onClick={()=>setExpanded(!expanded)} style={{width:"100%",padding:"16px 20px",background:"#1C1917",border:"none",borderRadius:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 8px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#fff",fontFamily:"var(--mono)"}}>→</span>
          </div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:14,fontWeight:600,color:"#fff",fontFamily:"var(--heading)"}}>{hasFlagged?"Find Cleaner "+catLabel:"Find Organic & EU Alternatives"}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.6)",fontFamily:"var(--body)",marginTop:2}}>{hasFlagged?`${(swap?.alts?.length||0)+(cleanName?1:0)+2} options without flagged ingredients`:"Shop cleaner versions of this product"}</div>
          </div>
        </div>
        <span style={{color:"rgba(255,255,255,0.5)",fontSize:14,transition:"transform 0.2s",transform:expanded?"rotate(180deg)":"rotate(0)"}}>▾</span>
      </button>
      {expanded&&(
        <div style={{marginTop:10,animation:"fadeIn 0.25s"}}>
          <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:"16px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            {/* HEADER */}
            {hasFlagged&&(
              <div style={{marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:24,height:24,borderRadius:6,background:"#FFF5F5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#D32F2F",fontFamily:"var(--mono)"}}>!</span>
                  </div>
                  <span style={{fontSize:13,fontWeight:600,color:"#78716C",fontFamily:"var(--mono)",letterSpacing:0.5}}>FLAGGED: {flaggedNames}</span>
                </div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginLeft:32}}>
                  {[...new Set(flaggedItems.flatMap(f=>(f.bannedIn||[]).filter(x=>!x.includes('restricted')&&!x.includes('countries'))))].slice(0,6).map((c,i)=>(
                    <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:11,background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:5,padding:"2px 6px",color:"#57534E",fontFamily:"var(--mono)"}}>{FLAG(c)} {c}</span>
                  ))}
                </div>
              </div>
            )}
            <p style={{margin:"0 0 14px",fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>
              {hasFlagged&&swap ? swap.why+" Products from the EU and Japan are made under stricter laws and often skip these ingredients."
                :"EU and Japanese versions are made under stricter regulations with fewer additives and lower pesticide residues."
              }
            </p>

            {/* ALL LINKS IN ONE LIST */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {/* Category-specific clean swaps (only when flagged) */}
              {hasFlagged&&swap&&swap.alts.map((alt,j)=>(
                <a key={"swap"+j} href={amzn(alt.q)} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:10,textDecoration:"none",transition:"all 0.15s",cursor:"pointer"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{alt.name}</div>
                    <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:2}}>{alt.note}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:10}}>
                    <span style={{fontSize:14,color:"#78716C"}}>→</span>
                  </div>
                </a>
              ))}
              {/* Organic version */}
              {cleanName&&(
                <a href={amzn("organic "+cleanName)} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:10,textDecoration:"none",transition:"all 0.15s",cursor:"pointer"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>Organic {cleanName}</div>
                    <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:2}}>USDA Organic — fewer synthetic additives</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:10}}>
                    <span style={{fontSize:14,color:"#78716C"}}>→</span>
                  </div>
                </a>
              )}
              {/* EU version */}
              <a href={amzn("European imported "+(cat!=="general"?cat:cleanName||"food")+" organic")} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:10,textDecoration:"none",transition:"all 0.15s",cursor:"pointer"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>EU-Imported {cat!=="general"?catLabel:(cleanName||"Foods")}</div>
                  <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:2}}>Made under EU regulations — 1,300+ fewer allowed additives</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:10}}>
                  <span style={{fontSize:14,color:"#78716C"}}>→</span>
                </div>
              </a>
              {/* Japan version */}
              <a href={amzn("Japanese imported "+(cat!=="general"?cat:cleanName||"food"))} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:10,textDecoration:"none",transition:"all 0.15s",cursor:"pointer"}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>Japanese {cat!=="general"?catLabel:(cleanName||"Foods")}</div>
                  <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:2}}>Japan's 0.01 ppm limit — 11% vs 61% US detection rate</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0,marginLeft:10}}>
                  <span style={{fontSize:14,color:"#78716C"}}>→</span>
                </div>
              </a>
            </div>
          </div>

          <div style={{padding:"10px 14px",background:"#F5F5F4",borderRadius:10}}>
            <p style={{margin:0,fontSize:13,color:"#78716C",lineHeight:1.5,fontFamily:"var(--body)"}}>
              <strong style={{color:"#57534E"}}>Tip:</strong> The health benefits of eating produce far outweigh pesticide risks. These swaps help reduce exposure without reducing intake.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({open,onClose,title,children}) {
  if(!open)return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.2s"}} onClick={onClose}>
      <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(8px)"}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:"100%",maxWidth:500,maxHeight:"85vh",background:"#fff",borderRadius:"24px 24px 0 0",padding:"28px 24px",overflowY:"auto",animation:"slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",boxShadow:"0 -8px 40px rgba(0,0,0,0.1)"}}>
        <div style={{width:40,height:4,background:"#D6D3D1",borderRadius:2,margin:"0 auto 20px"}}/>
        <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 18px",color:"#1C1917",fontFamily:"var(--heading)"}}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function BrandCard({item,index}) {
  const [exp,setExp]=useState(false);
  return (
    <div onClick={()=>setExp(!exp)} style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"18px 20px",marginBottom:10,cursor:"pointer",transition:"all 0.2s",animation:`slideUp 0.3s ease ${index*0.05}s both`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:28}}>{item.icon}</span>
          <div>
            <h3 style={{margin:0,fontSize:16,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{item.product}</h3>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <span style={{fontSize:14,color:item.us.flagged.length>0?"#D32F2F":"#059669",fontFamily:"var(--mono)",fontWeight:600}}>{item.us.flagged.length>0?`🇺🇸 ${item.us.flagged.length} flagged`:"🇺🇸 ✓"}</span>
              <span style={{color:"#D6D3D1"}}>·</span>
              <span style={{fontSize:14,color:item.eu.flagged.length>0?"#D32F2F":"#059669",fontFamily:"var(--mono)",fontWeight:600}}>{item.eu.flagged.length>0?`🇪🇺 ${item.eu.flagged.length} flagged`:"🇪🇺 ✓"}</span>
            </div>
          </div>
        </div>
        <span style={{color:"#78716C",fontSize:14,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0)"}}>▾</span>
      </div>
      {exp&&(
        <div style={{marginTop:16,display:"grid",gap:12,animation:"fadeIn 0.2s"}}>
          {[{label:"🇺🇸 US Version",data:item.us},{label:"🇪🇺 EU Version",data:item.eu}].map((v,i)=>(
            <div key={i} style={{background:v.data.flagged.length>0?"#FFF5F5":"#F0FDF4",border:`1px solid ${v.data.flagged.length>0?"#FFCDD2":"#BBF7D0"}`,borderRadius:12,padding:14,overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:v.data.flagged.length>0?"#D32F2F":"#059669"}}/>
              <div style={{fontSize:14,fontWeight:700,color:v.data.flagged.length>0?"#D32F2F":"#166534",marginBottom:8,fontFamily:"var(--mono)"}}>{v.label}</div>
              <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{v.data.ingredients}</p>
              {v.data.flagged.length>0&&(
                <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:5}}>
                  {v.data.flagged.map((f,fi)=>{
                    const match=BANNED_INGREDIENTS.find(b=>b.name===f||b.aliases.some(a=>a.toLowerCase()===f.toLowerCase()));
                    const countries=(match?.bannedIn||[]).filter(x=>!x.includes('restricted')&&!x.includes('countries'));
                    return (
                      <span key={fi} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,background:"#FFEBEE",border:"1px solid #FFCDD2",borderRadius:6,padding:"3px 8px",color:"#C62828",fontFamily:"var(--mono)"}}>
                        🚫 {f} {countries.slice(0,3).map(c=>FLAG(c)).join(" ")}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StandardCard({item,index,onFDA,onReps}) {
  const [exp,setExp]=useState(false);
  // Create a pseudo-flagged item from this standard for FDA/Congress letters
  const pseudoItem = {name:item.topic, category:item.category, severity:"high", bannedIn:["EU"], reason:`US standard: ${item.us.limit} (${item.us.enforcement}). EU standard: ${item.eu.limit} (${item.eu.enforcement}). ${item.insight}`};
  return (
    <div onClick={()=>setExp(!exp)} style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"18px 20px",marginBottom:10,cursor:"pointer",transition:"all 0.2s",animation:`slideUp 0.3s ease ${index*0.04}s both`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:12,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)"}}>{String(index+1).padStart(2,"0")}</span>
          </div>
          <div>
            <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{item.topic}</h3>
            <span style={{fontSize:13,color:"#78716C",fontFamily:"var(--mono)",letterSpacing:0.5}}>{item.category}</span>
          </div>
        </div>
        <span style={{color:"#78716C",fontSize:14,transition:"transform 0.2s",transform:exp?"rotate(180deg)":"rotate(0)"}}>▾</span>
      </div>
      {exp&&(
        <div style={{marginTop:16,animation:"fadeIn 0.2s"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div style={{background:"#FFF5F5",borderRadius:12,padding:12,borderTop:"3px solid #D32F2F"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#D32F2F",marginBottom:6,fontFamily:"var(--mono)"}}>🇺🇸 US</div>
              <div style={{fontSize:14,fontWeight:600,color:"#1C1917",marginBottom:4,fontFamily:"var(--body)"}}>{item.us.limit}</div>
              <div style={{fontSize:13,color:"#57534E",lineHeight:1.5,fontFamily:"var(--body)"}}>{item.us.enforcement}</div>
              {item.us.note&&<div style={{fontSize:12,color:"#78716C",marginTop:4,fontFamily:"var(--mono)",fontStyle:"italic"}}>{item.us.note}</div>}
            </div>
            <div style={{background:"#F0FDF4",borderRadius:12,padding:12,borderTop:"3px solid #059669"}}>
              <div style={{fontSize:12,fontWeight:700,color:"#059669",marginBottom:6,fontFamily:"var(--mono)"}}>🇪🇺 EU</div>
              <div style={{fontSize:14,fontWeight:600,color:"#1C1917",marginBottom:4,fontFamily:"var(--body)"}}>{item.eu.limit}</div>
              <div style={{fontSize:13,color:"#57534E",lineHeight:1.5,fontFamily:"var(--body)"}}>{item.eu.enforcement}</div>
              {item.eu.note&&<div style={{fontSize:12,color:"#78716C",marginTop:4,fontFamily:"var(--mono)",fontStyle:"italic"}}>{item.eu.note}</div>}
            </div>
          </div>
          <div style={{background:"#F5F5F4",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:"#1C1917",marginBottom:4,fontFamily:"var(--mono)"}}>KEY TAKEAWAY</div>
            <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{item.insight}</p>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={(e)=>{e.stopPropagation();onFDA(item.topic,[pseudoItem]);}} style={{flex:1,padding:"11px",borderRadius:12,background:"#FFF5F5",border:"1px solid #FFCDD2",color:"#D32F2F",cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"var(--body)"}}>📋 Report to FDA</button>
            <button onClick={(e)=>{e.stopPropagation();onReps(item.topic,[pseudoItem]);}} style={{flex:1,padding:"11px",borderRadius:12,background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1E40AF",cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"var(--body)"}}>🏛️ Email Congress</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════
// ONBOARDING PAGE
// ═══════════════════════════════════
function OnboardingPage({onStart}) {
  const ic="#1C1917", ibg="#F5F5F4";
  const features = [
    { letter:"01", title:"Scan Ingredients", desc:"Paste or photograph any label" },
    { letter:"02", title:"Pesticide Risks", desc:"USDA data on hidden residues" },
    { letter:"03", title:"US vs EU", desc:"Same brand, different ingredients" },
    { letter:"04", title:"Regulatory Gaps", desc:"How US standards fall short" },
    { letter:"05", title:"Report to FDA", desc:"File formal complaints" },
    { letter:"06", title:"Email Congress", desc:"Pre-written letters to your reps" },
  ];
  return (
    <div style={{minHeight:"100vh",background:"#FAFAF9",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 24px"}}>
      <div style={{width:"100%",maxWidth:480,paddingTop:56}}>
        {/* HEADER */}
        <div style={{textAlign:"center",marginBottom:36,animation:"fadeIn 0.6s"}}>
          <div style={{width:56,height:56,borderRadius:16,background:"#1C1917",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
            <span style={{color:"#fff",fontSize:24,fontWeight:800,fontFamily:"var(--heading)"}}>B</span>
          </div>
          <h1 style={{fontSize:34,fontWeight:800,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.03em",lineHeight:1.1}}>BannedBite</h1>
          <p style={{fontSize:15,color:"#57534E",margin:0,fontFamily:"var(--body)",fontWeight:500,letterSpacing:"-0.01em"}}>Find out what's banned. Choose what's better.</p>
        </div>

        {/* HEALTH HOOK */}
        <div style={{marginBottom:24,animation:`slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both`}}>
          <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <h3 style={{margin:"0 0 8px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>Your food may be making you sick</h3>
            <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>
              Many everyday American groceries contain ingredients linked to cancer, hormone disruption, and behavioral issues in children — yet the same companies sell <strong style={{color:"#1C1917"}}>cleaner versions</strong> in Europe.
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:"16px",textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:24,fontWeight:800,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:2}}>10,000+</div>
              <div style={{fontSize:13,color:"#78716C",fontFamily:"var(--body)",lineHeight:1.4}}>US additives never reviewed by the FDA</div>
            </div>
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:"16px",textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:24,fontWeight:800,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:2}}>160+</div>
              <div style={{fontSize:13,color:"#78716C",fontFamily:"var(--body)",lineHeight:1.4}}>countries ban what the US still allows</div>
            </div>
          </div>
        </div>

        {/* ORGANIC CALLOUT */}
        <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"18px 20px",marginBottom:24,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:`slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.18s both`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:ibg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:14,fontWeight:700,color:ic,fontFamily:"var(--mono)"}}>!</span>
            </div>
            <h4 style={{margin:0,fontSize:14,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>Even organic isn't the full picture</h4>
          </div>
          <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>
            The USDA organic label <strong style={{color:"#1C1917"}}>does not mean pesticide-free</strong>. Hundreds of substances are approved for organic farming. USDA testing found residues on 26% of organic produce — from approved chemicals, drift, and contaminated soil.
          </p>
        </div>

        {/* FEATURES — 2 COLUMN */}
        <div style={{marginBottom:24}}>
          <h3 style={{fontSize:13,fontWeight:600,color:"#78716C",margin:"0 0 12px",fontFamily:"var(--mono)",letterSpacing:1.5,animation:`fadeIn 0.5s 0.25s both`}}>CHECK YOUR FOOD NOW</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {features.map((f,i)=>(
              <div key={i} style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:"14px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:`slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${0.28+i*0.04}s both`}}>
                <div style={{width:28,height:28,borderRadius:8,background:ibg,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:700,color:ic,fontFamily:"var(--mono)"}}>{f.letter}</span>
                </div>
                <h3 style={{margin:"0 0 3px",fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",lineHeight:1.3}}>{f.title}</h3>
                <p style={{margin:0,fontSize:13,color:"#78716C",lineHeight:1.4,fontFamily:"var(--body)"}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={onStart} style={{width:"100%",padding:"18px",border:"none",borderRadius:14,fontSize:16,fontWeight:700,cursor:"pointer",background:"#1C1917",color:"#fff",fontFamily:"var(--heading)",letterSpacing:"-0.01em",boxShadow:"0 4px 14px rgba(0,0,0,0.12)",transition:"all 0.2s",animation:`slideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.55s both`}}>
          Start Scanning →
        </button>
        <p style={{textAlign:"center",fontSize:13,color:"#78716C",marginTop:12,marginBottom:40,fontFamily:"var(--mono)",letterSpacing:0.5,animation:`fadeIn 0.5s 0.7s both`}}>Free · No account required</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════
// MAIN APP
// ═══════════════════════════════════
export default function App() {
  const [showOnboarding,setShowOnboarding]=useState(true);
  const [input,setInput]=useState("");
  const [results,setResults]=useState(null);
  const [scanned,setScanned]=useState(false);
  const [pestRisks,setPestRisks]=useState(null);
  const [tab,setTab]=useState("scan");
  const [brandFilter,setBrandFilter]=useState("all");
  const [stdFilter,setStdFilter]=useState("all");
  const [productQuery,setProductQuery]=useState("");
  const [selectedProduct,setSelectedProduct]=useState(null);
  const [productScanResults,setProductScanResults]=useState(null);
  const [productCat,setProductCat]=useState("all");
  const [showFDA,setShowFDA]=useState(false);
  const [showReps,setShowReps]=useState(false);
  const [fdaCtx,setFdaCtx]=useState({name:'',items:[]});
  const [repCtx,setRepCtx]=useState({name:'',items:[]});
  const [scansUsed,setScansUsed]=useState(0);
  const [scanMode,setScanMode]=useState("barcode");
  const [ocrPreview,setOcrPreview]=useState(null);
  const fileInputRef=useRef(null);
  const videoRef=useRef(null);
  const canvasRef=useRef(null);
  const barcodeIntervalRef=useRef(null);
  const [barcodeActive,setBarcodeActive]=useState(false);
  const [barcodeLoading,setBarcodeLoading]=useState(false);
  const [barcodeProduct,setBarcodeProduct]=useState(null);
  const [barcodeError,setBarcodeError]=useState("");
  const [barcodeManual,setBarcodeManual]=useState("");
  const [barcodeSupported,setBarcodeSupported]=useState(true);
  const zxingRef=useRef(null);
  const [brandSearch,setBrandSearch]=useState("");
  const [brandSearching,setBrandSearching]=useState(false);
  const [brandResults,setBrandResults]=useState(null);
  const [brandError,setBrandError]=useState("");

  const filteredProducts = PRODUCTS.filter(p=>{
    const mc = productCat==="all"||p.cat===productCat;
    const mq = !productQuery||p.name.toLowerCase().includes(productQuery.toLowerCase())||p.brand.toLowerCase().includes(productQuery.toLowerCase())||p.ingredients.toLowerCase().includes(productQuery.toLowerCase());
    return mc&&mq;
  });

  const handleScan=()=>{if(!input.trim())return;setResults(matchIngredients(input));setPestRisks(matchPesticideRisks(input));setScanned(true);setScansUsed(s=>s+1);};
  const handleSample=(s)=>{setInput(s.ingredients);setScanMode("paste");setTimeout(()=>{setResults(matchIngredients(s.ingredients));setPestRisks(matchPesticideRisks(s.ingredients));setScanned(true);setScansUsed(su=>su+1);},100);};
  const handleReset=()=>{setInput("");setResults(null);setScanned(false);setPestRisks(null);setOcrPreview(null);setBarcodeProduct(null);setBarcodeError("");setBarcodeManual("");};

  // ── BARCODE FUNCTIONS ──
  const stopBarcodeCamera=()=>{
    if(barcodeIntervalRef.current){clearInterval(barcodeIntervalRef.current);barcodeIntervalRef.current=null;}
    if(videoRef.current&&videoRef.current.srcObject){videoRef.current.srcObject.getTracks().forEach(t=>t.stop());videoRef.current.srcObject=null;}
    setBarcodeActive(false);
  };

  const lookupBarcode=async(code)=>{
    setBarcodeLoading(true);setBarcodeError("");setBarcodeProduct(null);
    try{
      const r=await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const d=await r.json();
      if(d.status===1&&d.product){
        const p=d.product;
        const name=p.product_name||"Unknown Product";
        const brand=p.brands||"";
        const ing=p.ingredients_text||p.ingredients_text_en||"";
        if(!ing){setBarcodeError("Product found but no ingredients listed. Try pasting the ingredients manually.");setBarcodeLoading(false);return;}
        setBarcodeProduct({name:brand?`${name} (${brand})`:name,ingredients:ing,image:p.image_front_small_url||p.image_url||null});
        setInput(ing);
        setResults(matchIngredients(ing));
        setPestRisks(matchPesticideRisks(ing));
        setScanned(true);
        setScansUsed(s=>s+1);
      } else {
        setBarcodeError("Product not found in database. Try searching by name in the Products tab, or paste ingredients manually.");
      }
    }catch(e){setBarcodeError("Network error — check your connection and try again.");}
    setBarcodeLoading(false);
  };

  const loadZXing=async()=>{
    if(zxingRef.current)return zxingRef.current;
    // If BarcodeDetector already exists natively, use it
    if(window.BarcodeDetector){zxingRef.current=window.BarcodeDetector;return window.BarcodeDetector;}
    // Try loading barcode-detector polyfill from CDN (based on ZXing WASM)
    const cdnUrls=[
      "https://cdn.jsdelivr.net/npm/barcode-detector@2/dist/es/pure.min.js",
      "https://unpkg.com/barcode-detector@2/dist/es/pure.min.js"
    ];
    for(const url of cdnUrls){
      try{
        const mod=await import(/* webpackIgnore: true */ url);
        if(mod.BarcodeDetector){window.BarcodeDetector=mod.BarcodeDetector;zxingRef.current=mod.BarcodeDetector;return mod.BarcodeDetector;}
        if(mod.default){window.BarcodeDetector=mod.default;zxingRef.current=mod.default;return mod.default;}
      }catch(e){continue;}
    }
    throw new Error("Could not load barcode library");
  };

  const startBarcodeCamera=async()=>{
    setBarcodeError("");setBarcodeProduct(null);
    // Check for secure context (required for camera)
    if(window.isSecureContext===false){
      setBarcodeError("Camera requires HTTPS or localhost. Please serve this app from a local dev server (e.g. npx vite) or deploy to HTTPS. You can type the barcode number below instead.");
      return;
    }
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
      setBarcodeError("Camera API not available in this browser/context. You can type the barcode number below instead.");
      return;
    }
    // Load polyfill if BarcodeDetector not available
    let DetectorClass=window.BarcodeDetector;
    if(!DetectorClass){
      try{
        await loadZXing();
        DetectorClass=window.BarcodeDetector||window.BarcodeDetectorPolyfill;
      }catch(e){
        setBarcodeSupported(false);
        setBarcodeError("Barcode scanning library could not be loaded. You can type the barcode number below instead.");
        return;
      }
    }
    if(!DetectorClass){setBarcodeSupported(false);setBarcodeError("Barcode detection not supported. You can type the barcode number below instead.");return;}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}}});
      if(videoRef.current){videoRef.current.srcObject=stream;await videoRef.current.play();setBarcodeActive(true);
        const detector=new DetectorClass({formats:['ean_13','ean_8','upc_a','upc_e','code_128']});
        barcodeIntervalRef.current=setInterval(async()=>{
          if(!videoRef.current||videoRef.current.readyState<2)return;
          try{
            const barcodes=await detector.detect(videoRef.current);
            if(barcodes.length>0){
              stopBarcodeCamera();
              lookupBarcode(barcodes[0].rawValue);
            }
          }catch(e){}
        },300);
      }
    }catch(e){
      const msg=e.name==="NotAllowedError"?"Camera permission was denied. Please allow camera access in your browser settings and try again."
        :e.name==="NotFoundError"?"No camera found on this device."
        :e.name==="NotReadableError"?"Camera is already in use by another app."
        :"Camera error: "+e.message;
      setBarcodeError(msg+" You can type the barcode number below instead.");
    }
  };

  // cleanup camera on unmount or mode change
  useEffect(()=>{
    if(scanMode!=="barcode")stopBarcodeCamera();
    return ()=>stopBarcodeCamera();
  },[scanMode]);

  const handlePhoto=(e)=>{
    const file=e.target.files?.[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      setOcrPreview(ev.target.result);
      setScanMode("paste");
    };
    reader.readAsDataURL(file);
    if(fileInputRef.current)fileInputRef.current.value="";
  };
  const selectProduct=(p)=>{setSelectedProduct(p);setProductScanResults(matchIngredients(p.ingredients_text||p.ingredients||""));};
  const openFDA=(name,items)=>{setFdaCtx({name,items});setShowFDA(true);};
  const openReps=(name,items)=>{setRepCtx({name,items});setShowReps(true);};

  const searchBrandComparison = async () => {
    if (!brandSearch.trim()) return;
    setBrandSearching(true); setBrandError(""); setBrandResults(null);
    const query = brandSearch.trim();
    try {
      // Search US products
      const usRes = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&tagtype_0=countries&tag_contains_0=contains&tag_0=united-states&search_simple=1&action=process&json=1&page_size=8&fields=product_name,brands,ingredients_text,ingredients_text_en,countries_tags&lc=en`).then(r=>r.json());
      const usProducts = (usRes.products||[]).filter(p=>(p.ingredients_text_en||p.ingredients_text||"").trim().length>10);

      // Search EU products across multiple countries
      let euProducts = [];
      const euCountries = ["france","germany","united-kingdom","spain","italy","netherlands","belgium","switzerland"];
      for (const country of euCountries) {
        if (euProducts.length > 0) break;
        const euRes = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&tagtype_0=countries&tag_contains_0=contains&tag_0=${country}&search_simple=1&action=process&json=1&page_size=5&fields=product_name,brands,ingredients_text,ingredients_text_en,countries_tags&lc=en`).then(r=>r.json());
        euProducts = (euRes.products||[]).filter(p=>(p.ingredients_text_en||p.ingredients_text||"").trim().length>10);
      }

      const label = query.charAt(0).toUpperCase()+query.slice(1);

      if (usProducts.length===0 && euProducts.length===0) {
        setBrandError("No results found. Try a major brand name like \"Coca-Cola\", \"Nutella\", or \"Pringles\".");
      } else if (usProducts.length > 0 && euProducts.length === 0) {
        // US found, no EU — show US results with scan + alternatives
        const usP = usProducts[0];
        const usIng = usP.ingredients_text_en||usP.ingredients_text||"";
        const usFlags = matchIngredients(usIng);
        setBrandResults({
          product: label,
          usOnly: true,
          usProduct: { name:usP.product_name||query, brand:usP.brands||"", ingredients:usIng, flagged:usFlags },
          euProduct: null,
        });
      } else if (euProducts.length > 0 && usProducts.length === 0) {
        // EU found, no US
        const euP = euProducts[0];
        const euIng = euP.ingredients_text_en||euP.ingredients_text||"";
        const euFlags = matchIngredients(euIng);
        setBrandResults({
          product: label,
          euOnly: true,
          usProduct: null,
          euProduct: { name:euP.product_name||query, brand:euP.brands||"", ingredients:euIng, flagged:euFlags },
        });
      } else {
        const usP = usProducts[0]; const euP = euProducts[0];
        const usIng = usP.ingredients_text_en||usP.ingredients_text||"";
        const euIng = euP.ingredients_text_en||euP.ingredients_text||"";
        const usFlags = matchIngredients(usIng);
        const euFlags = matchIngredients(euIng);
        setBrandResults({
          product: label,
          usProduct: { name:usP.product_name||query, brand:usP.brands||"", ingredients:usIng, flagged:usFlags },
          euProduct: { name:euP.product_name||query, brand:euP.brands||"", ingredients:euIng, flagged:euFlags },
        });
      }
    } catch(e) { setBrandError("Search failed. Check your connection and try again."); }
    setBrandSearching(false);
  };

  const highC=results?.filter(r=>r.severity==="high").length||0;
  const medC=results?.filter(r=>r.severity==="medium").length||0;
  const lowC=results?.filter(r=>r.severity==="low").length||0;

  const tabs=[{id:"scan",label:"Ingredients"},{id:"products",label:"Products"},{id:"brands",label:"Compare"},{id:"learn",label:"Learn"},{id:"standards",label:"Standards"},{id:"action",label:"Act"}];
  const brandCats=[...new Set(BRAND_COMPARISONS.map(b=>"all")),"all"];
  const stdCats = ["all",...new Set(STANDARDS_DATA.map(s=>s.category))];

  if (showOnboarding) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root{--heading:'Fraunces',serif;--body:'Outfit',sans-serif;--mono:'JetBrains Mono',monospace}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} body{margin:0;background:#FAFAF9;font-family:'Outfit',sans-serif}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
      <OnboardingPage onStart={()=>setShowOnboarding(false)} />
    </>
  );

  return (
    <div style={{minHeight:"100vh",background:"#FAFAF9",color:"#1C1917",fontFamily:"var(--body)"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root{--heading:'Fraunces',serif;--body:'Outfit',sans-serif;--mono:'JetBrains Mono',monospace}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scanLine{0%,100%{transform:translateY(-30px);opacity:0.4}50%{transform:translateY(30px);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent} body{margin:0;background:#FAFAF9}
        textarea:focus,button:focus,input:focus{outline:none}
        .tab-btn{flex:1;background:transparent;border:none;padding:10px 2px 12px;font-size:13px;cursor:pointer;color:#78716C;font-family:var(--body);font-weight:500;transition:all 0.2s;border-bottom:2px solid transparent;letter-spacing:0.01em}
        .tab-btn.active{color:#1C1917;border-bottom-color:#1C1917;font-weight:600}
        .scan-btn{width:100%;padding:16px;border:none;border-radius:14px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.2s;background:#1C1917;color:#fff;font-family:var(--heading);letter-spacing:-0.01em}
        .scan-btn:disabled{opacity:0.3;cursor:not-allowed}
        .chip{background:#F5F5F4;border:1px solid #E7E5E4;color:#57534E;padding:7px 14px;border-radius:20px;font-size:12px;cursor:pointer;transition:all 0.15s;font-family:var(--body);font-weight:500;white-space:nowrap}
        .chip.active{background:#1C1917;border-color:#1C1917;color:#fff}
        .score-ring{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;margin:0 auto 12px;font-family:var(--heading)}
        .product-card{background:#fff;border:1px solid #E7E5E4;border-radius:14px;padding:14px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.04)}
        .product-card:hover{border-color:#D6D3D1;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
        input[type="text"],textarea{background:#fff;border:1px solid #E7E5E4;color:#1C1917;font-family:var(--body);border-radius:12px}
        input[type="text"]:focus,textarea:focus{border-color:#78716C;box-shadow:0 0 0 3px rgba(168,162,158,0.15)}
        input::placeholder,textarea::placeholder{color:#D6D3D1}
      `}</style>

      {/* HEADER */}
      <div style={{padding:"16px 20px 0",maxWidth:500,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:6}}>
          <span style={{fontSize:16,fontFamily:"var(--mono)",color:"#1C1917",letterSpacing:3,fontWeight:700}}>BANNEDBITE</span>
        </div>

        {/* TABS */}
        <div style={{display:"flex",borderBottom:"1px solid #E7E5E4",marginBottom:20}}>
          {tabs.map(t=>(
            <button key={t.id} className={`tab-btn${tab===t.id?" active":""}`} onClick={()=>{setTab(t.id);if(t.id==="products"){setSelectedProduct(null);setProductScanResults(null);}}}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:500,margin:"0 auto",padding:"0 20px 100px"}}>

        {/* ═══ SCAN TAB ═══ */}
        {tab==="scan"&&(
          <div style={{animation:"fadeIn 0.3s"}}>
            {!scanned && (
              <>
                <h2 style={{fontSize:24,fontWeight:700,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.02em"}}>Scan. Upload. Type.</h2>
                <p style={{fontSize:14,color:"#57534E",margin:"0 0 16px",fontFamily:"var(--body)"}}>Check any food label for banned substances</p>

                {/* MODE TOGGLE */}
                <div style={{display:"flex",gap:0,marginBottom:18,background:"#F5F5F4",borderRadius:12,padding:3}}>
                  {[{id:"barcode",label:"Barcode"},{id:"photo",label:"Photo"},{id:"paste",label:"Type/Paste"}].map(m=>(
                    <button key={m.id} onClick={()=>setScanMode(m.id)} style={{flex:1,padding:"10px",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--body)",transition:"all 0.2s",background:scanMode===m.id?"#fff":"transparent",color:scanMode===m.id?"#1C1917":"#78716C",boxShadow:scanMode===m.id?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>{m.label}</button>
                  ))}
                </div>

                {/* BARCODE MODE */}
                {scanMode==="barcode"&&(
                  <div>
                    {!barcodeLoading&&!barcodeProduct&&!scanned&&(
                      <>
                        {/* Camera viewfinder */}
                        <div style={{position:"relative",borderRadius:16,overflow:"hidden",background:"#000",marginBottom:14,aspectRatio:"16/9"}}>
                          <video ref={videoRef} playsInline muted style={{width:"100%",height:"100%",objectFit:"cover",display:barcodeActive?"block":"none"}} />
                          {!barcodeActive&&(
                            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,background:"#1C1917"}}>
                              <span style={{fontSize:24}}>📷</span>
                              <div style={{fontSize:14,fontWeight:600,color:"#fff",fontFamily:"var(--heading)"}}>Point camera at barcode</div>
                              <button onClick={startBarcodeCamera} style={{padding:"10px 24px",background:"#fff",color:"#1C1917",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--heading)",marginTop:2}}>Open Camera</button>
                            </div>
                          )}
                          {barcodeActive&&(
                            <>
                              {/* Scanning overlay */}
                              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
                                <div style={{width:"70%",height:3,background:"#D32F2F",borderRadius:2,opacity:0.8,animation:"scanLine 2s ease-in-out infinite"}} />
                              </div>
                              <div style={{position:"absolute",bottom:12,left:0,right:0,textAlign:"center"}}>
                                <span style={{background:"rgba(0,0,0,0.6)",color:"#fff",padding:"6px 14px",borderRadius:20,fontSize:13,fontFamily:"var(--body)"}}>Scanning...</span>
                              </div>
                              <button onClick={stopBarcodeCamera} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.5)",color:"#fff",border:"none",borderRadius:8,padding:"6px 12px",fontSize:13,cursor:"pointer",fontFamily:"var(--body)"}}>✕ Close</button>
                            </>
                          )}
                        </div>

                        {/* Manual barcode entry */}
                        <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                          <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:8}}>
                            {!barcodeSupported?"Camera scanning not supported in this browser":"Or type the barcode number"}
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <input type="text" value={barcodeManual} onChange={e=>setBarcodeManual(e.target.value.replace(/[^0-9]/g,""))} placeholder="e.g. 0028400064057" style={{flex:1,padding:"12px 14px",fontSize:15}} onKeyDown={e=>{if(e.key==="Enter"&&barcodeManual.trim())lookupBarcode(barcodeManual.trim())}} />
                            <button onClick={()=>{if(barcodeManual.trim())lookupBarcode(barcodeManual.trim())}} disabled={!barcodeManual.trim()} className="scan-btn" style={{width:"auto",padding:"12px 20px",fontSize:14}}>Look Up</button>
                          </div>
                          <div style={{fontSize:13,color:"#78716C",fontFamily:"var(--body)",marginTop:8}}>Find the barcode number below the barcode lines on any food package</div>
                        </div>

                        {barcodeError&&(
                          <div style={{marginTop:14,padding:"14px 16px",background:"#FFF5F5",border:"1px solid #FFCDD2",borderRadius:12}}>
                            <div style={{fontSize:14,color:"#D32F2F",fontFamily:"var(--body)",lineHeight:1.5}}>{barcodeError}</div>
                          </div>
                        )}
                      </>
                    )}
                    {barcodeLoading&&(
                      <div style={{textAlign:"center",padding:"40px 20px"}}>
                        <div style={{width:48,height:48,border:"3px solid #E7E5E4",borderTopColor:"#1C1917",borderRadius:"50%",margin:"0 auto 16px",animation:"spin 0.8s linear infinite"}} />
                        <div style={{fontSize:16,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>Looking up product...</div>
                        <div style={{fontSize:14,color:"#78716C",fontFamily:"var(--body)",marginTop:4}}>Searching 800K+ products</div>
                      </div>
                    )}
                  </div>
                )}

                {/* PASTE MODE */}
                {scanMode==="paste"&&(
                  <>
                    {ocrPreview&&!scanned&&(
                      <div style={{marginBottom:14,background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:14,display:"flex",gap:14,alignItems:"flex-start",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                        <img src={ocrPreview} style={{width:80,height:80,objectFit:"cover",borderRadius:10,flexShrink:0,border:"1px solid #E7E5E4"}} alt=""/>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:4}}>Photo uploaded</div>
                          <div style={{fontSize:14,color:"#57534E",fontFamily:"var(--body)",lineHeight:1.5}}>Auto-read isn't available here. Please type or paste the ingredients you see in the photo below.</div>
                        </div>
                      </div>
                    )}
                    <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste ingredients list here..." rows={5} style={{width:"100%",padding:"14px 16px",fontSize:15,resize:"none",lineHeight:1.6,marginBottom:12}}/>
                    <button className="scan-btn" onClick={handleScan} disabled={!input.trim()}>Scan Ingredients</button>
                  </>
                )}

                {/* PHOTO MODE */}
                {scanMode==="photo"&&(
                  <div style={{textAlign:"center"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"30px 20px",border:"2px dashed #D6D3D1",borderRadius:16,background:"#fff"}}>
                      <div style={{fontSize:40,marginBottom:4}}>📷</div>
                      <div style={{fontSize:16,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>Upload a photo</div>
                      <div style={{fontSize:14,color:"#78716C",fontFamily:"var(--body)",marginBottom:8}}>Snap the ingredients label — type what you see below</div>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhoto} style={{fontSize:14,fontFamily:"var(--body)"}}/>
                    </div>
                  </div>
                )}

                {/* SAMPLES */}
                <div style={{marginTop:28}}>
                  <h3 style={{fontSize:14,fontWeight:600,color:"#78716C",margin:"0 0 12px",fontFamily:"var(--mono)",letterSpacing:1}}>TRY A SAMPLE</h3>
                  <div style={{display:"grid",gap:8}}>
                    {SAMPLES.map((s,i)=>(
                      <div key={i} onClick={()=>handleSample(s)} style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:"14px 18px",cursor:"pointer",transition:"all 0.15s",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:`slideUp 0.3s ease ${i*0.05}s both`}}>
                        <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{s.name}</div>
                        <div style={{fontSize:14,color:"#78716C",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"var(--body)"}}>{s.ingredients.substring(0,60)}...</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* RESULTS */}
            {scanned && results && (
              <div style={{animation:"fadeIn 0.3s"}}>
                {/* Barcode Product Preview — LARGE */}
                {barcodeProduct&&(
                  <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:20,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                    <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
                      {barcodeProduct.image&&<img src={barcodeProduct.image} style={{width:90,height:90,objectFit:"contain",borderRadius:12,flexShrink:0,border:"1px solid #E7E5E4",background:"#F5F5F4"}} alt=""/>}
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,fontWeight:600,color:"#78716C",fontFamily:"var(--mono)",letterSpacing:1,marginBottom:4}}>SCANNED PRODUCT</div>
                        <div style={{fontSize:18,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)",lineHeight:1.3}}>{barcodeProduct.name}</div>
                        <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:6,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{barcodeProduct.ingredients.substring(0,120)}...</div>
                      </div>
                    </div>
                  </div>
                )}
                {/* OCR Source Preview */}
                {ocrPreview&&(
                  <div style={{display:"flex",gap:12,alignItems:"flex-start",background:"#fff",border:"1px solid #E7E5E4",borderRadius:14,padding:14,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                    <img src={ocrPreview} style={{width:52,height:52,objectFit:"cover",borderRadius:10,flexShrink:0,border:"1px solid #E7E5E4"}} alt=""/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#78716C",fontFamily:"var(--mono)",letterSpacing:1,marginBottom:4}}>EXTRACTED FROM PHOTO</div>
                      <div style={{fontSize:14,color:"#57534E",fontFamily:"var(--body)",lineHeight:1.5,maxHeight:40,overflow:"hidden",textOverflow:"ellipsis"}}>{input.substring(0,120)}...</div>
                    </div>
                  </div>
                )}

                {/* ═══ SHIELD SCORE BADGE ═══ */}
                <div style={{textAlign:"center",marginBottom:28}}>
                  {results.length===0 ? (
                    <div>
                      <div style={{width:90,height:90,borderRadius:20,background:(pestRisks&&pestRisks.length>0)?"linear-gradient(135deg,#F5F3FF,#EDE9FE)":"linear-gradient(135deg,#ECFDF5,#D1FAE5)",border:`3px solid ${(pestRisks&&pestRisks.length>0)?"#8B5CF6":"#34D399"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
                        <span style={{fontSize:30}}>{(pestRisks&&pestRisks.length>0)?"⚠️":"🛡️"}</span>
                      </div>
                      <h2 style={{fontSize:22,fontWeight:700,color:(pestRisks&&pestRisks.length>0)?"#7C3AED":"#059669",margin:"0 0 4px",fontFamily:"var(--heading)"}}>{(pestRisks&&pestRisks.length>0)?"No Banned Ingredients — But...":"All Clear!"}</h2>
                      <p style={{fontSize:14,color:"#57534E",margin:0,fontFamily:"var(--body)"}}>{(pestRisks&&pestRisks.length>0)?`${pestRisks.length} pesticide residue risk${pestRisks.length!==1?"s":""} found below`:"No flagged ingredients detected"}</p>
                      {results.length===0&&!(pestRisks&&pestRisks.length>0)&&(
                        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:10}}>
                          {["🇪🇺","🇯🇵","🇦🇺","🇨🇦","🇬🇧"].map((f,i)=><span key={i} style={{fontSize:16,opacity:0.7}}>{f}</span>)}
                          <span style={{fontSize:12,color:"#059669",fontFamily:"var(--mono)",alignSelf:"center",marginLeft:4}}>Passes all checks</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{width:90,height:90,borderRadius:20,background:highC>0?"linear-gradient(135deg,#FFF5F5,#FFEBEE)":"linear-gradient(135deg,#FFF8E1,#FFE0B2)",border:`3px solid ${highC>0?"#D32F2F":"#EF6C00"}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
                        <span style={{fontSize:28,fontWeight:800,color:highC>0?"#D32F2F":"#EF6C00",fontFamily:"var(--heading)"}}>{results.length}</span>
                        <span style={{fontSize:9,fontWeight:700,letterSpacing:1,color:highC>0?"#D32F2F":"#EF6C00",fontFamily:"var(--mono)",marginTop:-2}}>{highC>0?"BANNED":"FLAGGED"}</span>
                      </div>
                      <h2 style={{fontSize:22,fontWeight:700,color:"#1C1917",margin:"0 0 4px",fontFamily:"var(--heading)"}}>{results.length} Flagged Ingredient{results.length!==1?"s":""}</h2>
                      <div style={{display:"flex",justifyContent:"center",gap:14,marginTop:8,flexWrap:"wrap"}}>
                        {highC>0&&<span style={{fontSize:14,color:"#D32F2F",fontFamily:"var(--mono)"}}>🚫 {highC} banned</span>}
                        {medC>0&&<span style={{fontSize:14,color:"#EF6C00",fontFamily:"var(--mono)"}}>⚠️ {medC} moderate</span>}
                        {lowC>0&&<span style={{fontSize:14,color:"#F9A825",fontFamily:"var(--mono)"}}>👁️ {lowC} watch</span>}
                        {pestRisks&&pestRisks.length>0&&<span style={{fontSize:14,color:"#7C3AED",fontFamily:"var(--mono)"}}>🐝 {pestRisks.length} pesticide</span>}
                      </div>
                      {/* Countries summary */}
                      {(()=>{const allCountries=[...new Set(results.flatMap(r=>(r.bannedIn||[]).filter(x=>!x.includes('restricted')&&!x.includes('countries'))))];return allCountries.length>0?(
                        <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:12,flexWrap:"wrap"}}>
                          {allCountries.slice(0,8).map((c,i)=><span key={i} style={{fontSize:16}} title={c}>{FLAG(c)}</span>)}
                          {allCountries.length>8&&<span style={{fontSize:12,color:"#78716C",fontFamily:"var(--mono)",alignSelf:"center"}}>+{allCountries.length-8} regions</span>}
                        </div>
                      ):null;})()}
                    </div>
                  )}
                </div>
                {results.map((item,i)=><IngredientCard key={i} item={item} index={i}/>)}

                {pestRisks&&pestRisks.length>0&&(
                  <div style={{marginTop:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,padding:"12px 16px",background:"#F5F3FF",borderRadius:14,border:"1px solid #DDD6FE"}}>
                      <span style={{fontSize:22}}>🐝</span>
                      <div>
                        <h4 style={{margin:0,fontSize:14,fontWeight:600,color:"#7C3AED",fontFamily:"var(--heading)"}}>Pesticide Residue Risks</h4>
                        <p style={{margin:0,fontSize:13,color:"#57534E",fontFamily:"var(--body)"}}>USDA testing data — not on ingredient labels</p>
                      </div>
                    </div>
                    {pestRisks.map((item,i)=><PesticideRiskCard key={item.crop} item={item} index={i}/>)}
                  </div>
                )}

                {(results.length>0||barcodeProduct) && <SmartShoppingPanel flaggedItems={results} productName={barcodeProduct?barcodeProduct.name:""} ingredientText={input}/>}

                {results.length>0 && (
                  <div style={{marginTop:20,display:"flex",gap:10}}>
                    <button onClick={()=>openFDA("Scanned Product",results)} style={{flex:1,padding:"14px",borderRadius:14,background:"#FFF5F5",border:"1px solid #FFCDD2",color:"#D32F2F",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"var(--body)"}}>📋 Report to FDA</button>
                    <button onClick={()=>openReps("Scanned Product",results)} style={{flex:1,padding:"14px",borderRadius:14,background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1E40AF",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"var(--body)"}}>🏛️ Email Congress</button>
                  </div>
                )}
                <button onClick={handleReset} style={{width:"100%",marginTop:14,padding:"14px",borderRadius:14,background:"#F5F5F4",border:"1px solid #E7E5E4",color:"#57534E",cursor:"pointer",fontSize:14,fontFamily:"var(--body)",fontWeight:500}}>Scan Another</button>
              </div>
            )}
          </div>
        )}

        {/* ═══ PRODUCTS TAB ═══ */}
        {tab==="products"&&(
          <div style={{animation:"fadeIn 0.3s"}}>
            {selectedProduct ? (
              <div>
                <button onClick={()=>{setSelectedProduct(null);setProductScanResults(null);}} style={{background:"none",border:"none",color:"#57534E",fontSize:14,cursor:"pointer",padding:"0 0 16px",fontFamily:"var(--body)"}}>← Back</button>
                <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:20,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
                  <h3 style={{margin:"0 0 4px",fontSize:20,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>{selectedProduct.name}</h3>
                  <p style={{margin:"0 0 12px",fontSize:14,color:"#57534E",fontFamily:"var(--mono)"}}>{selectedProduct.brand}</p>
                  <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>{selectedProduct.ingredients_text||selectedProduct.ingredients}</p>
                </div>

                <div style={{textAlign:"center",marginBottom:20}}>
                  {productScanResults&&productScanResults.length===0 ? (()=>{
                    const pR=matchPesticideRisks(selectedProduct.ingredients_text||selectedProduct.ingredients||"");
                    return (<div>
                      <div style={{width:76,height:76,borderRadius:18,background:pR.length>0?"linear-gradient(135deg,#F5F3FF,#EDE9FE)":"linear-gradient(135deg,#ECFDF5,#D1FAE5)",border:`3px solid ${pR.length>0?"#8B5CF6":"#34D399"}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
                        <span style={{fontSize:26}}>{pR.length>0?"⚠️":"🛡️"}</span>
                      </div>
                      <h3 style={{fontSize:18,fontWeight:700,color:pR.length>0?"#7C3AED":"#059669",margin:"0 0 4px",fontFamily:"var(--heading)"}}>{pR.length>0?"No Banned Additives — But...":"All Clear!"}</h3>
                      {pR.length>0&&<p style={{fontSize:14,color:"#57534E",margin:0,fontFamily:"var(--body)"}}>{pR.length} pesticide risk{pR.length!==1?"s":""} below</p>}
                    </div>);
                  })()
                  : productScanResults ? (
                    <div>
                      <div style={{width:76,height:76,borderRadius:18,background:"linear-gradient(135deg,#FFF5F5,#FFEBEE)",border:"3px solid #D32F2F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
                        <span style={{fontSize:24,fontWeight:800,color:"#D32F2F",fontFamily:"var(--heading)"}}>{productScanResults.length}</span>
                        <span style={{fontSize:8,fontWeight:700,letterSpacing:1,color:"#D32F2F",fontFamily:"var(--mono)",marginTop:-2}}>BANNED</span>
                      </div>
                      <h3 style={{fontSize:18,fontWeight:700,color:"#1C1917",margin:"0 0 4px",fontFamily:"var(--heading)"}}>{productScanResults.length} Flagged</h3>
                    </div>
                  ) : null}
                </div>
                {productScanResults?.map((item,i)=><IngredientCard key={i} item={item} index={i}/>)}

                {selectedProduct&&(()=>{
                  const pR=matchPesticideRisks(selectedProduct.ingredients_text||selectedProduct.ingredients||"");
                  return pR.length>0?(
                    <div style={{marginTop:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"10px 14px",background:"#F5F3FF",borderRadius:12,border:"1px solid #DDD6FE"}}>
                        <span style={{fontSize:18}}>🐝</span>
                        <div><h4 style={{margin:0,fontSize:14,fontWeight:600,color:"#7C3AED",fontFamily:"var(--heading)"}}>Pesticide Residue Risks</h4></div>
                      </div>
                      {pR.map((item,i)=><PesticideRiskCard key={item.crop} item={item} index={i}/>)}
                    </div>
                  ):null;
                })()}

                {/* SMARTER SHOPPING — always show for products */}
                {productScanResults!==null && <SmartShoppingPanel flaggedItems={productScanResults||[]} productName={selectedProduct.name} ingredientText={selectedProduct.ingredients_text||selectedProduct.ingredients}/>}

                {/* ACTION BUTTONS — FDA & Congress */}
                {productScanResults&&productScanResults.length>0 && (
                  <div style={{marginTop:20,display:"flex",gap:10}}>
                    <button onClick={()=>openFDA(selectedProduct.name,productScanResults)} style={{flex:1,padding:"14px",borderRadius:14,background:"#FFF5F5",border:"1px solid #FFCDD2",color:"#D32F2F",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"var(--body)"}}>📋 Report to FDA</button>
                    <button onClick={()=>openReps(selectedProduct.name,productScanResults)} style={{flex:1,padding:"14px",borderRadius:14,background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1E40AF",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"var(--body)"}}>🏛️ Email Congress</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2 style={{fontSize:24,fontWeight:700,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.02em"}}>Products</h2>
                <p style={{fontSize:14,color:"#57534E",margin:"0 0 16px",fontFamily:"var(--body)"}}>Search our database of common products</p>
                <input type="text" value={productQuery} onChange={e=>setProductQuery(e.target.value)} placeholder="Search products..." style={{width:"100%",padding:"12px 16px",fontSize:15,marginBottom:14}}/>
                <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:14,scrollbarWidth:"none"}}>
                  {["Skittles","Trident","Lay's","Mott's","Doritos","Ring Pop","Starbursts","Froot Loops"].map(q=><button key={q} className={`chip${productQuery===q?" active":""}`} onClick={()=>setProductQuery(productQuery===q?"":q)}>{q}</button>)}
                </div>
                <div style={{display:"grid",gap:8}}>
                  {filteredProducts.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:"#78716C",fontFamily:"var(--body)"}}><div style={{fontSize:32,marginBottom:12}}>🔍</div><div style={{fontSize:15,fontWeight:600,color:"#57534E",marginBottom:4}}>No products found</div><div style={{fontSize:14}}>Try a different search term or category</div></div>}
                  {filteredProducts.slice(0,20).map((p,i)=>{
                    const qf=matchIngredients(p.ingredients||"");
                    return (
                      <div key={i} className="product-card" onClick={()=>selectProduct(p)} style={{animation:`slideUp 0.3s ease ${Math.min(i,15)*0.03}s both`}}>
                        <div style={{width:42,height:42,borderRadius:12,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,fontFamily:"var(--heading)",fontWeight:700,color:"#78716C"}}>{p.name.charAt(0)}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                          <div style={{fontSize:14,color:"#78716C",fontFamily:"var(--body)"}}>{p.brand}</div>
                        </div>
                        {qf.length>0&&<span style={{background:"#FFF5F5",color:"#D32F2F",fontSize:13,fontWeight:700,padding:"4px 10px",borderRadius:8,fontFamily:"var(--mono)",flexShrink:0}}>{qf.length} flags</span>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ BRANDS TAB ═══ */}
        {tab==="brands"&&(
          <div style={{animation:"fadeIn 0.3s"}}>
            <h2 style={{fontSize:24,fontWeight:700,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.02em"}}>US vs EU</h2>
            <p style={{fontSize:14,color:"#57534E",margin:"0 0 20px",fontFamily:"var(--body)"}}>Same product, different ingredients</p>

            {/* SEARCH BAR */}
            <div style={{marginBottom:24}}>
              <div style={{display:"flex",gap:8}}>
                <input type="text" value={brandSearch} onChange={e=>setBrandSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")searchBrandComparison();}} placeholder="Search any product (e.g. Nutella, Pringles)..." style={{flex:1,padding:"12px 16px",fontSize:15}}/>
                <button onClick={searchBrandComparison} disabled={brandSearching||!brandSearch.trim()} style={{padding:"12px 20px",borderRadius:12,border:"none",background:"#1C1917",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--heading)",opacity:brandSearching||!brandSearch.trim()?0.3:1,whiteSpace:"nowrap"}}>{brandSearching?"Searching...":"Compare"}</button>
              </div>
              <div style={{display:"flex",gap:6,marginTop:10,overflowX:"auto",scrollbarWidth:"none"}}>
                {["Nutella","Pringles","Coca-Cola","Heinz Ketchup","M&M's","Oreo"].map(q=><button key={q} className={`chip${brandSearch===q?" active":""}`} onClick={()=>{setBrandSearch(q);setBrandResults(null);setBrandError("");}}>{q}</button>)}
              </div>
            </div>

            {/* SEARCH ERROR */}
            {brandError&&(
              <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:14,padding:"14px 18px",marginBottom:20,animation:"fadeIn 0.2s"}}>
                <p style={{margin:0,fontSize:14,color:"#9A3412",fontFamily:"var(--body)",lineHeight:1.5}}>{brandError}</p>
              </div>
            )}

            {/* LOADING */}
            {brandSearching&&(
              <div style={{textAlign:"center",padding:"40px 0",animation:"fadeIn 0.2s"}}>
                <div style={{fontSize:32,marginBottom:12,animation:"pulse 1.5s infinite"}}>🔍</div>
                <p style={{fontSize:14,color:"#57534E",fontFamily:"var(--body)"}}>Searching US & EU databases...</p>
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
              </div>
            )}

            {/* SEARCH RESULT */}
            {brandResults&&!brandSearching&&(
              <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:24,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                  <h3 style={{margin:0,fontSize:18,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>{brandResults.product}</h3>
                  {brandResults.usProduct&&brandResults.euProduct&&(
                    <span style={{fontSize:14,color:brandResults.usProduct.flagged.length>brandResults.euProduct.flagged.length?"#D32F2F":"#059669",fontFamily:"var(--mono)",fontWeight:600}}>
                      {brandResults.usProduct.flagged.length} US flags · {brandResults.euProduct.flagged.length} EU flags
                    </span>
                  )}
                </div>

                {/* US-ONLY NOTICE */}
                {brandResults.usOnly&&(
                  <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
                    <p style={{margin:0,fontSize:14,color:"#9A3412",fontFamily:"var(--body)",lineHeight:1.5}}>
                      No EU version found in our database. Showing the US version with a full ingredient scan — plus alternatives you can buy instead.
                    </p>
                  </div>
                )}

                {/* EU-ONLY NOTICE */}
                {brandResults.euOnly&&(
                  <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
                    <p style={{margin:0,fontSize:14,color:"#1E40AF",fontFamily:"var(--body)",lineHeight:1.5}}>
                      No US version found. Showing the EU version — which is typically made under stricter food safety regulations.
                    </p>
                  </div>
                )}

                {/* US VERSION */}
                {brandResults.usProduct&&(
                  <div style={{background:brandResults.usProduct.flagged.length>0?"#FFF5F5":"#F0FDF4",border:`1px solid ${brandResults.usProduct.flagged.length>0?"#FFCDD2":"#BBF7D0"}`,borderRadius:14,padding:16,marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:14,fontWeight:700,color:brandResults.usProduct.flagged.length>0?"#D32F2F":"#166534",fontFamily:"var(--mono)"}}>🇺🇸 US VERSION</div>
                      {brandResults.usProduct.brand&&<span style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)"}}>{brandResults.usProduct.brand}</span>}
                    </div>
                    <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{brandResults.usProduct.ingredients}</p>
                    {brandResults.usProduct.flagged.length>0&&(
                      <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:4}}>
                        {brandResults.usProduct.flagged.map((f,i)=>{const countries=(f.bannedIn||[]).filter(x=>!x.includes('restricted')&&!x.includes('countries'));return <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:12,background:"#FFEBEE",border:"1px solid #FFCDD2",borderRadius:6,padding:"3px 8px",color:"#C62828",fontFamily:"var(--mono)"}}>🚫 {f.name} {countries.slice(0,3).map(c=>FLAG(c)).join(" ")}</span>;})}
                      </div>
                    )}
                  </div>
                )}

                {/* EU VERSION */}
                {brandResults.euProduct&&(
                  <div style={{background:brandResults.euProduct.flagged.length>0?"#FFF5F5":"#F0FDF4",border:`1px solid ${brandResults.euProduct.flagged.length>0?"#FFCDD2":"#BBF7D0"}`,borderRadius:14,padding:16,marginBottom:brandResults.usProduct&&brandResults.euProduct?0:10}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div style={{fontSize:14,fontWeight:700,color:brandResults.euProduct.flagged.length>0?"#D32F2F":"#166534",fontFamily:"var(--mono)"}}>🇪🇺 EU VERSION</div>
                      {brandResults.euProduct.brand&&<span style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)"}}>{brandResults.euProduct.brand}</span>}
                    </div>
                    <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{brandResults.euProduct.ingredients}</p>
                    {brandResults.euProduct.flagged.length>0&&(
                      <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:4}}>
                        {brandResults.euProduct.flagged.map((f,i)=>{const countries=(f.bannedIn||[]).filter(x=>!x.includes('restricted')&&!x.includes('countries'));return <span key={i} style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:12,background:"#FFEBEE",border:"1px solid #FFCDD2",borderRadius:6,padding:"3px 8px",color:"#C62828",fontFamily:"var(--mono)"}}>🚫 {f.name} {countries.slice(0,3).map(c=>FLAG(c)).join(" ")}</span>;})}
                      </div>
                    )}
                  </div>
                )}

                {/* VERDICT — full comparison */}
                {brandResults.usProduct&&brandResults.euProduct&&brandResults.usProduct.flagged.length!==brandResults.euProduct.flagged.length&&(
                  <div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:12,padding:"12px 16px",marginTop:12}}>
                    <p style={{margin:0,fontSize:14,color:"#9A3412",fontFamily:"var(--body)",lineHeight:1.5}}>
                      <strong>The difference:</strong> The US version has {brandResults.usProduct.flagged.length} flagged ingredient{brandResults.usProduct.flagged.length!==1?"s":""} vs {brandResults.euProduct.flagged.length} in the EU version. {brandResults.usProduct.flagged.length>brandResults.euProduct.flagged.length?"European regulations force companies to use safer alternatives.":""}
                    </p>
                  </div>
                )}

                {/* SHOPPING ALTERNATIVES — show for usOnly or when US has flags */}
                {(brandResults.usOnly||( brandResults.usProduct&&brandResults.usProduct.flagged.length>0))&&(
                  <SmartShoppingPanel flaggedItems={brandResults.usProduct.flagged} productName={brandResults.product} ingredientText={brandResults.usProduct.ingredients}/>
                )}

                {/* ACTION BUTTONS */}
                {brandResults.usProduct&&brandResults.usProduct.flagged.length>0&&(
                  <div style={{marginTop:14,display:"flex",gap:10}}>
                    <button onClick={()=>openFDA(brandResults.product,brandResults.usProduct.flagged)} style={{flex:1,padding:"14px",borderRadius:14,background:"#FFF5F5",border:"1px solid #FFCDD2",color:"#D32F2F",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"var(--body)"}}>📋 Report to FDA</button>
                    <button onClick={()=>openReps(brandResults.product,brandResults.usProduct.flagged)} style={{flex:1,padding:"14px",borderRadius:14,background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1E40AF",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"var(--body)"}}>🏛️ Email Congress</button>
                  </div>
                )}
              </div>
            )}

            {/* FEATURED COMPARISONS */}
            <div style={{marginTop:brandResults?0:4}}>
              <h3 style={{fontSize:14,fontWeight:600,color:"#78716C",margin:"0 0 12px",fontFamily:"var(--mono)",letterSpacing:1}}>FEATURED COMPARISONS</h3>
              {BRAND_COMPARISONS.map((item,i)=><BrandCard key={i} item={item} index={i}/>)}
            </div>
          </div>
        )}

        {/* ═══ LEARN TAB ═══ */}
        {tab==="learn"&&(
          <div style={{animation:"fadeIn 0.3s"}}>
            <h2 style={{fontSize:24,fontWeight:700,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.02em"}}>Why This Matters</h2>
            <p style={{fontSize:14,color:"#57534E",margin:"0 0 24px",fontFamily:"var(--body)"}}>What's really happening to your health</p>

            {/* HEALTH IMPACT */}
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease both"}}>
              <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>The Health Risks Are Real</h3>
              <p style={{margin:"0 0 16px",fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>
                Research links common US food additives to serious health issues that develop slowly over years of daily exposure:
              </p>
              {[
                {label:"Cancer Risk",desc:"Red 3, potassium bromate, and BHA are linked to tumor growth in animal studies. The EU banned them — the US didn't."},
                {label:"Hormone Disruption",desc:"BHA, BHT, propylparaben, and rBGH mimic or interfere with your hormones — affecting metabolism, fertility, and development."},
                {label:"Neurological Effects",desc:"Artificial dyes (Red 40, Yellow 5, Yellow 6) are linked to hyperactivity and behavioral issues in children. The EU requires warning labels."},
                {label:"Heart & Organ Damage",desc:"Trans fats, BVO, and ractopamine are linked to cardiovascular problems, liver damage, and organ toxicity."},
                {label:"Gut Health",desc:"Carrageenan, artificial sweeteners, and emulsifiers can trigger gut inflammation, disrupt your microbiome, and weaken your immune response."},
                {label:"Children Are Most Vulnerable",desc:"Pound for pound, children consume more food additives than adults. Their developing bodies are far less equipped to process toxins."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:i<5?14:0,animation:`slideUp 0.3s ease ${i*0.04}s both`}}>
                  <div style={{width:24,height:24,borderRadius:6,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)"}}>{String(i+1).padStart(2,"0")}</span>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:2}}>{item.label}</div>
                    <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ORGANIC MYTH — DETAILED */}
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease 0.08s both"}}>
              <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>The Organic Myth</h3>
              <p style={{margin:"0 0 16px",fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>
                Many people assume that buying organic means their food is free from pesticides and harmful additives. <strong style={{color:"#1C1917"}}>That's not true.</strong> Here's what the organic label actually means — and what it doesn't:
              </p>
              {[
                {q:"Organic = pesticide-free?",a:"No. The USDA National List includes roughly 900 approved substances for organic farming — including pesticides like copper sulfate, pyrethrin, and spinosad. \"Organic\" means most synthetic pesticides are restricted — not that pesticides are absent."},
                {q:"What about residue drift?",a:"Organic farms near conventional farms often test positive for synthetic pesticides through wind drift, shared water sources, and contaminated soil. A USDA analysis of 2019 testing data found pesticide residues on 26% of organic-labeled produce samples."},
                {q:"Are organic additives safe?",a:"Organic processed foods can still contain carrageenan, natural flavors (which can hide dozens of chemical compounds), and other additives linked to inflammation and gut issues."},
                {q:"What about \"natural\" labels?",a:"The word \"natural\" has no regulated definition from the FDA. Companies can put it on almost anything. It tells you nothing about safety."},
                {q:"So is organic pointless?",a:"No — organic is generally better, especially for reducing exposure to the most harmful synthetic pesticides. But it's not a guarantee of safety. BannedBite helps you go beyond the label and understand what's actually in your food."},
              ].map((item,i)=>(
                <div key={i} style={{marginBottom:i<4?16:0,paddingBottom:i<4?16:0,borderBottom:i<4?"1px solid #F5F5F4":"none",animation:`slideUp 0.3s ease ${0.12+i*0.04}s both`}}>
                  <div style={{fontSize:14,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:4}}>{item.q}</div>
                  <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>{item.a}</p>
                </div>
              ))}
            </div>

            {/* THE SYSTEM IS BROKEN */}
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease 0.16s both"}}>
              <h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>Why the US Is Behind</h3>
              <p style={{margin:"0 0 14px",fontSize:14,color:"#57534E",lineHeight:1.7,fontFamily:"var(--body)"}}>
                The fundamental difference is how each system works:
              </p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <div style={{background:"#F5F5F4",borderRadius:12,padding:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)",marginBottom:6}}>US APPROACH</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--body)",marginBottom:4}}>Prove it's harmful</div>
                  <p style={{margin:0,fontSize:13,color:"#57534E",lineHeight:1.5,fontFamily:"var(--body)"}}>Companies self-certify ingredients as safe (GRAS). The FDA only acts after harm is proven — often decades later.</p>
                </div>
                <div style={{background:"#F5F5F4",borderRadius:12,padding:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)",marginBottom:6}}>EU APPROACH</div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--body)",marginBottom:4}}>Prove it's safe first</div>
                  <p style={{margin:0,fontSize:13,color:"#57534E",lineHeight:1.5,fontFamily:"var(--body)"}}>Every additive requires independent safety review before it can enter the food supply. If there's doubt, it's not allowed.</p>
                </div>
              </div>
              {[
                "The FDA hasn't banned a food additive since the 1990s, despite mounting evidence",
                "Food companies voluntarily reformulate for Europe because the law requires it",
                "US food lobbyists spend over $30 million annually to block stricter regulations",
                "The GRAS loophole lets companies approve their own ingredients with no FDA oversight",
              ].map((fact,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<3?8:0}}>
                  <span style={{color:"#78716C",fontSize:12,marginTop:4}}>●</span>
                  <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{fact}</p>
                </div>
              ))}
            </div>

            {/* WHAT YOU CAN DO */}
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease 0.24s both"}}>
              <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>What You Can Do</h3>
              {[
                {title:"Scan everything",desc:"Use BannedBite before you buy. Check ingredients on packaged foods, not just the front label claims."},
                {title:"Choose cleaner alternatives",desc:"When a product is flagged, look for versions without dyes, BHT, TBHQ, or artificial preservatives. They exist."},
                {title:"Buy organic strategically",desc:"Prioritize organic for the Dirty Dozen (strawberries, spinach, kale, apples) where pesticide loads are highest."},
                {title:"Report and advocate",desc:"Use the Act tab to file FDA complaints and email your representatives. Consumer pressure works."},
                {title:"Spread the word",desc:"Share BannedBite with friends and family. The more people who know, the harder it is for companies to get away with it."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:i<4?14:0}}>
                  <div style={{width:24,height:24,borderRadius:6,background:"#1C1917",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,fontFamily:"var(--mono)",flexShrink:0,marginTop:1}}>{i+1}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:2}}>{item.title}</div>
                    <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SHOP SMARTER BY SOURCE */}
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease 0.3s both"}}>
              <h3 style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>Shop Smarter by Source</h3>
              <p style={{margin:"0 0 16px",fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>Not all grocery stores are equal. Countries with stricter food safety laws produce cleaner products — and you can buy them locally.</p>

              {[
                {country:"Japan",flag:"JP",rating:"11% pesticide detection vs 61% in US",desc:"Japan uses the same strict 0.01 ppm default limit as the EU. Their compliance rate is 99.7%. Japanese imports test positive for pesticides at roughly one-fifth the rate of US produce.",stores:[
                  {name:"H Mart",url:"https://www.hmart.com",note:"Korean & Japanese groceries nationwide"},
                  {name:"Amazon — Japanese Imports",url:amzn("Japanese imported food snacks"),note:"Pantry items, snacks, seasonings"},
                ]},
                {country:"European Union",flag:"EU",rating:"Precautionary principle — prove safety first",desc:"The EU bans or restricts 1,300+ substances the US still allows. Many US brands already make cleaner EU versions — look for imports at specialty stores.",stores:[
                  {name:"Amazon — EU Imported Foods",url:amzn("European imported food organic EU"),note:"Chocolates, crackers, pantry staples"},
                  {name:"World Market / Cost Plus",url:"https://www.worldmarket.com",note:"European brands in-store"},
                  {name:"iGourmet",url:"https://www.igourmet.com",note:"Premium European food imports"},
                ]},
                {country:"Australia / NZ",flag:"AU",rating:"Strict bans on growth hormones & many additives",desc:"Australia and New Zealand ban growth hormones in beef, many artificial colors, and BVO. Their food standards are among the strictest globally.",stores:[
                  {name:"Amazon — Australian Foods",url:amzn("Australian imported food organic"),note:"Spreads, snacks, health foods"},
                ]},
              ].map((item,i)=>(
                <div key={i} style={{marginBottom:i<2?16:0,paddingBottom:i<2?16:0,borderBottom:i<2?"1px solid #F5F5F4":"none",animation:`slideUp 0.3s ease ${0.34+i*0.04}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:32,height:32,borderRadius:8,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:12,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)"}}>{item.flag}</span>
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{item.country}</div>
                      <div style={{fontSize:12,color:"#78716C",fontFamily:"var(--mono)"}}>{item.rating}</div>
                    </div>
                  </div>
                  <p style={{margin:"0 0 10px",fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{item.desc}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {item.stores.map((store,j)=>(
                      <a key={j} href={store.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:10,textDecoration:"none",transition:"all 0.15s"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{store.name}</div>
                          <div style={{fontSize:12,color:"#78716C",fontFamily:"var(--body)",marginTop:1}}>{store.note}</div>
                        </div>
                        <span style={{fontSize:14,color:"#78716C",fontFamily:"var(--mono)"}}>→</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{padding:"10px 14px",background:"#F5F5F4",borderRadius:10,marginTop:14}}>
                <p style={{margin:0,fontSize:13,color:"#78716C",lineHeight:1.5,fontFamily:"var(--body)"}}>
                  <strong style={{color:"#57534E"}}>Remember:</strong> The benefits of eating fruits and vegetables far outweigh pesticide risks. These tips help you reduce exposure — not avoid produce.
                </p>
              </div>
            </div>

            {/* REDUCE EXPOSURE TIPS */}
            <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease 0.38s both"}}>
              <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700,color:"#1C1917",fontFamily:"var(--heading)"}}>Reduce Pesticide Exposure</h3>
              {[
                {title:"Wash under running water",desc:"Rubbing produce under running water removes more residue than soaking. No soap needed — plain water is most effective."},
                {title:"Peel when practical",desc:"Peeling removes most surface pesticides, but you lose fiber and nutrients in the skin. Best for high-residue items like conventional apples and potatoes."},
                {title:"Prioritize the Dirty Dozen organic",desc:"Strawberries, spinach, kale, peaches, pears, nectarines, apples, grapes, bell peppers, cherries, blueberries, green beans."},
                {title:"Save money on the Clean Fifteen",desc:"Avocados, sweet corn, pineapple, onions, papaya, frozen peas, asparagus, honeydew, kiwi, cabbage, mushrooms, mangoes — lowest residue levels."},
                {title:"Cook to reduce residues",desc:"Blanching and boiling reduce pesticide levels significantly. Frying and baking also help. Raw consumption retains the most residue."},
                {title:"Try Japanese and EU imports",desc:"Products from countries with stricter regulations consistently test cleaner. Check country of origin labels — it matters."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:i<5?14:0}}>
                  <div style={{width:24,height:24,borderRadius:6,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)"}}>{String(i+1).padStart(2,"0")}</span>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)",marginBottom:2}}>{item.title}</div>
                    <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* SOURCES NOTE */}
            <div style={{background:"#F5F5F4",borderRadius:12,padding:"14px 16px",animation:"slideUp 0.3s ease 0.32s both"}}>
              <p style={{margin:0,fontSize:13,color:"#78716C",lineHeight:1.6,fontFamily:"var(--body)"}}>
                <strong style={{color:"#57534E"}}>Sources:</strong> EFSA (European Food Safety Authority), FDA GRAS database, IARC (International Agency for Research on Cancer), USDA Pesticide Data Program, Codex Alimentarius, peer-reviewed studies published in The Lancet, Environmental Health Perspectives, and Food and Chemical Toxicology.
              </p>
            </div>
          </div>
        )}

        {/* ═══ STANDARDS TAB ═══ */}
        {tab==="standards"&&(
          <div style={{animation:"fadeIn 0.3s"}}>
            <h2 style={{fontSize:24,fontWeight:700,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.02em"}}>Regulatory Standards</h2>
            <p style={{fontSize:14,color:"#57534E",margin:"0 0 16px",fontFamily:"var(--body)"}}>US vs EU comparisons</p>
            <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:14,scrollbarWidth:"none"}}>
              {stdCats.map(c=><button key={c} className={`chip${stdFilter===c?" active":""}`} onClick={()=>setStdFilter(c)}>{c==="all"?"All":c}</button>)}
            </div>
            {STANDARDS_DATA.filter(s=>stdFilter==="all"||s.category===stdFilter).map((item,i)=><StandardCard key={i} item={item} index={i} onFDA={openFDA} onReps={openReps}/>)}
          </div>
        )}

        {/* ═══ ACTION TAB ═══ */}
        {tab==="action"&&(
          <div style={{animation:"fadeIn 0.3s"}}>
            <h2 style={{fontSize:24,fontWeight:700,color:"#1C1917",margin:"0 0 6px",fontFamily:"var(--heading)",letterSpacing:"-0.02em"}}>Take Action</h2>
            <p style={{fontSize:14,color:"#57534E",margin:"0 0 24px",fontFamily:"var(--body)"}}>Use your voice to demand safer food</p>

            {[
              {letter:"01",title:"Report to FDA",desc:"File a formal complaint about unsafe ingredients",action:()=>openFDA("General",results||[])},
              {letter:"02",title:"Email Your Representatives",desc:"Pre-written letter + find your reps by zip code",action:()=>openReps("General",results||[])},
              {letter:"03",title:"Find Your Representatives",desc:"Look up your House rep and Senators directly",action:()=>window.open("https://www.house.gov/representatives/find-your-representative","_blank")},
            ].map((item,i)=>(
              <div key={i} onClick={item.action} style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:10,cursor:"pointer",transition:"all 0.15s",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:`slideUp 0.3s ease ${i*0.06}s both`}}>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:40,height:40,borderRadius:12,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)"}}>{item.letter}</span>
                  </div>
                  <div>
                    <h3 style={{margin:0,fontSize:15,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>{item.title}</h3>
                    <p style={{margin:"4px 0 0",fontSize:14,color:"#57534E",fontFamily:"var(--body)"}}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* SHARE SECTION */}
            {(()=>{
              const shareText="I just used BannedBite to scan my food and found ingredients BANNED in other countries but still legal in the US. What's banned in YOUR bite?";
              const shareUrl="https://bannedbite.com";
              const encodedText=encodeURIComponent(shareText);
              const encodedUrl=encodeURIComponent(shareUrl);
              const platforms=[
                {name:"X / Twitter",letter:"X",url:`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`},
                {name:"Facebook",letter:"Fb",url:`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`},
                {name:"WhatsApp",letter:"Wa",url:`https://wa.me/?text=${encodedText}%20${encodedUrl}`},
                {name:"iMessage",letter:"iM",url:`sms:&body=${encodedText} ${encodedUrl}`},
                {name:"Email",letter:"Em",url:`mailto:?subject=${encodeURIComponent("Check this out — BannedBite")}&body=${encodedText}%20${encodedUrl}`},
              ];
              return (
                <div style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:"20px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",animation:"slideUp 0.3s ease 0.12s both"}}>
                  <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                    <div style={{width:40,height:40,borderRadius:12,background:"#F5F5F4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:14,fontWeight:700,color:"#1C1917",fontFamily:"var(--mono)"}}>04</span>
                    </div>
                    <div>
                      <h3 style={{margin:0,fontSize:15,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>Share BannedBite</h3>
                      <p style={{margin:"4px 0 0",fontSize:14,color:"#57534E",fontFamily:"var(--body)"}}>Raise awareness on social media</p>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                    {platforms.map((p,i)=>(
                      <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"#F5F5F4",border:"1px solid #E7E5E4",borderRadius:12,textDecoration:"none",transition:"all 0.15s",cursor:"pointer"}}>
                        <span style={{fontSize:14,fontWeight:700,color:"#1C1917",width:24,textAlign:"center",fontFamily:"var(--mono)"}}>{p.letter}</span>
                        <span style={{fontSize:14,fontWeight:500,color:"#1C1917",fontFamily:"var(--body)"}}>{p.name}</span>
                      </a>
                    ))}
                  </div>
                  <div style={{borderTop:"1px solid #E7E5E4",paddingTop:12}}>
                    <p style={{margin:"0 0 8px",fontSize:13,color:"#78716C",fontFamily:"var(--mono)",letterSpacing:0.5}}>FOR TIKTOK & INSTAGRAM</p>
                    <div style={{background:"#F5F5F4",borderRadius:10,padding:"10px 14px",fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)",marginBottom:10}}>{shareText} #BannedBite #FoodSafety #BannedInEurope #WhatsBannedInYourBite</div>
                    <button onClick={()=>copyText(shareText+" #BannedBite #FoodSafety #BannedInEurope #WhatsBannedInYourBite","Caption")} style={{width:"100%",padding:"12px",border:"none",borderRadius:10,background:"#1C1917",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"var(--body)"}}>Copy Caption + Hashtags</button>
                  </div>
                </div>
              );
            })()}

            <div style={{marginTop:14,background:"#fff",border:"1px solid #E7E5E4",borderRadius:16,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
              <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#1C1917",fontFamily:"var(--heading)"}}>Quick Facts</h3>
              {[
                `${BANNED_INGREDIENTS.filter(i=>i.severity==="high").length} high-risk ingredients tracked`,
                "Same companies sell cleaner versions in Europe",
                "~10,000 US food additives never reviewed by FDA",
                "EU requires proof of safety before approval",
              ].map((fact,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                  <span style={{color:"#78716C",fontSize:12,marginTop:4}}>●</span>
                  <p style={{margin:0,fontSize:14,color:"#57534E",lineHeight:1.6,fontFamily:"var(--body)"}}>{fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FDA Modal */}
      <Modal open={showFDA} onClose={()=>setShowFDA(false)} title="📋 Report to FDA">
        {(()=>{const r=generateFDAReport(fdaCtx.name,fdaCtx.items);return(
          <div>
            <div style={{background:"#F5F5F4",borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:600,color:"#57534E",marginBottom:6,fontFamily:"var(--mono)"}}>TO: {r.email}</div>
              <div style={{fontSize:14,fontWeight:600,color:"#57534E",fontFamily:"var(--mono)"}}>SUBJECT: {r.subject}</div>
            </div>
            <pre style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:12,padding:16,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap",color:"#44403C",fontFamily:"var(--mono)",maxHeight:300,overflow:"auto"}}>{r.body}</pre>
            <button onClick={()=>copyText(r.body,"FDA Report")} style={{width:"100%",marginTop:16,padding:16,border:"none",borderRadius:14,background:"#1C1917",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--heading)"}}>Copy Report</button>
          </div>
        );})()}
      </Modal>

      {/* Congress Modal */}
      <Modal open={showReps} onClose={()=>setShowReps(false)} title="🏛️ Email Congress">
        {(()=>{const r=generateCongressLetter("",repCtx.name,repCtx.items);return(
          <div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,textDecoration:"none",cursor:"pointer"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1E40AF",fontFamily:"var(--heading)"}}>Find Your House Representative</div>
                  <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:2}}>house.gov — search by zip code</div>
                </div>
                <span style={{fontSize:14,color:"#1E40AF"}}>→</span>
              </a>
              <a href="https://www.senate.gov/senators/senators-contact.htm" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,textDecoration:"none",cursor:"pointer"}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:"#1E40AF",fontFamily:"var(--heading)"}}>Find Your Senators</div>
                  <div style={{fontSize:13,color:"#57534E",fontFamily:"var(--body)",marginTop:2}}>senate.gov — contact your state's senators</div>
                </div>
                <span style={{fontSize:14,color:"#1E40AF"}}>→</span>
              </a>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:"#57534E",fontFamily:"var(--mono)",letterSpacing:0.5,marginBottom:8}}>PRE-WRITTEN LETTER</div>
            <pre style={{background:"#fff",border:"1px solid #E7E5E4",borderRadius:12,padding:16,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap",color:"#44403C",fontFamily:"var(--mono)",maxHeight:250,overflow:"auto"}}>{r.body}</pre>
            <button onClick={()=>copyText(r.body,"Congress Letter")} style={{width:"100%",marginTop:14,padding:16,border:"none",borderRadius:14,background:"#1C1917",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"var(--heading)"}}>Copy Letter</button>
            <p style={{margin:"10px 0 0",fontSize:13,color:"#78716C",fontFamily:"var(--body)",textAlign:"center",lineHeight:1.5}}>Find your rep above, then paste this letter into their contact form</p>
          </div>
        );})()}
      </Modal>
    </div>
  );
}
