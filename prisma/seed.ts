import { PrismaClient } from "../generated/prisma"; // Adjusted path
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url"; // Import for ESM __dirname equivalent

// ESM equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Define the structure of your character data in the JSON file
interface JsonCharacter {
  value: string;
  label: string;
  imageUrl?: string;
  gender?: string;
  fightingStyle?: string;
  nationality?: string;
  eyeColor?: string;
  skinColor?: string;
  firstAppearance?: string;
  quoteText?: string; // Renamed from quote in JSON to avoid conflict with model field
  quoteAttribution?: string;
}

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create or find the 'AvatarGuesser' Game
  const gameName = "AvatarGuesser";
  let game = await prisma.game.upsert({
    where: { name: gameName },
    update: {},
    create: {
      name: gameName,
      description: "Guess the Avatar: The Last Airbender character!",
    },
  });
  console.log(`Created/found game: ${game.name} (ID: ${game.id})`);

  // 2. Define attributes for this game
  const attributeNames = [
    { name: "Gender", description: "The character's gender" },
    {
      name: "Fighting Style",
      description: "The character's primary fighting style(s)",
    },
    { name: "Nationality", description: "The character's nation of origin" },
    { name: "Eye Color", description: "The character's eye color" },
    { name: "Skin Color", description: "The character's skin color" },
    {
      name: "First Appearance",
      description: "The episode or media where the character first appeared",
    },
  ];

  const attributeDefinitions: { [key: string]: { id: string; name: string } } =
    {};
  for (const attr of attributeNames) {
    const definition = await prisma.attributeDefinition.upsert({
      where: { gameId_name: { gameId: game.id, name: attr.name } },
      update: { description: attr.description },
      create: {
        gameId: game.id,
        name: attr.name,
        description: attr.description,
      },
    });
    attributeDefinitions[attr.name] = {
      id: definition.id,
      name: definition.name,
    };
    console.log(` Upserted attribute definition: ${definition.name}`);
  }

  // 3. Read characters from JSON file
  const charactersFilePath = path.join(
    __dirname,
    "../public/data/characters.json"
  );
  if (!fs.existsSync(charactersFilePath)) {
    console.error(`Error: Characters file not found at ${charactersFilePath}`);
    return;
  }
  const charactersFile = fs.readFileSync(charactersFilePath, "utf-8");
  const charactersData: JsonCharacter[] = JSON.parse(charactersFile);
  console.log(`Read ${charactersData.length} characters from JSON.`);

  // 4. Create Character records and their CharacterAttribute records
  for (const charData of charactersData) {
    const character = await prisma.character.upsert({
      where: { gameId_value: { gameId: game.id, value: charData.value } },
      update: {
        label: charData.label,
        imageUrl: charData.imageUrl,
        quote: charData.quoteText, // Map from quoteText
        quoteAttribution: charData.quoteAttribution,
      },
      create: {
        gameId: game.id,
        value: charData.value,
        label: charData.label,
        imageUrl: charData.imageUrl,
        quote: charData.quoteText, // Map from quoteText
        quoteAttribution: charData.quoteAttribution,
      },
    });
    console.log(
      `  Upserted character: ${character.label} (ID: ${character.id}) - Quote: ${character.quote}`
    );

    // Create attributes for this character
    const attributesToCreate: {
      attributeDefinitionId: string;
      value: string | undefined;
    }[] = [
      {
        attributeDefinitionId: attributeDefinitions["Gender"].id,
        value: charData.gender,
      },
      {
        attributeDefinitionId: attributeDefinitions["Fighting Style"].id,
        value: charData.fightingStyle,
      },
      {
        attributeDefinitionId: attributeDefinitions["Nationality"].id,
        value: charData.nationality,
      },
      {
        attributeDefinitionId: attributeDefinitions["Eye Color"].id,
        value: charData.eyeColor,
      },
      {
        attributeDefinitionId: attributeDefinitions["Skin Color"].id,
        value: charData.skinColor,
      },
      {
        attributeDefinitionId: attributeDefinitions["First Appearance"].id,
        value: charData.firstAppearance,
      },
    ];

    for (const attr of attributesToCreate) {
      if (
        attr.value !== undefined &&
        attr.value !== null &&
        attr.value.trim() !== ""
      ) {
        await prisma.characterAttribute.upsert({
          where: {
            characterId_attributeDefinitionId: {
              characterId: character.id,
              attributeDefinitionId: attr.attributeDefinitionId,
            },
          },
          update: { value: attr.value },
          create: {
            characterId: character.id,
            attributeDefinitionId: attr.attributeDefinitionId,
            value: attr.value,
          },
        });
      }
    }
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
