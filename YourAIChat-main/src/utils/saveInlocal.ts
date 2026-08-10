
import type {
  ConversationID,
  Conversations,
  SaveData,
} from "../utils/DataConversationTypes";


const getSaveLocalhostData = (): SaveData => {
  const conversationIDs = localStorage.getItem("ConversationIDs");
  const activeConversationID = localStorage.getItem("ActiveConversationID");
  const conversationsData = localStorage.getItem("ConversationsData");

  return {
    conversationIDs: conversationIDs
      ? (JSON.parse(conversationIDs) as ConversationID[])
      : null,

    activeConversationID,

    conversationsData: conversationsData
      ? (JSON.parse(conversationsData) as Conversations)
      : null,
  };
};

export { getSaveLocalhostData };
