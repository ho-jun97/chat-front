
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    function roomHandler(){
        navigate("/chatPage")
    }
    return (
        <div>
            <h2>홈페이지에 오신거를 환영합니다!!^^</h2>
            <button className="btn" onClick={roomHandler}>메세지방</button>
        </div>
    );
};

export default Home;