import { readingLevels } from "./readingLevels";
import { mathLevels } from "./mathLevels";
import { grammarLevels } from "./grammarLevels";

export const ROOMS = [
  {
    id: "reading",
    name: "סִפְרִיַּת הַקְּסָמִים",
    shortName: "קְרִיאָה",
    emoji: "📚",
    color: "from-indigo-900 to-purple-900",
    accent: "#818cf8",
    borderColor: "border-indigo-500",
    levels: readingLevels,
    description: "קְרָא סִיפּוּרִים וַעֲנֵה עַל שְׁאֵלוֹת",
  },
  {
    id: "math",
    name: "מַרְתֵּף הַמִּסְפָּרִים",
    shortName: "חֶשְׁבּוֹן",
    emoji: "🔢",
    color: "from-blue-900 to-cyan-900",
    accent: "#38bdf8",
    borderColor: "border-blue-500",
    levels: mathLevels,
    description: "פְּתֹר חִידוֹת מַתֵּמָטִיקָה",
  },
  {
    id: "grammar",
    name: "יַעַר הַמִּלִּים",
    shortName: "שָׂפָה",
    emoji: "🌿",
    color: "from-green-900 to-emerald-900",
    accent: "#34d399",
    borderColor: "border-green-500",
    levels: grammarLevels,
    description: "לְמַד דִּקְדּוּק וּמִלִּים חֲדָשׁוֹת",
  },
];

export { readingLevels, mathLevels, grammarLevels };
