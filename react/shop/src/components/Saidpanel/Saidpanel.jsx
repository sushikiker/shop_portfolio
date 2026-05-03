import "./Saidpanel.css";
import { Link } from "react-router-dom";

export default function Saidpanel() {
   
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = userData?.admin === 'true';

    return (
        <div className="saidpanel">
            <Link to="/">Главная страница</Link>
            <Link to="/basket">Корзина</Link>
            <Link to="/about">О нас</Link>
            
             {userData?.admin && <Link to="/admin/products" className="admin-link">Управление продуктами</Link>}
             {userData?.admin && <Link to="/admin/orders" className="admin-link">Управление заказами</Link>}
        </div>
    );
}