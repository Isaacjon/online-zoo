export const PET_ID_TO_SLUG: Record<number, string> = {
  1: "panda",
  2: "lemur",
  3: "gorilla",
  4: "alligator",
  5: "eagle",
  6: "koala",
  7: "lion",
  8: "tiger",
  9: "red-panda",
  10: "mountain-gorilla",
  11: "elephant",
  12: "sea-otter",
  13: "bengal-tiger",
  14: "gray-wolf",
  15: "fennec-fox",
  16: "grizzly-bear",
  17: "dolphin",
  18: "snow-leopard",
  19: "polar-bear",
  20: "jaguar",
  21: "ring-tailed-lemur",
  22: "rhinoceros",
  23: "arctic-fox",
  24: "crocodile",
  25: "macaw",
  26: "komodo-dragon",
  27: "sloth",
  28: "cheetah",
};

export function getPetSlug(petId: number): string {
  return PET_ID_TO_SLUG[petId] ?? "panda";
}

/** Fallback common names when URL has no commonName (e.g. map, support cards) */
export const SLUG_TO_COMMON_NAME: Record<string, string> = {
  panda: "Giant Panda",
  lemur: "Lemur",
  gorilla: "Gorilla",
  alligator: "American Alligator",
  eagle: "Bald Eagle",
  koala: "Koala",
  lion: "Lion",
  tiger: "Tiger",
  "red-panda": "Red Panda",
  "mountain-gorilla": "Mountain Gorilla",
  elephant: "Elephant",
  "sea-otter": "Sea Otter",
  "bengal-tiger": "Bengal Tiger",
  "gray-wolf": "Gray Wolf",
  "fennec-fox": "Fennec Fox",
  "grizzly-bear": "Grizzly Bear",
  dolphin: "Dolphin",
  "snow-leopard": "Snow Leopard",
  "polar-bear": "Polar Bear",
  jaguar: "Jaguar",
  "ring-tailed-lemur": "Ring-Tailed Lemur",
  rhinoceros: "Rhinoceros",
  "arctic-fox": "Arctic Fox",
  crocodile: "Crocodile",
  macaw: "Macaw",
  "komodo-dragon": "Komodo Dragon",
  sloth: "Sloth",
  cheetah: "Cheetah",
};

export function getPetCommonNameFromSlug(slug: string): string | undefined {
  return SLUG_TO_COMMON_NAME[slug];
}
