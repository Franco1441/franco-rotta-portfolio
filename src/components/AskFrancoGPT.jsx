import { useMemo, useState } from 'react';
import { chatStarters } from '../../site-content.mjs';
import { streamChatReply } from '../lib/chatStream';

function MessageBubble({ role, children }) {
  return <div className={`chat-bubble chat-bubble--${role}`}>{children}</div>;
}

export default function AskFrancoGPT() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ask me about Franco: his experience, projects, stack, or how to contact him.',
    },
  ]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);

  const canSend = useMemo(() => draft.trim().length > 0 && !isSending, [draft, isSending]);

  const sendPrompt = async (prompt) => {
    const content = prompt.trim();
    if (!content || isSending) return;

    const userMessage = { role: 'user', content };
    let assistantIndex = -1;

    setIsSending(true);
    setDraft('');
    setMessages((current) => {
      assistantIndex = current.length + 1;
      return [...current, userMessage, { role: 'assistant', content: '' }];
    });

    try {
      await streamChatReply({
        prompt: content,
        onDelta: (delta) => {
          setMessages((current) =>
            current.map((message, index) =>
              index === assistantIndex
                ? { ...message, content: `${message.content}${delta}` }
                : message
            )
          );
        },
      });
    } catch (error) {
      setMessages((current) =>
        current.map((message, index) =>
          index === assistantIndex
            ? {
                ...message,
                content: 'The assistant is unavailable right now. Please try again in a moment.',
              }
            : message
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendPrompt(draft);
  };

  return (
    <section className="chat-panel" aria-labelledby="chat-panel-title">
      <div className="section-heading section-heading--center">
        <span className="section-heading__eyebrow">Ask FrancoGPT</span>
        <h2 id="chat-panel-title">A local guide to the portfolio</h2>
        <p>
          This assistant knows Franco&apos;s profile, featured work, stack, and contact details.
        </p>
      </div>

      <div className="chat-starters" role="list">
        {chatStarters.map((starter) => (
          <button
            key={starter}
            type="button"
            className="chip-button"
            onClick={() => sendPrompt(starter)}
          >
            {starter}
          </button>
        ))}
      </div>

      <div className="chat-window" aria-live="polite">
        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}`} role={message.role}>
            {message.content || (message.role === 'assistant' ? 'Thinking…' : '')}
          </MessageBubble>
        ))}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Ask FrancoGPT
        </label>
        <input
          id="chat-input"
          className="chat-form__input"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about projects, stack, work experience, or contact"
        />
        <button className="button button--dark" type="submit" disabled={!canSend}>
          {isSending ? 'Sending…' : 'Send'}
        </button>
      </form>
    </section>
  );
}
