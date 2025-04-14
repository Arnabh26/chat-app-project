import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('/');

function Chat() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    socket.emit('join', user._id);
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const res = await axios.get(`/api/messages/${user._id}`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    setMessages(res.data);
  };

  const sendMessage = async () => {
    const res = await axios.post(
      '/api/messages/send',
      { conversationId: user._id, text: message },
      { headers: { Authorization: localStorage.getItem('token') } }
    );
    socket.emit('sendMessage', res.data);
    setMessage('');
  };

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('conversationId', user._id);
    const res = await axios.post('/api/messages/upload', formData, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    socket.emit('sendMessage', res.data);
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender?.username}: </strong>
            {msg.text && <span>{msg.text}</span>}
            {msg.fileUrl && <a href={msg.fileUrl} target="_blank" rel="noreferrer">View File</a>}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message..." />
      <button onClick={sendMessage}>Send</button>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default Chat;