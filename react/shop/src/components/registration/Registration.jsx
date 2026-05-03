import { useState } from "react";
import axios from "axios";
import styles from "./Registration.module.css";
import { useNavigate } from "react-router-dom";

export default function Registration() {
    const [formData, setFormData] = useState({
        user_name: "",
        second_name: "",
        email: "",
        password: "",
        rep_password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");  

         
        if (formData.password !== formData.rep_password) {
            setErrorMessage("Пароли не совпадают");
            return;
        } 
        
        if (formData.password.length < 6) {
            setErrorMessage("Пароль должен быть не менее 6 символов");
            return;
        }

        
        const dataForServer = {
            email: formData.email,  
            password: formData.password,
             
            name: formData.user_name,
            second_name: formData.second_name 
        };

        try {
            
            const url =  "http://localhost:8000/auth/registration";
            
            const res = await axios.post(url, dataForServer);

            alert(`Пользователь успешно зарегистрирован!`);
            
           
            sessionStorage.setItem("user", JSON.stringify(res.data));

            navigate("/");
            window.location.reload(); 

        } catch (err) {
            console.error("Ошибка при регистрации:", err);

            if (err.response) {
              
                const status = err.response.status;
                switch (status) {
                    case 400:
                        setErrorMessage("Этот Email уже занят или данные некорректны");
                        break;
                    case 422:
                        setErrorMessage("Ошибка валидации данных");
                        break;
                    case 500:
                        setErrorMessage("Ошибка сервера. Попробуйте позже");
                        break;
                    default:
                        setErrorMessage(err.response.data?.message || `Ошибка сервера: ${status}`);
                }
            } else if (err.request) {
                setErrorMessage("Сервер не отвечает. Проверьте соединение");
            } else {
                setErrorMessage("Произошла ошибка при отправке запроса");
            }
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.login_container}>
                <h1 className={styles.welcome_text}>Регистрация</h1>
                
                {errorMessage && (
                    <div className={styles.errorMessage} style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input 
                        type="text" 
                        name="user_name" 
                        placeholder="Имя" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="second_name" 
                        placeholder="Фамилия" 
                        onChange={handleChange} 
                    />
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
                    <input 
                        type="password" 
                        name="rep_password" 
                        placeholder="Повторите пароль" 
                        onChange={handleChange} 
                        required 
                    />
                    <button type="submit" className={styles.submit_btn}>
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}