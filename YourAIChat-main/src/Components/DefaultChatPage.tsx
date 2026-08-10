export default function DefaultChatPage({
  onQuestionAsk,
}: {
  onQuestionAsk?: (question: string) => void | undefined;
}) {
  return (
    <>
      <div
        className="wrap"
      >
        <div className="icon">
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1>How can I help you?</h1>
        <p className="sub">
          I'm your AI assistant. Ask me anything — code,
          <br />
          writing, analysis, or just a conversation.
        </p>
        <div className="pills">
          <button className="pill" onClick={()=>{
            onQuestionAsk && onQuestionAsk("Write a short story")
          }}>🔥 Write a short story</button>
          <button className="pill" onClick={()=>{
            onQuestionAsk && onQuestionAsk("Explain quantum computing")
          }}>💡 Explain quantum computing</button>
          <button className="pill" onClick={()=>{
            onQuestionAsk && onQuestionAsk(" Help me debug Python")
          }}>🔄 Help me debug Python</button>
          <button className="pill" onClick={()=>{
            onQuestionAsk && onQuestionAsk("Analyze this data")
          }}>📊 Analyze this data</button>
        </div>
      </div>
    </>
  );
}
