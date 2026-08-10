import type { Conversation } from "../utils/DataConversationTypes";
import loadingIcon from "../assets/svgs/chatLoading.svg";
import { useEffect, useRef } from "react";
export default function ChatsBox({
  currentConversation,
  isLoading,
}: {
  currentConversation: Conversation[];
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentConversation]);
  return (
    <>
      <div className="messages" ref={containerRef}>
        {currentConversation.map((chat: Conversation, index: number) => {
          return chat.role === "user" ? (
            <div className="row user" key={index}>
              <div className="av-u avatar">U</div>
              <div className="bubble user">{chat.text}</div>
            </div>
          ) : (
            <div className="row" key={index}>
              <div className="av-a avatar">A</div>

              <div
                className="bubble ai"
                dangerouslySetInnerHTML={{ __html: chat.text }}
              />
            </div>
          );
        })}
        {isLoading && (
          <div className="row loadingChat">
            <div className="av-a avatar">A</div>
            <img src={loadingIcon} alt="loading icon" />
          </div>
        )}
      </div>
    </>
  );
}
