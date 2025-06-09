import { JSDOM } from "jsdom";
import { join, dirname } from "path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ES Module equivalent of __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file (located in the project root)
dotenv.config({ path: join(__dirname, "../.env") });

interface Character {
  value: string;
  label: string;
  gender: string;
  fightingStyle: string;
  nationality: string;
  eyeColor: string;
  skinColor: string;
  firstAppearance: string;
  imageUrl: string;
  quoteText: string;
  quoteAttribution: string;
}

async function fetchPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  return new JSDOM(html);
}

function extractQuoteParts(document: Document) {
  // Select all tables with a class containing 'quote'
  const quoteTables = Array.from(
    document.querySelectorAll('table[class*="quote"]')
  );
  if (!quoteTables.length) return { quoteText: "", quoteAttribution: "" };

  // Use the quote table with the longest quote text
  let quoteTable = quoteTables[0];
  let maxLength = 0;
  for (const table of quoteTables) {
    const rows = table.querySelectorAll("tr");
    if (rows[0]) {
      const text = rows[0].textContent?.replace(/\s+/g, " ").trim() || "";
      if (text.length > maxLength) {
        maxLength = text.length;
        quoteTable = table;
      }
    }
  }

  const rows = quoteTable.querySelectorAll("tr");
  let quoteText = "";
  let quoteAttribution = "";

  if (rows[0]) {
    quoteText = rows[0].textContent?.replace(/\s+/g, " ").trim() || "";
  }
  if (rows[1]) {
    const td = rows[1].querySelector("td");
    if (td) {
      td.querySelectorAll("sup").forEach((sup) => sup.remove());
      quoteAttribution = td.textContent?.replace(/\s+/g, " ").trim() || "";
    }
  }
  return { quoteText, quoteAttribution };
}

