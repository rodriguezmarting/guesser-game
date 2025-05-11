import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import { join } from "path";

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

async function getCharacterUrls(): Promise<string[]> {
  const urls: string[] = [];

  // Scrape ATLA main characters
  const atlaDom = await fetchPage(
    "https://avatar.fandom.com/wiki/Category:Main_characters"
  );
  const atlaLinks = atlaDom.window.document.querySelectorAll(
    ".category-page__member-link"
  );
  urls.push(
    ...Array.from(atlaLinks)
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => href !== null)
      .map((href) => `https://avatar.fandom.com${href}`)
  );

  // Scrape LOK main characters
  const lokDom = await fetchPage(
    "https://avatar.fandom.com/wiki/Category:Main_characters_(Legend_of_Korra)"
  );
  const lokLinks = lokDom.window.document.querySelectorAll(
    ".category-page__member-link"
  );
  urls.push(
    ...Array.from(lokLinks)
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => href !== null)
      .map((href) => `https://avatar.fandom.com${href}`)
  );

  return urls;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanCharacterData(characters: Character[]): Character[] {
  // Define all possible fighting styles
  const FIGHTING_STYLES = [
    "Firebending",
    "Airbending",
    "Earthbending",
    "Waterbending",
    "Energybending",
    "Bloodbending",
    "Healing",
    "Metalbending",
    "Lavabending",
    "Lighting generation",
    "Lighting redirection",
    "Spiritbending",
    "Hand-to-hand combat",
    "Swordsmanship",
    "Flight",
    "Martial arts",
  ] as const;

  return characters.map((char) => {
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
      // Find all matching fighting styles
      const foundStyles = FIGHTING_STYLES.filter((style) =>
        fightingStyle.includes(style.toLowerCase())
      );

      if (foundStyles.length === 0) {
        fightingStyle = "Unknown";
      } else if (foundStyles.length === 1) {
        fightingStyle = foundStyles[0];
      } else {
        // Multiple styles found, join with commas
        fightingStyle = foundStyles.join(", ");
      }
    }

    // Clean first appearance
    let firstAppearance = char.firstAppearance
      .replace(/^first appearance\s*\n\t\n\t"?/i, "")
      .replace(/^"+|"+$/g, "")
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

async function main() {
  try {
    console.log("Starting character data scraping...");

    const characterUrls = await getCharacterUrls();
    console.log(`Found ${characterUrls.length} characters to scrape`);

    const characters: Character[] = [];
    for (const url of characterUrls) {
      console.log(`Scraping ${url}...`);
      const character = await scrapeCharacterData(url);
      if (character) {
        characters.push(character);
        console.log(`Successfully scraped ${character.label}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\nCleaning character data...");
    const cleanedCharacters = cleanCharacterData(characters);
    console.log("Data cleaning completed");

    const outputPath = join(process.cwd(), "public", "characters.json");
    await fs.writeFile(outputPath, JSON.stringify(cleanedCharacters, null, 2));

    console.log(
      `\nSuccessfully processed ${cleanedCharacters.length} characters`
    );
    console.log(`Data saved to ${outputPath}`);

    // Print some statistics
    const nationalities = new Set(cleanedCharacters.map((c) => c.nationality));
    const fightingStyles = new Set(
      cleanedCharacters.map((c) => c.fightingStyle)
    );
    const firstAppearances = new Set(
      cleanedCharacters.map((c) => c.firstAppearance)
    );

    console.log("\nData Statistics:");
    console.log(`- Unique Nationalities: ${nationalities.size}`);
    console.log(`- Unique Fighting Styles: ${fightingStyles.size}`);
    console.log(`- Unique First Appearances: ${firstAppearances.size}`);
  } catch (error) {
    console.error("Error during processing:", error);
  }
}

main();
