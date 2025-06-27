import React, { useState, useEffect } from 'react';
import { TbMessageChatbotFilled } from "react-icons/tb";
import { marked } from 'marked';
import {io} from 'socket.io-client';
import './ChatBot.css';

const socket = io('http://localhost:5000'); // Change if hosted

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ type: 'bot', text: 'Hey Dude What i can help you?' }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const togglePopup = () => setIsOpen(!isOpen);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const msg = inputValue.trim();
      setMessages(prev => [...prev, { type: 'user', text: msg }]);
      socket.emit('user_message', msg);
      setInputValue('');
      setIsLoading(true);
    }
  };

  useEffect(() => {
    socket.on('bot reply', (reply) => {
      setMessages(prev => [...prev, { type: 'bot', text: reply }]);
      setIsLoading(false);
    });

    return () => {
      socket.on('bot reply');
    }

  }, []);

  const parseText = (text) => ({ __html: marked(text) });

  return (
    <div>
      <div className='chatBot-icon' onClick={togglePopup}>
        <TbMessageChatbotFilled />
      </div>
      {isOpen && (
        <div className='chatBot-popup'>
          <div className='chatBot-popup-header'>
            <h3>Chat bot</h3>
            <button onClick={togglePopup}>×</button>
          </div>
          <div className='chatBot-popup-body'>
            <div className='messages-container'>
              {messages.map((m, i) => (
                <div key={i} className={m.type === 'user' ? 'user-message' : 'bot-message'}>
                  <p dangerouslySetInnerHTML={parseText(m.text)} />
                </div>
              ))}
            </div>
            <div className='input-container'>
              <input
                type='text'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder='Type your message...'
                disabled={isLoading}
              />
              <button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
