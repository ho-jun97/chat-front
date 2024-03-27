import { Client } from '@stomp/stompjs';


const connectMng = new Client({
    brokerURL: 'ws://localhost:8080/ws',
});


export default connectMng;