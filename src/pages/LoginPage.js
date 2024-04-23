import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [pw, setPw] = useState('')
    const navigate = useNavigate();

    
    const Login = async (e) => {
        e.preventDefault()
        const url = 'http://localhost:8080/login';
        const body = {
            id: email,
            pw: pw
        }
        try {
            const res = await axios.post(url, body);
            alert(res.data);
            
            
            navigate("/");
        } catch (e) {
            alert('error');
        }
        
    }
    
    

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={Login}>
                <label>ID</label>
                <input type="text" id="email" name="email" onChange={e => setEmail(e.target.value)} />
                <br />
                <label>PW</label>
                <input type="password" id="pw" name="pw" onChange={e => setPw(e.target.value)} />
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
    
};

export default LoginPage;