async function scrapeCharacterData(url: string): Promise<Character> {
  const dom = await fetchPage(url);
  const document = dom.window.document;

  // Get the character name from the title
  const name =
    document.querySelector(".page-header__title")?.textContent?.trim() || "";
  if (!name) {
    console.warn(`⚠️  No name found for character at ${url}`);
  }

  // Get the infobox data
  const getInfoboxData = (keys: string[], fieldName: string) => {
    for (const key of keys) {
      const element = document.querySelector(`[data-source="${key}"]`);
      if (element?.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    console.warn(
      `⚠️  No ${fieldName} found for ${name} (tried keys: ${keys.join(", ")})`
    );
    return "";
  };

  // Get the character image
  const imageElement = document.querySelector(".pi-image-thumbnail");
  const imageUrl = imageElement?.getAttribute("src") || "";
  if (!imageUrl) {
    console.warn(`⚠️  No image found for ${name}`);
  }

  // Get the quote and attribution
  let quoteText = "";
  let quoteAttribution = "";

  // Find any quote table (handling different classes)
  const quoteTable = document.querySelector(
    "table.quote, table.quote.quote_link_color, table.quote.quote_link_color_light"
  );
  if (quoteTable) {
    const rows = quoteTable.querySelectorAll("tr");

    // Get the quote text (first row)
    const quoteRow = rows[0];
    if (quoteRow) {
      const quoteCell = quoteRow.querySelector("td");
      if (quoteCell) {
        // Get the text content and clean it
        quoteText = quoteCell.innerHTML
          .replace(/<br\s*\/?>/g, " ") // Replace <br> with space
          .replace(/<i>/g, "") // Remove italic tags
          .replace(/<\/i>/g, "")
          .replace(/^"/, "") // Remove opening quote
          .replace(/"$/, "") // Remove closing quote
          .trim();

        // If the quote is still empty after cleaning, try textContent as fallback
        if (!quoteText) {
          quoteText =
            quoteCell.textContent?.trim().replace(/^"/, "").replace(/"$/, "") ||
            "";
        }
      }
    }
    if (!quoteText) {
      console.warn(`⚠️  No quote text found for ${name}`);
    }

    // Get the attribution (last row)
    const attributionRow = rows[rows.length - 1];
    if (attributionRow) {
      const attributionCell = attributionRow.querySelector("td");
      if (attributionCell) {
        // First, replace links with their text content
        attributionCell.querySelectorAll("a").forEach((link) => {
          const text = link.textContent || "";
          link.replaceWith(text);
        });

        // Then remove citation references
        attributionCell.querySelectorAll("sup").forEach((sup) => sup.remove());

        // Get the text content and clean it
        quoteAttribution =
          attributionCell.textContent
            ?.trim()
            .replace(/^—\s*/, "") // Remove the em dash and any following space
            .replace(/\s*\[.*?\]$/, "") // Remove any remaining citation references
            .replace(/\s*\.$/, "") // Remove trailing period
            .trim() || "";

        // Log the raw attribution for debugging
        console.log(`\n🔍 Raw attribution for ${name}:`);
        console.log(`Before cleaning: "${attributionCell.innerHTML}"`);
        console.log(`After cleaning: "${quoteAttribution}"\n`);
      }
    }
    if (!quoteAttribution) {
      console.warn(`⚠️  No quote attribution found for ${name}`);
    }

    // Log the quote details for debugging
    console.log(`\n📝 Quote details for ${name}:`);
    console.log(`Text: "${quoteText}"`);
    console.log(`Attribution: "${quoteAttribution}"`);
    console.log(`Table class: ${quoteTable.className}\n`);
  } else {
    console.warn(
      `⚠️  No quote table found for ${name} (tried classes: quote, quote.quote_link_color, quote.quote_link_color_light)`
    );
  }

  // Get other character data
  const pronouns = getInfoboxData(["pronouns"], "pronouns").toLowerCase();
  let gender = "unknown";
  if (pronouns.includes("he/him")) {
    gender = "male";
  } else if (pronouns.includes("she/her")) {
    gender = "female";
  }
  if (gender === "unknown") {
    console.warn(
      `⚠️  Could not determine gender for ${name} (pronouns: "${pronouns}")`
    );
  }

  const fightingStyle = getInfoboxData(
    ["fighting style", "fightingstyle"],
    "fighting style"
  );
  let firstAppearance = getInfoboxData(
    ["appearance", "first appearance", "firstappearance", "debut"],
    "first appearance"
  );

  // Handle first appearance to only use part before ":"
  if (firstAppearance.includes(":")) {
    firstAppearance = firstAppearance.split(":")[0].trim();
  }

  const nationality = getInfoboxData(["nationality"], "nationality");
  const eyeColor = getInfoboxData(["eyes"], "eye color");
  const skinColor = getInfoboxData(["skincolor", "skintype"], "skin color");

  const character = {
    value: name.toLowerCase().replace(/\s+/g, "-"),
    label: name,
    imageUrl,
    gender,
    fightingStyle,
    nationality,
    eyeColor,
    skinColor,
    firstAppearance,
    quoteText,
    quoteAttribution,
  };

  // Log a summary of empty fields for this character
  const emptyFields = Object.entries(character)
    .filter(([_, value]) => !value || value === "unknown")
    .map(([key]) => key);

  if (emptyFields.length > 0) {
    console.warn(`\n📊 Character Summary for ${name}:`);
    console.warn(`Empty or unknown fields: ${emptyFields.join(", ")}`);
    console.warn(`URL: ${url}\n`);
  }

  return character;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanCharacterName(name: string): string {
  // Special case for Varrick
  if (name.toLowerCase().includes("iknik blackstone varrick")) {
    return "Varrick";
  }
  return name;
}

function cleanFightingStyle(style: string): string {
  // First, normalize the style to match our FIGHTING_STYLES format
  const normalizedStyle = style
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase
    .replace(/([a-z])([0-9])/g, "$1 $2") // Split before numbers
    .replace(/([0-9])([a-z])/g, "$1 $2") // Split after numbers
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\s+/g, " ") // Normalize spaces
    .replace(/\[.*?\]/g, "") // Remove anything in square brackets
    .trim();

  // Split into individual styles if there are multiple
  const styles = normalizedStyle.split(",").map((s) => s.trim());

  // Map each style to our standardized format
  const cleanedStyles = styles.map((singleStyle) => {
    // Handle special cases
    if (singleStyle.includes("combustionbending")) {
      return "Combustion Bending";
    }
    if (singleStyle.includes("knife-throwing")) {
      return "Knife Throwing";
    }
    if (singleStyle.includes("fighting style shuriken-jutsu")) {
      return "Shuriken Jutsu";
    }
    if (singleStyle.includes("chi-blocking")) {
      return "Chi Blocking";
    }
    if (
      singleStyle.includes("swordsmanship") ||
      singleStyle.includes("dual dao") ||
      singleStyle.includes("jian-fencing") ||
      singleStyle.includes("jian fencing")
    ) {
      return "Sword Master";
    }
    if (singleStyle.includes("tessenjutsu")) {
      return "Tessenjutsu";
    }
    if (
      singleStyle.includes("water tribe warrior") ||
      singleStyle.includes("warrior style") ||
      singleStyle.includes("hung gar kung fu")
    ) {
      return "Martial Arts";
    }
    if (singleStyle.includes("lightning")) {
      if (singleStyle.includes("redirect")) {
        return "Lightning Redirection";
      }
      return "Lightning Generation";
    }
    if (
      singleStyle.includes("hand to hand") ||
      singleStyle.includes("hand-to-hand")
    ) {
      return "Hand to Hand Combat";
    }
    if (singleStyle.includes("martial art")) {
      return "Martial Arts";
    }

    // Handle elemental bending
    for (const element of [
      "fire",
      "water",
      "earth",
      "air",
      "energy",
      "blood",
      "metal",
      "lava",
      "spirit",
    ]) {
      // Skip water bending check if it's a warrior style
      if (
        element === "water" &&
        (singleStyle.includes("warrior") || singleStyle.includes("tribe"))
      ) {
        continue;
      }
      if (singleStyle.includes(element)) {
        return `${element.charAt(0).toUpperCase() + element.slice(1)} Bending`;
      }
    }

    // Handle other cases
    if (singleStyle === "healing") return "Healing";
    if (singleStyle === "flight") return "Flight";

    // For any other style, capitalize each word
    return singleStyle
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  // Remove duplicates and join
  return [...new Set(cleanedStyles)].join(", ");
}

function cleanCharacterData(characters: Character[]): Character[] {
  const FIGHTING_STYLES = [
    "Fire Bending",
    "Air Bending",
    "Earth Bending",
    "Water Bending",
    "Energy Bending",
    "Blood Bending",
    "Healing",
    "Metal Bending",
    "Lava Bending",
    "Lightning Generation",
    "Lightning Redirection",
    "Spirit Bending",
    "Hand to Hand Combat",
    "Swordsmanship",
    "Flight",
    "Martial Arts",
  ] as const;

  const ELEMENTAL_BENDING = [
    "Fire Bending",
    "Air Bending",
    "Earth Bending",
    "Water Bending",
  ] as const;

  return characters.map((char) => {
    // Clean character name (value and label)
    const cleanedName = cleanCharacterName(char.label);
    char.label = cleanedName;
    char.value = cleanedName.toLowerCase().replace(/\s+/g, "-");

    // Special case for Zaheer's skin color
    if (char.value === "zaheer" && !char.skinColor) {
      char.skinColor = "Light";
    }

    // Clean nationality
    let nationality = char.nationality
      .replace(/^nationality\s*\n\t\n\t/i, "")
      .toLowerCase();
    if (nationality.includes("water tribe")) {
      nationality = "Water Tribe";
    } else if (nationality.includes("earth kingdom")) {
      nationality = "Earth Kingdom";
    } else if (nationality.includes("fire nation")) {
      nationality = "Fire Nation";
    } else if (nationality.includes("air nomad")) {
      nationality = "Air Nomads";
    } else if (nationality.includes("republic city")) {
      nationality = "United Republic";
    } else if (!nationality.trim()) {
      nationality = "Unknown";
    }

    // Clean fighting style
    let fightingStyle = char.fightingStyle.toLowerCase();
    if (!fightingStyle.trim()) {
      fightingStyle = "Unknown";
    } else {
      fightingStyle = cleanFightingStyle(fightingStyle);

      // Check if character has all four elemental bending abilities
      const hasAllElements = ELEMENTAL_BENDING.every((element) =>
        fightingStyle.includes(element)
      );

      if (hasAllElements) {
        fightingStyle = "Avatar";
      }
    }

    // Clean first appearance
    let firstAppearance = char.firstAppearance
      .replace(/^first appearance\s*\n\t\n\t"?/i, "")
      .replace(/^"+|"+$/g, "") // Remove quotes at start/end
      .replace(/&nbsp;/g, " ") // Replace non-breaking spaces with regular spaces
      .replace(/"/g, "") // Remove any remaining quotes
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
      .toLowerCase();

    if (firstAppearance.includes("book 1")) {
      firstAppearance = "Book 1";
    } else if (firstAppearance.includes("book 2")) {
      firstAppearance = "Book 2";
    } else if (firstAppearance.includes("book 3")) {
      firstAppearance = "Book 3";
    } else if (firstAppearance.includes("book 4")) {
      firstAppearance = "Book 4";
    }

    // Clean image URLs
    const imageUrl = char.imageUrl.replace(/\/revision\/.*$/, "");

    // Clean eye and skin color
    const eyeColor =
      char.eyeColor.replace(/^eye color\s*\n\t\n\t/i, "").trim() || "Unknown";
    const skinColor =
      char.skinColor
        .replace(/^(skin color|skin type)\s*\n\t\n\t/i, "")
        .trim() || "Unknown";

    // Clean quote text by removing quotes
    const quoteText = char.quoteText.replace(/^"|"$/g, "").trim();
    const quoteAttribution = char.quoteAttribution.trim();

    return {
      ...char,
      nationality,
      fightingStyle,
      firstAppearance,
      imageUrl,
      eyeColor,
      skinColor,
      quoteText,
      quoteAttribution,
    };
  });
}

// Insert a new constant (CHARACTERS_LIST) with the provided list of characters and their wiki links
const CHARACTERS_LIST: { name: string; url: string }[] = [
  { name: "Aang", url: "https://avatar.fandom.com/wiki/Aang" },
  { name: "Katara", url: "https://avatar.fandom.com/wiki/Katara" },
  { name: "Sokka", url: "https://avatar.fandom.com/wiki/Sokka" },
  { name: "Zuko", url: "https://avatar.fandom.com/wiki/Zuko" },
  { name: "Toph Beifong", url: "https://avatar.fandom.com/wiki/Toph_Beifong" },
  { name: "Iroh", url: "https://avatar.fandom.com/wiki/Iroh" },
  { name: "Appa", url: "https://avatar.fandom.com/wiki/Appa" },
  { name: "Momo", url: "https://avatar.fandom.com/wiki/Momo" },
  { name: "Azula", url: "https://avatar.fandom.com/wiki/Azula" },
  { name: "Suki", url: "https://avatar.fandom.com/wiki/Suki" },
  { name: "Korra", url: "https://avatar.fandom.com/wiki/Korra" },
  { name: "Mako", url: "https://avatar.fandom.com/wiki/Mako" },
  { name: "Bolin", url: "https://avatar.fandom.com/wiki/Bolin" },
  { name: "Asami Sato", url: "https://avatar.fandom.com/wiki/Asami_Sato" },
  { name: "Lin Beifong", url: "https://avatar.fandom.com/wiki/Lin_Beifong" },
  { name: "Tenzin", url: "https://avatar.fandom.com/wiki/Tenzin" },
  { name: "Naga", url: "https://avatar.fandom.com/wiki/Naga" },
  { name: "Varrick", url: "https://avatar.fandom.com/wiki/Varrick" },
  { name: "Kuvira", url: "https://avatar.fandom.com/wiki/Kuvira" },
  { name: "Zaheer", url: "https://avatar.fandom.com/wiki/Zaheer" },
  { name: "Amon", url: "https://avatar.fandom.com/wiki/Amon" },
  { name: "Unalaq", url: "https://avatar.fandom.com/wiki/Unalaq" },
  { name: "Ty Lee", url: "https://avatar.fandom.com/wiki/Ty_Lee" },
  { name: "Mai", url: "https://avatar.fandom.com/wiki/Mai" },
  {
    name: "King Bumi",
    url: "https://avatar.fandom.com/wiki/Bumi_(King_of_Omashu)",
  },
  { name: "Fire Lord Ozai", url: "https://avatar.fandom.com/wiki/Ozai" },
  { name: "Princess Yue", url: "https://avatar.fandom.com/wiki/Yue" },
  { name: "Jet", url: "https://avatar.fandom.com/wiki/Jet" },
  { name: "Long Feng", url: "https://avatar.fandom.com/wiki/Long_Feng" },
  { name: "Hama", url: "https://avatar.fandom.com/wiki/Hama" },
  {
    name: "Combustion Man",
    url: "https://avatar.fandom.com/wiki/Combustion_Man",
  },
  { name: "Guru Pathik", url: "https://avatar.fandom.com/wiki/Guru_Pathik" },
  { name: "The Boulder", url: "https://avatar.fandom.com/wiki/The_Boulder" },
  { name: "Fang", url: "https://avatar.fandom.com/wiki/Fang" },
  { name: "Koh the Face Stealer", url: "https://avatar.fandom.com/wiki/Koh" },
  { name: "Avatar Wan", url: "https://avatar.fandom.com/wiki/Wan" },
  { name: "Jinora", url: "https://avatar.fandom.com/wiki/Jinora" },
  { name: "Ikki", url: "https://avatar.fandom.com/wiki/Ikki" },
  { name: "Meelo", url: "https://avatar.fandom.com/wiki/Meelo" },
  { name: "Pema", url: "https://avatar.fandom.com/wiki/Pema" },
  { name: "Bumi", url: "https://avatar.fandom.com/wiki/Bumi" },
  { name: "Kya", url: "https://avatar.fandom.com/wiki/Kya" },
  {
    name: "Suyin Beifong",
    url: "https://avatar.fandom.com/wiki/Suyin_Beifong",
  },
  { name: "Opal Beifong", url: "https://avatar.fandom.com/wiki/Opal" },
  { name: "Kai", url: "https://avatar.fandom.com/wiki/Kai" },
  { name: "P'Li", url: "https://avatar.fandom.com/wiki/P%27Li" },
  { name: "Ming-Hua", url: "https://avatar.fandom.com/wiki/Ming-Hua" },
  { name: "Ghazan", url: "https://avatar.fandom.com/wiki/Ghazan" },
  { name: "Tarrlok", url: "https://avatar.fandom.com/wiki/Tarrlok" },
  { name: "Hiroshi Sato", url: "https://avatar.fandom.com/wiki/Hiroshi_Sato" },
  { name: "Zhu Li", url: "https://avatar.fandom.com/wiki/Zhu_Li" },
  { name: "Raava", url: "https://avatar.fandom.com/wiki/Raava" },
  { name: "Vaatu", url: "https://avatar.fandom.com/wiki/Vaatu" },
  { name: "Admiral Zhao", url: "https://avatar.fandom.com/wiki/Zhao" },
  { name: "Lieutenant (Amon)", url: "https://avatar.fandom.com/wiki/Amon" },
  { name: "Eska", url: "https://avatar.fandom.com/wiki/Eska" },
];

// Insert Supabase client setup (using service role key) after dotenv config
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Please check your .env file."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  global: { headers: { Authorization: `Bearer ${supabaseServiceRoleKey}` } },
});

const GAME_NAME = "AvatarGuesser";

// Insert a new function (uploadCharactersToSupabase) to upsert characters and their attributes
async function uploadCharactersToSupabase(
  characters: Character[]
): Promise<boolean> {
  console.log("Uploading characters to Supabase...");
  try {
    // 1. Upsert Game
    console.log(`Upserting game: ${GAME_NAME}...`);
    const { data: game, error: gameError } = await supabase
      .from("Game")
      .upsert(
        { name: GAME_NAME },
        { onConflict: "name", ignoreDuplicates: false }
      )
      .select("id, name")
      .single();
    if (gameError) {
      throw gameError;
    }
    if (!game) {
      throw new Error("Failed to upsert game.");
    }
    console.log(`Game "${game.name}" (ID: ${game.id}) upserted successfully.`);

    // 2. Define and Upsert AttributeDefinitions (using the same attribute names as in seedSupabase.ts)
    const attributeNames = [
      "Gender",
      "Fighting Style",
      "Nationality",
      "Eye Color",
      "Skin Color",
      "First Appearance",
    ];
    console.log("Upserting attribute definitions...");
    const attributeDefinitions: { id: string; name: string }[] = [];
    for (const attrName of attributeNames) {
      const { data: attrDef, error: attrDefError } = await supabase
        .from("AttributeDefinition")
        .upsert(
          { gameId: game.id, name: attrName },
          { onConflict: "gameId, name", ignoreDuplicates: false }
        )
        .select("id, name")
        .single();
      if (attrDefError) {
        throw attrDefError;
      }
      if (!attrDef) {
        throw new Error(`Failed to upsert attribute: ${attrName}`);
      }
      attributeDefinitions.push(attrDef);
      console.log(
        `  Attribute "${attrDef.name}" (ID: ${attrDef.id}) upserted.`
      );
    }
    const attributeDefinitionMap = new Map(
      attributeDefinitions.map((ad) => [ad.name, ad.id])
    );

    // 3. Upsert Characters and their Attributes
    console.log("Upserting characters and their attributes...");
    for (const char of characters) {
      console.log(`  Processing character: ${char.label}...`);
      const { data: character, error: charError } = await supabase
        .from("Character")
        .upsert(
          {
            gameId: game.id,
            value: char.value,
            label: char.label,
            imageUrl: char.imageUrl,
            quote: char.quoteText,
            quoteAttribution: char.quoteAttribution,
          },
          { onConflict: "gameId, value", ignoreDuplicates: false }
        )
        .select("id, label")
        .single();
      if (charError) {
        throw charError;
      }
      if (!character) {
        throw new Error(`Failed to upsert character: ${char.label}`);
      }
      console.log(
        `    Character "${character.label}" (ID: ${character.id}) upserted.`
      );

      // Create CharacterAttribute entries (using the same mapping as in seedSupabase.ts)
      for (const attrName of attributeNames) {
        const attributeDefinitionId = attributeDefinitionMap.get(attrName);
        // Convert attribute name to camelCase (e.g., "Fighting Style" -> "fightingStyle")
        const jsonKey = attrName
          .split(" ")
          .map((word, index) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("");
        const characterAttributeValue = (char as any)[jsonKey];
        if (attributeDefinitionId && characterAttributeValue !== undefined) {
          console.log(
            `      Upserting attribute "${attrName}" with value "${characterAttributeValue}"`
          );
          const { error: charAttrError } = await supabase
            .from("CharacterAttribute")
            .upsert(
              {
                characterId: character.id,
                attributeDefinitionId,
                value: String(characterAttributeValue),
              },
              {
                onConflict: "characterId, attributeDefinitionId",
                ignoreDuplicates: false,
              }
            );
          if (charAttrError) {
            throw charAttrError;
          }
        } else if (
          attributeDefinitionId &&
          characterAttributeValue === undefined
        ) {
          console.warn(
            `      Attribute "${attrName}" (key: "${jsonKey}") not found or undefined for character "${char.label}". Skipping.`
          );
        }
      }
    }
    console.log("Upload completed successfully.");
    return true;
  } catch (error) {
    console.error("Error uploading characters to Supabase:", error);
    return false;
  }
}

// Update the main() function so that it scrapes only the provided list, cleans, and then uploads to Supabase (and logs any failures or null values)
async function main() {
  console.log("Starting character data scraping (using provided list)...");
  const characters: Character[] = [];
  const failedCharacters: { name: string; url: string; error?: any }[] = [];
  const nullValuesCharacters: { name: string; nullFields: string[] }[] = [];

  for (const { name, url } of CHARACTERS_LIST) {
    console.log(`Scraping ${name} (${url})...`);
    try {
      const character = await scrapeCharacterData(url);
      if (character) {
        // (Optional) log if any field is null or empty (or "unknown")
        const nullFields = Object.entries(character)
          .filter(([_, v]) => !v || v === "unknown")
          .map(([k]) => k);
        if (nullFields.length > 0) {
          console.warn(
            `⚠️ Character "${name}" (${url}) has null or "unknown" fields: ${nullFields.join(
              ", "
            )}`
          );
          nullValuesCharacters.push({ name, nullFields });
        }
        characters.push(character);
        console.log(`Successfully scraped "${character.label}" (${url}).`);
      } else {
        console.error(
          `Failed to scrape "${name}" (${url}) (scrapeCharacterData returned null).`
        );
        failedCharacters.push({ name, url });
      }
    } catch (err) {
      console.error(`Error scraping "${name}" (${url}):`, err);
      failedCharacters.push({ name, url, error: err });
    }
    // (Optional) add a small delay (e.g., 1 second) between requests to avoid hammering the wiki
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\nCleaning character data...");
  const cleanedCharacters = cleanCharacterData(characters);
  console.log("Data cleaning completed.");

  // (Optional) log statistics (e.g., unique nationalities, fighting styles, first appearances)
  const nationalities = new Set(cleanedCharacters.map((c) => c.nationality));
  const fightingStyles = new Set(cleanedCharacters.map((c) => c.fightingStyle));
  const firstAppearances = new Set(
    cleanedCharacters.map((c) => c.firstAppearance)
  );
  console.log("\nData Statistics:");
  console.log(`- Unique Nationalities: ${nationalities.size}`);
  console.log(`- Unique Fighting Styles: ${fightingStyles.size}`);
  console.log(`- Unique First Appearances: ${firstAppearances.size}`);

  // (Optional) log if any character failed to parse or has null values
  if (failedCharacters.length > 0) {
    console.warn("\n⚠️ Failed Characters (scrape or parse error):");
    failedCharacters.forEach(({ name, url, error }) => {
      console.warn(
        `  "${name}" (${url}) – Error: ${
          error ? error.message : "scrape returned null"
        }`
      );
    });
  }
  if (nullValuesCharacters.length > 0) {
    console.warn("\n⚠️ Characters with null or 'unknown' fields:");
    nullValuesCharacters.forEach(({ name, nullFields }) => {
      console.warn(`  "${name}" – Null fields: ${nullFields.join(", ")}`);
    });
  }

  // Upload (upsert) characters to Supabase
  const uploadSuccess = await uploadCharactersToSupabase(cleanedCharacters);
  if (uploadSuccess) {
    console.log(
      "All characters (and their attributes) uploaded to Supabase successfully."
    );
  } else {
    console.error("Upload to Supabase failed. (See error log above.)");
  }
}

// Call main() at the end
main().catch((err) => {
  console.error("Uncaught error in main:", err);
  process.exit(1);
});
