import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Product_b.module.css";

export default function Product_b({ order }) {
    const [product, setProduct] = useState(null);

    const statusMap = {
        'pending': 'В ожидании',
        'confirmed': 'Подтвержден',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };
 
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                
                const res = await axios.get(`/api/products/get_products_by_id?pr_id=${order.product_id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Не удалось загрузить данные о товаре:", err);
            }
        };

        if (order.product_id) {
            fetchProductDetails();
        }
    }, [order.product_id]);

    const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите безвозвратно удалить этот заказ?")) return;

    try {
        const userData = JSON.parse(sessionStorage.getItem("user"));
        const accessToken = userData?.access_token;

       
        await axios.delete(`/api/orders/delete/${order.id}`, {
            headers: { 
                "Authorization": `Bearer ${accessToken}` 
            }
        });

        alert("Заказ удален из истории"); 
        window.location.reload(); 
    } catch (err) {
        console.error("Ошибка при удалении:", err);
        alert(err.response?.data?.detail || "Ошибка при удалении заказа");
    }
};

    return (
        <div className={styles.product}>
            <div className={styles.orderHeader}>
                <span className={styles.orderId}>Заказ №{order.id}</span>
                <span className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}>
                    {statusMap[order.status?.toLowerCase()] }
                </span>
            </div>

            <div className={styles.content}>
                {/* Если данные о товаре загружены, показываем картинку и название */}
                {product && (
                    <div className={styles.productBrief}>
                        <img src={`${process.env.REACT_APP_URL}${product.image_url}`} alt={product.name} className={styles.productImage} />
                        <div className={styles.productMainInfo}>
                            <div className={styles.productName}>{product.name}</div>
                            <div className={styles.productCategory}>{product.category}</div>
                        </div>
                    </div>
                )}

                <div className={styles.info}>
                    <div className={styles.quantity}>Количество: <strong>{order.quantity} шт.</strong></div>
                    <div className={styles.price}>Сумма: <strong>{order.total_price} ₸</strong></div>
                    <div className={styles.address}>Адрес: {order.delivery_address}</div>
                    <div className={styles.date}>
                        {new Date(order.created_at).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className={styles.actions}>
                
                {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button className={styles.cancelActionBtn} onClick={handleDelete}>
                        Отменить
                    </button>
                )}
            </div>
        </div>
    );
}