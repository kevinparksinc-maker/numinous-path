export type ReadingMethod = "tarot" | "iching";

export type CardSelection = {
  position: string;
  card: string;
  reversed: boolean;
};

export type ActiveReading = {
  id: string;
  createdAt: string;
  method: ReadingMethod;
  spreadName: string;
  intention: string;
  cards: CardSelection[];
  initialReading: string;
};

export type CompanionMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
