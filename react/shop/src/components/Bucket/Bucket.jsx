import { useEffect, useState } from "react"
import axios from "axios"
import styles from "./Bucket.module.css"
import Product_b from "./Product_Bucket/Product_b"

export default function Bucket({ filter }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    // Достаем пользователя из сессии
    const userData = JSON.parse(sessionStorage.getItem("user"))

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userData) {
                setLoading(false)
                return
            }

            try {
                const url =  "http://localhost:8000/orders/my_orders";
                
                const res = await axios.get(url, {
                    headers: {
                        "Authorization": `Bearer ${userData.access_token}`
                    }
                });

                console.log("Заказы пользователя:", res.data)
                setOrders(res.data);
            } catch (err) {
                console.error("Ошибка при получении заказов:", err);
            } finally {
                setLoading(false)
            }
        };

        fetchOrders();
    }, []); // Запрос сработает один раз при загрузке корзины

    // Фильтрация по названию товара внутри заказа (если бэкенд присылает имя товара)
    // Либо фильтрация по адресу/статусу
    const filteredOrders = orders.filter(order => 
        order.delivery_address?.toLowerCase().includes(filter?.toLowerCase()) ||
        order.status?.toLowerCase().includes(filter?.toLowerCase())
    )

    if (loading) return <div className={styles.loader}>Загрузка ваших заказов...</div>
    
    if (!userData) return <div className={styles.error}>Войдите в систему, чтобы увидеть корзину</div>

    return (
        <div className={styles.body}>
            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                    <Product_b key={order.id} order={order} />
                ))
            ) : (
                <div className={styles.empty}>У вас пока нет активных заказов</div>
            )}
        </div>
    )
}