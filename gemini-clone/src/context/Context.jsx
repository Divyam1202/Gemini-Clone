import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState(""); // storing the recent prompts data
  const [prevPrompts, setPrevPrompts] = useState([]); // storing the history of prompts data
  const [showResult, setShowResult] = useState(false); // displaying the result
  const [loading, setLoading] = useState(false); // for loading
  const [resultData, setResultData] = useState(""); // displaying the result on web page

  // function for typing effect
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  // arrow function for new chat creation functionality
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  const onSent = async (prompt) => {
    try {
      setResultData("");
      setLoading(true);
      setShowResult(true);
  
      let response;
      if (prompt !== undefined) {
        response = await runChat(prompt);
        setRecentPrompt(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        setRecentPrompt(input);
        response = await runChat(input);
      }
  
      if (!response) {
        console.error('Response is undefined');
        return;
      }
  
      let responseArray = response.split("**");
      if (!responseArray) {
        console.error('Response array is undefined');
        return;
      }
  
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponseWithLineBreak = newResponse.split("*").join("</br>");
      let newResponseArray = newResponseWithLineBreak.split(" ");
  
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
      setLoading(false);
      setInput("");
    } catch (error) {
      console.error('Error in onSent:', error);
    }
  };

  /* Calls onSent immediately with prompt when ContextProvider component is rendered */
  // onSent("What is node.js?");

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    setPrevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;