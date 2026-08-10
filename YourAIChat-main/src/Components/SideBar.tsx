import type { SideBarProps } from "../utils/propsType";
import type { ConversationID } from "../utils/DataConversationTypes";
import sideLogos from "../assets/svgs/close.svg";

export default function SideBar({
  showSideBar,
  ConversationsHeaders,
  addNewConversation,
  conversationsChange,
  removeConversation,
  leftBodyRef,
  showAddKeypopUp
}: SideBarProps) {
  const mainStyle = {
    display: showSideBar ? "block" : "none",
  };

  return (
    <div className="sideBarMainBox" style={mainStyle} ref={leftBodyRef}>
      <div className="sideBarheader">
        <div className="logsBox">A</div>
        <div className="appNameBox ">AI Chat</div>
      </div>
      <div className="sideBarBody">
        <div className="newConversationBtnBox" onClick={addNewConversation}>
          <span>+ New Conversations</span>
        </div>
        <div className="conversationBox">
          <div className="conversationBoxTitle">
            <span> Recent</span>
          </div>
          <div className="allConversations">
            {ConversationsHeaders.map((conversation: ConversationID) => {
              return (
                <div
                  className={`conversationsbtn  ${
                    conversation.isActive ? "active" : ""
                  }`}
                  key={conversation.id}
                  onClick={() => {
                    if (conversationsChange)
                      conversationsChange(conversation.id);
                  }}
                >
                  <span> {conversation.title || "New Conversations"} </span>  
                  <div onClick={() => {
                    if (removeConversation)
                      removeConversation(conversation.id);
                  }}>  <img src={sideLogos} alt="crose Icon"  /> </div>
                </div>
              );
            })}
          </div>
          <div className="addKeybox">
            <span onClick={showAddKeypopUp}>Add/Change Key</span>
          </div>
        </div>
      </div>
      <div className="sideBarFooter">
        <div className="sideBarFooterLogsBox">U</div>
        <div className="usernametitle">
          <span>User</span>
        </div>
      </div>
    </div>
  );
}
