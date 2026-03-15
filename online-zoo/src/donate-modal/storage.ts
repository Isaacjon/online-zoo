const SAVED_CARDS_KEY = "online-zoo-saved-cards";

export interface SavedCard {
  id: string;
  last4: string;
  masked: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export function getSavedCards(): SavedCard[] {
  try {
    const stored = localStorage.getItem(SAVED_CARDS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as SavedCard[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCard(card: Omit<SavedCard, "id">): void {
  const cards = getSavedCards();
  const cardNum = card.cardNumber.replace(/\s/g, "");
  const existingIdx = cards.findIndex((c) => c.cardNumber.replace(/\s/g, "") === cardNum);
  const id = existingIdx >= 0 ? cards[existingIdx].id : `card-${Date.now()}`;
  const savedCard: SavedCard = { ...card, id };
  const updated =
    existingIdx >= 0
      ? cards.map((c, i) => (i === existingIdx ? savedCard : c))
      : [...cards, savedCard];
  try {
    localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(updated));
  } catch {}
}

export function maskCardNumber(num: string): string {
  const digits = num.replace(/\s/g, "");
  if (digits.length < 8) return num;
  const first4 = digits.slice(0, 4);
  const last4 = digits.slice(-4);
  return `${first4} **** **** ${last4}`;
}
