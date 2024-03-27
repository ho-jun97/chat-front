import React, { useState, Component } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import './ChatApp.css';
import connectMng from '../utils/connectMng.js';



const ChatApp = () => {
    const [messages, setMessage] = useState([])
    const [newMessage, setNewMessage] = useState('')


  const handleSubmit = (event) => {
    // event.preventDefault();
    // const { newMessage } = this.state;
    // if (newMessage.trim() !== '') {
    //   this.stompClient.send("/app/sendMessage", {}, JSON.stringify({ message: newMessage }));
    //   this.setState({ newMessage: '' });
    // }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    alert('Send message');
    // connectMng.onConnect = () => {

        connectMng.subscribe('/sub/room/1', message =>
            console.log(`Received: ${message.body}`)
        );
        const message = {
            // 'roomId' : 1,
            'sender': '호준',
            'senderEmail': 'test@nate.com',
            'message': '내이름은 호준'
        };
        connectMng.publish({ destination: '/pub/1', body: JSON.stringify(message) });
    // }
}

    

    return (
      <div className="chat-app">
        <div className="chat-window">
          <div className="message-list">
            {messages.map((message, index) => (
              <div className="message" key={index}>
                <span className="username">{message.username}:</span> {message.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="message-form">
            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="message-input" placeholder="Type your message..." />
            <button type="submit" className="send-button" onClick={sendMessage} >Send</button>
          </form>
        </div>
      </div>
    );
}

export default ChatApp;