
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
    const navigate = useNavigate();
    function roomHandler(roomId){
        navigate(`/chatPage/${roomId}`);
    }
    return (
        <div>
            <h2>홈페이지에 오신거를 환영합니다!!^^</h2>
            <button className="btn" onClick={() => roomHandler(1)}>1번 메세지방</button>
            <button className="btn" onClick={() => roomHandler(2)}>2번 메세지방</button>
        </div>
    );
};

export default Home;