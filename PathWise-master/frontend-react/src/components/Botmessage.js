// src/components/BotMessage.js
import React from "react";
import ReactMarkdown from "react-markdown";

function BotMessage({ content }) {
  return (
    <div className="message bot-message">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default BotMessage;