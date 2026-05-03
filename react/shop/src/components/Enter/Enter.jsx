import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Enter.module.css";

export default function Enter() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const loginData = {
            email: formData.email,
            password: formData.password
        };

        try {
            const url = "http://localhost:8000/auth/login"
            const res = await axios.post(url, loginData);

           
            sessionStorage.setItem("user", JSON.stringify(res.data));

            alert(`С возвращением, ${res.data.firstName}!`);
            
            navigate("/"); 
            window.location.reload(); 
        } catch (err) {
            console.error("Ошибка входа:", err);
            if (err.response && err.response.status === 403) {
                setErrorMessage("Неверный логин или пароль");
            } else {
                setErrorMessage("Ошибка сервера или неверные данные");
            }
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.login_container}>
                <h1 className={styles.welcome_text}>Добро пожаловать</h1>
                
                {errorMessage && (
                    <div className={styles.errorMessage} style={{ color: "red", marginBottom: "10px" }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Пароль" 
                        onChange={handleChange} 
                        required 
                    />
                    <button type="submit">Войти</button>
                </form>
            </div>
        </div>
    );
}