import "./Header.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Header({ set_filter }) {
    const [is_enter, set_enter] = useState(false)
    const [img, set_img] = useState(1)
    const [info, set_info] = useState("")
    
    // Получаем пользователя из сессии
    const userData = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const intervalId = setInterval(() => {
            set_img(prev => {
                if (is_enter) {
                    if (prev < 6) return prev + 1;
                    return prev
                } else {
                    if (prev > 1) return prev - 1;
                    return prev
                }
            })
        }, 80)
        return () => clearInterval(intervalId)
    }, [is_enter])

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        window.location.reload();
    }

    return (
        <div className="header-el">
            <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,400..700&display=swap" rel="stylesheet"></link>

            <div className="header-el-text">Nosochki.kz</div>
            
            <div className="search">
                <input placeholder="Поиск по каталогу" onChange={(e) => set_info(e.target.value)} />
                <button>
                    <img 
                        src={`/1e.png_1/${img}.jpg`} 
                        alt="поиск" 
                        onClick={() => set_filter(info)} 
                        onMouseEnter={() => set_enter(true)} 
                        onMouseLeave={() => set_enter(false)} 
                    />
                </button>
            </div>

            <div className="header-authorization">
    <div className="header-links">
        {userData ? (
            <>
     
                <span className="user-name">
                    Привет, {userData.firstName} {userData?.admin && " (Admin)"}
                </span>
                
            
               
                
                <button onClick={handleLogout} className="logout-btn">Выход</button>
            </>
        ) : (
            <>
                <Link to="/enter" id="enter_buttom">Вход</Link>
                <Link to="/register" id="registration_buttom">Регистрация</Link>
            </>
        )}
    </div>
</div>
        </div>
    )
}