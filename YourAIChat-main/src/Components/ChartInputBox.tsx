import { useRef } from "react";
import sendIcon from "../assets/svgs/send.svg";
import type { ChatsBoxProps } from "../utils/propsType";
export default function ChartInputBox({ onQuestionAsk }: ChatsBoxProps) {
  const inputbox = useRef<HTMLInputElement>(null);
  const sendbox = useRef<HTMLDivElement>(null);
  const inputOuterbox = useRef<HTMLDivElement>(null);
  const onInput = () => {
    if (inputbox.current && inputOuterbox.current && sendbox.current) {
      
      if (inputbox.current.value.length > 0) {
        if (inputbox.current?.value.trim() === "") return;
        inputOuterbox.current.style.borderColor = "#6366F1";
        sendbox.current.style.backgroundColor = "#6366F1";
      } else {
        inputOuterbox.current.style.borderColor = "#E5E7EB";
        sendbox.current.style.backgroundColor = "#e5e7eb";
      }
    }
  };
  
  const askBtnClick = () => {
    if (onQuestionAsk) {
      if (inputbox.current?.value.trim() === "") return;
      const question = inputbox.current?.value || "";
      onQuestionAsk(question);
      if (inputbox.current) {
        inputbox.current.value = "";
        onInput();
      }
    }
  };
  return (
    <>
      <div className="mainInputBox">
        <div className="mainInputBoxInner" ref={inputOuterbox}>
          <input
            type="text"
            name=""
            id=""
            placeholder="Ask Anything...."
            ref={inputbox}
            onChange={onInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askBtnClick();
              }
            }}
          />
          <div className="sendBtn" ref={sendbox} onClick={askBtnClick}>
            <img src={sendIcon} alt="send icon" />
          </div>
        </div>
      </div>
    </>
  );
}
