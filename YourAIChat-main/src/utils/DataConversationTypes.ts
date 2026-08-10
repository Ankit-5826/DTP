type ConversationID = {
  id: string;
  title?: string;
  createdAt: number;
  isActive: boolean;
};

type Conversation = {
  role: "user" | "ai";
  text: string;
  ts: number;
};

type Conversations = {
  [key: string]: Conversation[];
};

type SaveData = {
  conversationIDs: ConversationID[] | null,
  activeConversationID: string | null,
  conversationsData: Conversations | null,
}

export type { ConversationID, Conversation, Conversations, SaveData };
