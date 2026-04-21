export async function streamChatReply({ prompt, onDelta }) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Chat request failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const processEvent = (payload) => {
    if (!payload.startsWith('data:')) return false;

    const raw = payload.slice(5).trim();
    if (!raw || raw === '[DONE]') return raw === '[DONE]';

    const parsed = JSON.parse(raw);
    if (parsed.type === 'text-delta') {
      onDelta(parsed.delta);
    }

    return false;
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    const events = buffer.split('\n\n');
    buffer = events.pop() || '';

    for (const event of events) {
      const shouldFinish = processEvent(event);
      if (shouldFinish) {
        return;
      }
    }

    if (done) {
      if (buffer.trim()) {
        processEvent(buffer.trim());
      }
      return;
    }
  }
}
