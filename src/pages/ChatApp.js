import { Client } from "@stomp/stompjs";
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import './ChatApp.css';

const Chat = () => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [sender, setSender] = useState('')
    const [roomId, setRoomId] = useState('')
    const [senderEmail, setSenderEmail] = useState('')
    // const [stompClient, setStompClient] = useState();
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            setRoomId('1')
            const stomp = new Client({
                brokerURL: 'ws://localhost:8080/ws',

            });
            setStompClient(stomp)

            stomp.activate()

            stomp.onConnect = () => {
                stomp.subscribe('/sub/room/1', message => {
                    setMessages(prevMessage => [...prevMessage, JSON.parse(message.body)]);
                });
            }
        }

        initChat()

        return () => {
            if (stompClient && stompClient.connected) {
              stompClient.deactivate()
            }
          }
    }, [roomId])
    const sendMessage = (e) => {
        e.preventDefault()

        if (stompClient && stompClient.connected) {
            const destination = '/pub/1';

            setSender('호준')
            setSenderEmail('test@nate.com')
            stompClient.publish({
                destination,
                body: JSON.stringify({
                    message: newMessage,
                    senderEmail: senderEmail,
                    sender: sender,
                }),
            })
        }
        setNewMessage('')
    }

    return (
        <div className="chat-app">
            <div className="chat-window">
                <div className="message-list">
                    {messages.map((message, index) => (
                        <div className="message" key={index}>
                            <span className="username">{message.sender}:</span> {message.message}
                        </div>
                    ))}
                </div>
                <form onSubmit={sendMessage} className="message-form">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="message-input" placeholder="Type your message..." />
                    <button type="submit" className="send-button" >Send</button>
                </form>
            </div>
        </div>
    );
}


export default Chat;