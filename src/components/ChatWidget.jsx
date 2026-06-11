import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, getDocs, where, doc } from 'firebase/firestore';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    if (!auth?.currentUser) return;
    const uid = auth.currentUser.uid;
    
    const fetchMatrix = async () => {
      try {
        // 1. Check if user is Staff/Admin
        let role = 'student';
        let userData = { id: uid, name: 'Student' };
        
        const staffSnap = await getDoc(doc(db, 'staff', uid));
        if (staffSnap.exists()) {
          role = staffSnap.data().role || 'counsellor';
          userData = { id: uid, ...staffSnap.data() };
        } else {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) userData = { id: uid, ...userSnap.data() };
        }
        
        setCurrentUserRole(role);
        setCurrentUserData(userData);
        
        // 2. Fetch Allowed Contacts based on Role
        let fetchedContacts = [];
        
        if (role === 'super_admin') {
          const allStaff = await getDocs(collection(db, 'staff'));
          const allUsers = await getDocs(collection(db, 'users'));
          fetchedContacts = [
            ...allStaff.docs.filter(d => d.id !== uid).map(d => ({ id: d.id, ...d.data(), type: 'staff' })),
            ...allUsers.docs.map(d => ({ id: d.id, ...d.data(), type: 'student' }))
          ];
        } else if (role === 'counsellor') {
          const admins = await getDocs(query(collection(db, 'staff'), where('role', '==', 'super_admin')));
          const myStudents = await getDocs(query(collection(db, 'users'), where('assignedCounsellorId', '==', uid)));
          fetchedContacts = [
            ...admins.docs.map(d => ({ id: d.id, ...d.data(), type: 'admin' })),
            ...myStudents.docs.map(d => ({ id: d.id, ...d.data(), type: 'student' }))
          ];
        } else {
          // Student view
          const admins = await getDocs(query(collection(db, 'staff'), where('role', '==', 'super_admin')));
          fetchedContacts = [...admins.docs.map(d => ({ id: d.id, ...d.data(), type: 'admin' }))];
          
          if (userData.assignedCounsellorId) {
            const counsellorSnap = await getDoc(doc(db, 'staff', userData.assignedCounsellorId));
            if (counsellorSnap.exists()) {
              fetchedContacts.push({ id: counsellorSnap.id, ...counsellorSnap.data(), type: 'counsellor' });
            }
          }
        }
        setContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching chat matrix:", error);
      }
    };
    
    fetchMatrix();
  }, [auth?.currentUser]);

  useEffect(() => {
    if (!activeChat || !auth?.currentUser) return;

    const conversationId = [auth.currentUser.uid, activeChat.id].sort().join('_');
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
    if (!newMessage.trim() || !activeChat || !auth?.currentUser) return;

    const conversationId = [auth.currentUser.uid, activeChat.id].sort().join('_');
    
    try {
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        text: newMessage,
        senderId: auth.currentUser.uid,
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
          {!activeChat ? (
            <>
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#333', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
              }}>
                <span style={{ fontWeight: 'bold' }}>Select Contact</span>
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
              <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => setActiveChat(contact)}
                    style={{
                      padding: '12px',
                      backgroundColor: '#2a2a2a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                  >
                    {contact.name} <span style={{ fontSize: '0.8em', padding: '2px 6px', background: '#444', borderRadius: '4px', marginLeft: '8px' }}>{contact.type || contact.role}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#333', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
              }}>
                <button
                  onClick={() => setActiveChat(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  Back
                </button>
                <span style={{ fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                  {activeChat.name}
                </span>
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
              <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {messages.map(msg => {
                  const isMe = msg.senderId === auth?.currentUser?.uid;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        backgroundColor: isMe ? '#007bff' : '#444',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        maxWidth: '80%',
                        wordBreak: 'break-word',
                        fontSize: '14px'
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                })}
              </div>
              <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #333' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #444',
                    backgroundColor: '#2a2a2a',
                    color: 'white',
                    outline: 'none',
                    marginRight: '8px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
