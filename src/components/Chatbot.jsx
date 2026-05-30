import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const starterMessages = [
    {
        role: 'assistant',
        text: 'Hey Adit, I can help you explore this portfolio, the code, or the project structure.',
    },
];

// Helper to generate a valid UUID (v4) for the backend session
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(starterMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // State to hold the unique session ID required by the backend
    const [sessionId, setSessionId] = useState('');

    // Generate the session ID once when the component mounts
    useEffect(() => {
        setSessionId(generateUUID());
    }, []);

    const accentColor = '#bfae2a';
    const panelBackground = 'linear-gradient(180deg, #111111 0%, #050505 100%)';

    const containerStyle = useMemo(
        () => ({
            position: 'fixed',
            right: 24,
            bottom: 24,
            zIndex: 9999,
            fontFamily: 'Arial, sans-serif',
        }),
        [],
    );

    const panelStyle = useMemo(
        () => ({
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 2147483647,
            width: 'min(420px, 100vw)',
            height: '100vh',
            background: panelBackground,
            color: '#f5f5f5',
            boxShadow: '-24px 0 60px rgba(0, 0, 0, 0.7)',
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 240ms ease',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: `1px solid ${accentColor}33`,
        }),
        [isOpen],
    );

    const overlayStyle = useMemo(
        () => ({
            position: 'fixed',
            inset: 0,
            zIndex: 2147483646,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 240ms ease',
        }),
        [isOpen],
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isLoading) {
            return;
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            { role: 'user', text: trimmedValue },
        ]);
        setInputValue('');
        setIsOpen(true);
        setIsLoading(true);

      const API_BASE = process.env.REACT_APP_API_URL;
if (!API_BASE) {
  throw new Error('Missing REACT_APP_API_URL in Netlify');
}

        try {
            const response = await fetch(`${API_BASE}/api/chat`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: trimmedValue,
    sessionId,
                }), 
            });

            if (!response.ok) {
                // If it's a 400 error, try to parse the JSON to get the exact validation message
                let errorMessage = `HTTP error! status: ${response.status}`;
                if (response.status === 400) {
                     const errorData = await response.json();
                     errorMessage = errorData.error || errorMessage;
                     console.error("Backend Validation Error:", errorData);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            // Your backend returns the text inside 'data.answer' (based on the server code you provided)
            const botResponseText = data.answer || "I didn't understand the response from the server.";

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: 'assistant',
                    text: botResponseText,
                },
            ]);
        } catch (error) {
            console.error('Failed to fetch from backend:', error);
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: 'assistant',
                    text: `Sorry, I couldn't connect. Error: ${error.message}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Quick prompts removed — users can type their own questions.

    const chatbotUi = (
        <>
            <div style={overlayStyle} onClick={() => setIsOpen(false)} aria-hidden="true" />

            <div style={containerStyle}>
                {!isOpen && (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        style={{
                            border: `1px solid ${accentColor}`,
                            cursor: 'pointer',
                            padding: '14px 18px',
                            borderRadius: 999,
                            background: '#000000',
                            color: accentColor,
                            fontWeight: 800,
                            letterSpacing: 0.4,
                            textTransform: 'uppercase',
                            boxShadow: '0 14px 30px rgba(191, 174, 42, 0.18)',
                        }}
                    >
                        Open Chatbot
                    </button>
                )}
            </div>

            <aside style={panelStyle} aria-label="Portfolio chatbot sidebar">
                <header
                    style={{
                        padding: '20px 20px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${accentColor}22`,
                    }}
                >
                    <div>
                        <div style={{ fontSize: 13, color: accentColor, marginBottom: 6, letterSpacing: 1.4, textTransform: 'uppercase' }}>
                            Portfolio Assistant
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', fontFamily: 'sakana, cursive' }}>
                            Adit Sharma
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close chatbot"
                        style={{
                            border: `1px solid ${accentColor}44`,
                            background: 'rgba(191, 174, 42, 0.12)',
                            color: accentColor,
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: 18,
                        }}
                    >
                        ×
                    </button>
                </header>

                {/* Quick prompts removed — users can type their own questions below. */}

                <section
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '0 20px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    {messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            style={{
                                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '90%',
                                background: message.role === 'user' ? `linear-gradient(135deg, ${accentColor} 0%, #f0df7a 100%)` : 'rgba(255, 255, 255, 0.06)',
                                color: message.role === 'user' ? '#111111' : '#f2f2f2',
                                borderRadius: 18,
                                padding: '12px 14px',
                                lineHeight: 1.5,
                                border: message.role === 'user' ? `1px solid ${accentColor}55` : '1px solid rgba(255, 255, 255, 0.08)',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {message.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div style={{ alignSelf: 'flex-start', color: '#a0a0a0', fontSize: 13, padding: '0 14px' }}>
                            AditAI is typing...
                        </div>
                    )}
                </section>

                <form
                    id="chatbot-form"
                    onSubmit={handleSubmit}
                    style={{
                        padding: 20,
                        borderTop: `1px solid ${accentColor}22`,
                        display: 'flex',
                        gap: 10,
                    }}
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        placeholder="Ask about this portfolio..."
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            borderRadius: 14,
                            border: `1px solid ${accentColor}33`,
                            background: 'rgba(255, 255, 255, 0.04)',
                            color: '#ffffff',
                            padding: '14px 16px',
                            outline: 'none',
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            border: 'none',
                            borderRadius: 14,
                            background: accentColor,
                            color: '#111111',
                            fontWeight: 800,
                            padding: '0 18px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        Send
                    </button>
                </form>
            </aside>
        </>
    );

    return typeof document !== 'undefined' ? createPortal(chatbotUi, document.body) : chatbotUi;
}

export default Chatbot;