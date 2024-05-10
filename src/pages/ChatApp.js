import { Client } from "@stomp/stompjs";
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import './ChatApp.css';

const Chat = () => {
    const userInfo = useSelector(state => state.user).user.value;
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const messageListRef = useRef(null);
    const stompClient = useRef(Client);
    const {roomId} = useParams();
    const [showChatRoomList, setShowChatRoomList] = useState(false);

    useEffect(() => {
        const initChat = async () => {
            stompClient.current = new Client({
                brokerURL: 'ws://localhost:8080/ws',
            });

            stompClient.current.activate();

            stompClient.current.onConnect = () => {
                console.log(roomId + '번 방에 연결되었습니다.');
                stompClient.current.subscribe(`/sub/room/${roomId}`, message => {
                    
                    // setIsMatched(true);
                    setMessages(prevMessage => [...prevMessage, JSON.parse(message.body)]);
                });

                
                const msg = async () => { 
                    try{
                        const res = await axios.get(`http://localhost:8080/getMessages/${roomId}`);
                        setMessages(res.data);
                    } catch(error) {
                        console.log('Eeror response Data : ' , error)
                    }
                };
                msg();
            };

        }
        
        
        initChat()
        
        const disconnect = () => {
            console.log(roomId + '번 방이 종료되었습니다.');
            stompClient.current.deactivate();
            // setIsMatched(false);
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

        if (newMessage.length === 0) {
            return;
        }
        if (stompClient.current && stompClient.current.connected) {
            console.log('메시지를 보냈습니다.');
            const offset = new Date().getTimezoneOffset() * 60000;
            const today = new Date(Date.now() - offset);
            const destination = `/pub/${roomId}`;
            stompClient.current.publish({
                destination,
                body: JSON.stringify({
                    roomId: roomId,
                    userId: userInfo.userId,
                    message: newMessage,
                    senderEmail: userInfo.username,
                    sender: userInfo.name,
                    time: today
                }),
            })

        }
        setNewMessage('')
    }
    function calEqualTime(prev, cur){
        const prevTime = new Date(prev);
        const curTime = new Date(cur);

        return prevTime.getFullYear() === curTime.getFullYear() &&
        prevTime.getHours() === curTime.getHours() &&
        prevTime.getMinutes() === curTime.getMinutes()
    }
    function renderMessage(message, index){
        // console.log(message);
        const previousTime = index > 0 ? messages[index - 1].time : null;
        const currentTime = message.time;

        const sameUsername = index > 0 && message.userId === messages[index - 1].userId;
        const isEqualTime = calEqualTime(previousTime,currentTime);

        // 같은 아이디이면서 같은 시간이면 제일 마지막에 시간
        return (
        message.userId === userInfo.userId ? (
            <div className="message-mine" key={index}>
                <div className="message">
                    <div className="content">
                        {message.message}
                    </div>
                    {sameUsername && (!isEqualTime &&( 
                    
                    <div className="time">
                        {new Date(message.time).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}
                    </div>
                    ))}
                </div>
            </div>
        ) :
            <div className="message-others" key={index}>
                {!sameUsername || (!isEqualTime && (
                    <span className="username">{message.sender}</span>
                ))}
                <div className="message">
                    <div className="content">
                        {message.message}
                    </div>
                    {sameUsername && ( 
                    
                    <div className="time">
                        {new Date(message.time).toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit' })}
                    </div>
                    )}
                </div>
            </div>
        );
    }
    const toggleChatRoomList = () => {
        console.log('안녕')
        setShowChatRoomList(!showChatRoomList);
    };

    return (
        <div className="chat-app">
                <div className="chatRoom-list"></div>
            <div className="chat-window">
                <div ref={messageListRef} className="message-list">
                    {messages.map((message, index) => (
                        renderMessage(message, index)
                    ))}
                </div>
                <form onSubmit={sendMessage} className="message-form">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="message-input" placeholder="Type your message..." />
                    <button type="submit" className="send-button" >Send</button>
                </form>
            </div>
            <div className="friends-list">
                
            </div>
        </div>
    );
}


export default Chat;