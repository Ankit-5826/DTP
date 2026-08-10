import { use, useEffect, useState } from "react";
import "../assets/CSS/mainContainer.css";
import RightBody from "./RightBody";
import SideBar from "./SideBar";
import ApiKeyModal from "./ApiKeyModal";
import { useRef } from "react";
import type {
  ConversationID,
  Conversations,
  Conversation,
  SaveData,
} from "../utils/DataConversationTypes";
import { getAiChatResponse } from "../api/aiChatResponse";
import { getSaveLocalhostData } from "../utils/saveInlocal";

function Container() {
  const [showSideBar, setShowSideBar] = useState(true);
  const rightBodyRef = useRef<HTMLDivElement>(null);
  let saveData: SaveData = {
    conversationIDs: null,
    activeConversationID: null,
    conversationsData: null,
  };

  saveData = getSaveLocalhostData();

  const defaultConversationId: ConversationID = {
    id: "conver_" + crypto.randomUUID(),
    title: "New Conversation",
    createdAt: Date.now(),
    isActive: true,
  };

  const [allConversations, setAllConversations] = useState<Conversations>(
    saveData.conversationsData || {},
  );

  const [conversationId, setConversationId] = useState<ConversationID[]>(
    saveData.conversationIDs || [defaultConversationId],
  );

  const [activeConversationID, setActiveConversationID] = useState<string>(
    saveData.activeConversationID || defaultConversationId.id,
  );

  const [waitingForResponse, setWaitingForResponse] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setShowSideBar(false);
        if (rightBodyRef.current) {
          rightBodyRef.current.style.width = "100%";
        }
      } else {
        setShowSideBar(true);
        if (rightBodyRef.current) {
          rightBodyRef.current.style.width = "80%";
        }
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("ConversationIDs", JSON.stringify(conversationId));
  }, [conversationId]);
  useEffect(() => {
    localStorage.setItem("ActiveConversationID", activeConversationID);
  }, [activeConversationID]);
  useEffect(() => {
    localStorage.setItem("ConversationsData", JSON.stringify(allConversations));
  }, [allConversations]);

  const hideShowSideBar = () => {
    setShowSideBar((prev) => {
      if (rightBodyRef.current && showSideBar) {
        rightBodyRef.current.style.width = "100%";
      } else if (rightBodyRef.current && !showSideBar) {
        rightBodyRef.current.style.width = "80%";
      }

      return !showSideBar;
    });
  };

  const addNewConversation = () => {
    const newConversation = {
      id: "conver_" + crypto.randomUUID(),
      title: "New Conversation",
      createdAt: Date.now(),
      isActive: true,
    };

    setConversationId((prev) => [
      ...prev.map((conversation) => ({
        ...conversation,
        isActive: false,
      })),
      newConversation,
    ]);
    setActiveConversationID(newConversation.id);
  };

  const onConversationchange = (id_: string) => {
    setConversationId((prev) =>
      prev.map((conversation) => ({
        ...conversation,
        isActive: conversation.id === id_,
      })),
    );
    setActiveConversationID(id_);
  };

  const deleteConversations = (id_: string) => {
    setConversationId((prev) => {
      const updatedConversations = prev.filter(
        (conversation) => conversation.id !== id_,
      );

      console.log("=-------", conversationId.length);
      if (updatedConversations.length > 0) {
        onConversationchange(
          updatedConversations[updatedConversations.length - 1].id,
        );
      } else {
        return prev;
      }

      return updatedConversations;
    });

    setAllConversations((prev) => {
      const copy = { ...prev };
      delete copy[activeConversationID];
      return copy;
    });
  };
  const onQuestionAsk = async (question: string) => {
    let newChat: Conversation = {
      role: "user",
      text: question,
      ts: Date.now(),
    };

    if (activeConversationID === undefined) {
      return;
    }
    getAiChatResponse(question, allConversations[activeConversationID])
      .then((res) => {
        let aiChat: Conversation = {
          role: "ai",
          text: res,
          ts: Date.now(),
        };

        setAllConversations((prev) => ({
          ...prev,
          [activeConversationID]: [
            ...(prev[activeConversationID] || []),
            aiChat,
          ],
        }));
      })
      .catch((error) => {
        let aiChat: Conversation = {
          role: "ai",
          text: error.message,
          ts: Date.now(),
        };

        setAllConversations((prev) => ({
          ...prev,
          [activeConversationID]: [
            ...(prev[activeConversationID] || []),
            aiChat,
          ],
        }));
      })
      .finally(() => {
        setWaitingForResponse((prev) =>
          prev.filter((item) => item !== activeConversationID),
        );
      });
    if (allConversations[activeConversationID] === undefined) {
      setAllConversations((prev) => ({
        ...prev,
        [activeConversationID]: [newChat],
      }));
    } else {
      setAllConversations((prev) => ({
        ...prev,
        [activeConversationID]: [
          ...(prev[activeConversationID] || []),
          newChat,
        ],
      }));
    }
    setWaitingForResponse((prev) => [...prev, activeConversationID]);
  };

  const [isApiKeyThere, setApiKey] = useState<boolean>(
    localStorage.getItem("API_KEY") ? true : false,
  );
  const showAddKeypopUp = () => {
    setApiKey(false);
  };
  return (
    <div className="containerTop">
      {!isApiKeyThere && <ApiKeyModal setApiKey={setApiKey} />}
      <SideBar
        showSideBar={showSideBar}
        ConversationsHeaders={conversationId}
        addNewConversation={addNewConversation}
        conversationsChange={onConversationchange}
        removeConversation={deleteConversations}
        showAddKeypopUp={showAddKeypopUp}
      />
      <RightBody
        onToggle={hideShowSideBar}
        rightBodyRef={rightBodyRef}
        activeConversationID={activeConversationID}
        conversationsData={allConversations}
        onChat={onQuestionAsk}
        waitingRes={waitingForResponse}
      />
    </div>
  );
}

export default Container;
