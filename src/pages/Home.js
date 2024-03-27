import connectMng from '../utils/connectMng.js';

const Home = () => {

    const sendMessage = (e) => {
        e.preventDefault()
        alert('Send message');
        // connectMng.onConnect = () => {

            connectMng.subscribe('/sub/room/1', message =>
                console.log(`Received: ${message.body}`)
            );
            const message = {
                // 'roomId' : 1,
                'sender': '로봇',
                'senderEmail': 'test@nate.com',
                'message': '내이름은 뭘까?'
            };
            connectMng.publish({ destination: '/pub/1', body: JSON.stringify(message) });
        // }
    }

    return (
        <div>
            <h2>홈페이지에 오신거를 환영합니다!!^^</h2>
            <button type="button" onClick={sendMessage}>보내기</button>
        </div>

    );
};

export default Home;