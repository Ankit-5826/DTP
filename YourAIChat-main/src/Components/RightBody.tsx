
import ChartInputBox from "./ChartInputBox";
import MainchatArea from "./MainchatArea";
import MainTopHeader from "./MainTopHeader";
import type { MainTopHeaderProps } from "../utils/propsType";
import { useEffect } from "react";

export default function RightBody({
  onToggle,
  rightBodyRef,
  activeConversationID,
  conversationsData,
  onChat,
  waitingRes,
}: MainTopHeaderProps) {
  let showLoading = false;
  if (waitingRes && activeConversationID) {
    showLoading = waitingRes.includes(activeConversationID)
  }


  const test1 = async () => {
    try {
      console.log("----------",`${import.meta.env.VITE_API_URL}/api/v1/healthCheck/`)
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/healthCheck/`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("----------->>>> ", data);
      alert("Done")
    } catch (error) {
      console.error(error);
      console.log("----------->>>> ", error);
      alert("Fail")
    }
  }

  return (
    <>
      <h1 onClick={() => {
        test1();
      }}>Backend <br/>Check...</h1>
      <div className="rightBodyMain" ref={rightBodyRef}>
        <MainTopHeader onToggle={onToggle} />
        <MainchatArea
          currentConversation={
            conversationsData && activeConversationID ? conversationsData[activeConversationID] : null
          }
          isLoading={showLoading}
          onQuestionAsk={onChat}
        />
        <ChartInputBox onQuestionAsk={onChat} />
      </div>
    </>
  );
}
