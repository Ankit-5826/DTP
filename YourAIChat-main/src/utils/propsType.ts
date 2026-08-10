import type {
  ConversationID,
  Conversation,
  Conversations,
} from "./DataConversationTypes";

type MainTopHeaderProps = {
  onToggle?: () => void;
  rightBodyRef?: React.RefObject<HTMLDivElement | null>;
  activeConversationID?: string;
  conversationsData?: Conversations;
  onChat?: (question: string) => {};
  waitingRes?: string[];
};

type SideBarProps = {
  showSideBar: boolean;
  ConversationsHeaders: ConversationID[];
  addNewConversation: () => void;
  conversationsChange?: (id_: string) => void;
  removeConversation?: (id_: string) => void;
  leftBodyRef?: React.RefObject<HTMLDivElement | null>;
  showAddKeypopUp?: () => void;
};
type ChatsBoxProps = {
  currentConversation?: Conversation[] | null;
  onQuestionAsk?: (question: string) => void;
  isLoading?: boolean;
};

export type { MainTopHeaderProps, SideBarProps, ChatsBoxProps };
