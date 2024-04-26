import { Client } from "@stomp/stompjs";
// import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ChatApp.css';

const Chat = () => {
    const userInfo = useSelector(state => state.user).user.value;
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [roomId, setRoomId] = useState('')
    const [isMatched, setIsMatched] = useState(false);
    const [sender, setSender] = useState('');
    const [email, setEmail] = useState('');
    const messageListRef = useRef(null);
    const stompClient = useRef(Client);
    const [firstMsg, setFirstMsg] = useState(true);

    useEffect(() => {
        const initChat = async () => {
            stompClient.current = new Client({
                brokerURL: 'ws://localhost:8080/ws',
            });
            stompClient.current.activate()

            stompClient.current.onConnect = () => {
                console.log('연결되었습니다.');
                stompClient.current.subscribe('/sub/room/1', message => {
                    setRoomId(1);
                    setIsMatched(true);
                    setMessages(prevMessage => [...prevMessage, JSON.parse(message.body)]);
                });
            }
        }

        initChat()

        const disconnect = () => {
            console.log('종료되었습니다.');
            stompClient.current.deactivate();
            setIsMatched(false);
        }

        return () => {
            if (stompClient.current && stompClient.current.connected) {
                disconnect();
            }
        }
    }, [roomId])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };
    const sendMessage = (e) => {
        e.preventDefault()
        setEmail(userInfo.username);
        setSender(userInfo.name);
        if (newMessage.length === 0) {
            return;
        }
            if (stompClient.current && stompClient.current.connected) {
                console.log('메시지를 보냈습니다.');

                const destination = '/pub/1';
                stompClient.current.publish({
                    destination,
                    body: JSON.stringify({
                        userId: userInfo.userId,
                        message: newMessage,
                        senderEmail: userInfo.username,
                        sender: userInfo.name,
                        time: new Date()
                    }),
                })
            }
            setNewMessage('')
    }

    return (
        <div className="chat-app">
            <div className="chat-window">
                <div ref={messageListRef} className="message-list">
                    {messages.map((message, index) => (
                        message.userId === userInfo.userId ? (
                            <div className="message-mine" key={index}>
                                {/* <span className="username">{message.sender}</span> */}

                                <div class="message">
                                    <div className="content">
                                        {message.message}
                                    </div>
                                    <div className="time">
                                        {new Date(message.time).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ) :
                            <div className="message-others" key={index}>
                                {index > 0 && message.userId !== messages[index - 1].userId && 
                                    new Date(message.time).getMinutes() === new Date(messages[index - 1].time).getMinutes() && (
                                    <span className="username">{sender}</span>
                                )}
                                <div class="message">
                                    <div className="content">
                                        {message.message}
                                    </div>
                                    <div className="time">
                                        {new Date(message.time).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}
                                    </div>
                                </div>

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