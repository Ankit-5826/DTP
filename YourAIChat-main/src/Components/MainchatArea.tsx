import ChatsBox from "./ChatsBox";
import DefaultChatPage from "./DefaultChatPage";
import type { ChatsBoxProps } from "../utils/propsType";

export default function MainchatArea({
  currentConversation,
  isLoading,
  onQuestionAsk,
}: ChatsBoxProps) {
  return (
    <>
      <div className="mainChatArea">
        {currentConversation ? (
          <ChatsBox
            currentConversation={currentConversation}
            isLoading={isLoading ? true : false}
          />
        ) : (
          <DefaultChatPage onQuestionAsk={onQuestionAsk} />
        )}
      </div>
    </>
  );  
}
