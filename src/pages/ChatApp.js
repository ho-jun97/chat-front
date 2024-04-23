import { Client } from "@stomp/stompjs";
// import axios from 'axios'
import React, { useRef,useState, useEffect } from 'react'
import './ChatApp.css';

const Chat = () => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [sender, setSender] = useState('')
    const [roomId, setRoomId] = useState('')
    const [senderEmail, setSenderEmail] = useState('')
    const [isMatched, setIsMatched] = useState(false);
    const stompClient = useRef(Client);

    useEffect(() => {
        const initChat = async () => {
            stompClient.current = new Client({
                brokerURL: 'ws://localhost:8080/ws',

            });
            stompClient.current.activate()

            stompClient.current.onConnect = () => {
                console.log('연결되었습니다.');
                stompClient.current.subscribe('/sub/room/1', message => {
                    // setRoomId(1);
                    setIsMatched(true);
                    setMessages(prevMessage => [...prevMessage, JSON.parse(message.body)]);
                });
            }
        }

        initChat()

        const disconnect = () =>{
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
    const sendMessage = (name, email,e) => {
        e.preventDefault()
        
        if (stompClient.current && stompClient.current.connected) {
            console.log('메시지를 보냈습니다.');
            setSender(name)
            setSenderEmail(email)

            const destination = '/pub/1';
            stompClient.current.publish({
                destination,
                body: JSON.stringify({
                    message: newMessage,
                    senderEmail: email,
                    sender: name,
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
                <form onSubmit={(e) => sendMessage('호준', 'hojun@naver.com',e)} className="message-form">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="message-input" placeholder="Type your message..." />
                    <button type="submit" className="send-button" >Send</button>
                </form>
            </div>
        </div>
    );
}


export default Chat;