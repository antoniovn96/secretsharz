import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const CURRENT_USER = { id: 'mock-student-id', name: 'Antonio', role: 'student' };
const ALLOWED_CONTACTS = [
  { id: 'admin-1', name: 'Admin Support', role: 'admin' },
  { id: 'counselor-1', name: 'Career Counselor', role: 'counselor' }
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!activeChat) return;

    const conversationId = [CURRENT_USER.id, activeChat.id].sort().join('_');
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const conversationId = [CURRENT_USER.id, activeChat.id].sort().join('_');
    
    try {
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        text: newMessage,
        senderId: CURRENT_USER.id,
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          Chat
        </button>
      ) : (
        <div
          style={{
            width: '300px',
            height: '400px',
            backgroundColor: '#1e1e1e',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            color: 'white',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#333', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px'
          }}>
            <span style={{ fontWeight: 'bold' }}>Chat</span>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Close
            </button>
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            Select a conversation...
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;