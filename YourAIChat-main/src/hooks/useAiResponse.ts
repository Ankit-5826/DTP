import { useEffect, useState } from "react";
import { getAiChatResponse } from "../api/aiChatResponse";
const useAiResponse = (message: string) => {
  let apiData: string = "";
  useEffect(() => {
    const getAPiData = () => {
      getAiChatResponse("What is AI")
        .then((res) => {
          apiData = res;
        })
        .catch((error) => {
          apiData = error;
        });
    };
    getAPiData();
  }, [message]);
  return apiData;
};

export default useAiResponse;
