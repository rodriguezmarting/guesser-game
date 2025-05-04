import { JSDOM } from "jsdom";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Character {
  value: string;
  label: string;
  gender: string;
  fightingStyle: string;
  nationality: string;
  firstAppearance: string;
  imageUrl: string;
  silhouetteUrl: string;
  quote: string;
  voiceUrl: string;
  quoteText: string;
  quoteAttribution: string;
}

async function fetchPage(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  return new JSDOM(html);
}

async function findFirstAppearance(document: Document): Promise<string> {
  const selectors = [
    '[data-source="firstappearance"]',
    '[data-source="first appearance"]',
    '[data-source="debut"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element?.textContent?.trim()) {
      return element.textContent.trim();
    }
  }

  return "Unknown";
}

async function findQuote(document: Document): Promise<string> {
  const quoteElement = document.querySelector('[data-source="quote"]');
  if (quoteElement?.textContent?.trim()) {
    return quoteElement.textContent.trim();
  }

  return "No quote available";
}

async function findSilhouette(document: Document): Promise<string> {
  const imageElement = document.querySelector(".pi-image-thumbnail");
  return imageElement?.getAttribute("src") || "";
}

async function findVoiceUrl(document: Document): Promise<string> {
  const voiceSection = Array.from(document.querySelectorAll("h2, h3")).find(
    (el) => el.textContent?.toLowerCase().includes("voice")
  );

  if (voiceSection) {
    const nextElement = voiceSection.nextElementSibling;
    if (nextElement) {
      const soundLink = nextElement.querySelector(
        'a[href*=".mp3"], a[href*=".wav"]'
      );
      if (soundLink?.getAttribute("href")) {
        return soundLink.getAttribute("href") || "";
      }
    }
  }

  return "";
}

function extractQuoteParts(document: Document) {
  const quoteTable = document.querySelector(".quote");
  if (!quoteTable) return { quoteText: "", quoteAttribution: "" };

  const rows = quoteTable.querySelectorAll("tr");
  let quoteText = "";
  let quoteAttribution = "";

  if (rows[0]) {
    // Get the quote text, remove HTML tags, and trim
    quoteText = rows[0].textContent?.replace(/\s+/g, " ").trim() || "";
  }
  if (rows[1]) {
    // Get the attribution, remove <sup> tags and trim
    const td = rows[1].querySelector("td");
    if (td) {
      td.querySelectorAll("sup").forEach((sup) => sup.remove());
      quoteAttribution = td.textContent?.replace(/\s+/g, " ").trim() || "";
    }
  }
  return { quoteText, quoteAttribution };
}

async function scrapeCharacterData(
  characterUrl: string
): Promise<Character | null> {
  try {
    const dom = await fetchPage(characterUrl);
    const document = dom.window.document;

    const title = document
      .querySelector(".page-header__title")
      ?.textContent?.trim();
    if (!title) return null;

    const infobox = document.querySelector(".portable-infobox");
    if (!infobox) return null;

    const getInfoboxData = (labels: string[]) => {
      for (const label of labels) {
        const element = infobox.querySelector(`[data-source="${label}"]`);
        if (element?.textContent?.trim()) {
          return element.textContent.trim();
        }
      }
      return "";
    };

    const imageElement = infobox.querySelector(".pi-image-thumbnail");
    const imageUrl = imageElement?.getAttribute("src") || "";

    const pronouns = getInfoboxData(["pronouns"]).toLowerCase();
    let gender = "unknown";
    if (pronouns.includes("he/him")) {
      gender = "male";
    } else if (pronouns.includes("she/her")) {
      gender = "female";
    }

    const fightingStyle = getInfoboxData(["fighting style", "fightingstyle"]);
    const firstAppearance = getInfoboxData([
      "appearance",
      "first appearance",
      "firstappearance",
      "debut",
    ]);

    const { quoteText, quoteAttribution } = extractQuoteParts(document);
    const quote = await findQuote(document);
    const silhouetteUrl = await findSilhouette(document);
    const voiceUrl = await findVoiceUrl(document);

    const character: Character = {
      value: title.toLowerCase().replace(/\s+/g, "-"),
      label: title,
      gender,
      fightingStyle,
      nationality: getInfoboxData(["nationality"]),
      firstAppearance,
      imageUrl,
      silhouetteUrl,
      quote,
      voiceUrl,
      quoteText,
      quoteAttribution,
    };

    return character;
  } catch (error) {
    console.error(`Error scraping ${characterUrl}:`, error);
    return null;
  }
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
  return characters.map((char) => {
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
    }

    // Clean fighting style
    let fightingStyle = char.fightingStyle.toLowerCase();
    if (fightingStyle.includes("waterbending")) {
      fightingStyle = "Waterbending";
    } else if (fightingStyle.includes("earthbending")) {
      fightingStyle = "Earthbending";
    } else if (fightingStyle.includes("firebending")) {
      fightingStyle = "Firebending";
    } else if (fightingStyle.includes("airbending")) {
      fightingStyle = "Airbending";
    } else if (fightingStyle.includes("nonbender")) {
      fightingStyle = "Nonbender";
    }
    // Split element and 'bending' (e.g., 'Firebending' -> 'Fire Bending')
    if (fightingStyle.match(/^[a-z]+bending$/i)) {
      fightingStyle = fightingStyle.replace(
        /([a-z]+)bending$/i,
        (match, p1) => {
          return `${capitalize(p1)} Bending`;
        }
      );
    }

    // Clean first appearance
    let firstAppearance = char.firstAppearance
      .replace(/^first appearance\s*\n\t\n\t"?/i, "")
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
    const silhouetteUrl = char.silhouetteUrl.replace(/\/revision\/.*$/, "");

    return {
      ...char,
      nationality,
      fightingStyle,
      firstAppearance,
      imageUrl,
      silhouetteUrl,
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
        console.log(`- Gender: ${character.gender}`);
        console.log(`- First Appearance: ${character.firstAppearance}`);
        console.log(`- Quote: ${character.quote.substring(0, 50)}...`);
        console.log(`- Has Silhouette: ${!!character.silhouetteUrl}`);
        console.log(`- Has Voice: ${!!character.voiceUrl}`);
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
