import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminOrders.module.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const userData = JSON.parse(sessionStorage.getItem("user"));

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/orders/all_orders", {
        headers: { Authorization: `Bearer ${userData.access_token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Ошибка при загрузке заказов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.access_token) {
      fetchOrders();
    }
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8000/orders/update/${orderId}`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${userData.access_token}` } }
      );
      // Локально обновляем статус в стейте, чтобы не перегружать весь список
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert("Не удалось обновить статус");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Удалить заказ №" + orderId + "?")) return;
    
    try {
      await axios.delete(`/api/orders/delete/${orderId}`, {
        headers: { Authorization: `Bearer ${userData.access_token}` }
      });
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      alert("Ошибка при удалении");
    }
  };

  // Функция для красивого вывода даты
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) return <div className={styles.loader}>Загрузка данных...</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Управление заказами</h2>
        <span className={styles.count}>Всего: {orders.length}</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>User ID</th>
              <th>Product ID</th>
              <th>Кол-во</th>
              <th>Сумма</th>
              <th>Адрес доставки</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><strong>#{order.id}</strong></td>
                <td>{formatDate(order.created_at)}</td>
                <td>{order.user_id}</td>
                <td>{order.product_id}</td>
                <td>{order.quantity} шт.</td>
                <td className={styles.price}>{order.total_price.toLocaleString()} ₸</td>
                <td>{order.delivery_address}</td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className={`${styles.statusSelect} ${styles[order.status]}`}
                  >
                    <option value="pending">Ожидание</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td>
                  <button 
                    className={styles.deleteBtn} 
                    onClick={() => handleDelete(order.id)}
                    title="Удалить заказ"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}