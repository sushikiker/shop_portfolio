import { useState } from "react";
import axios from "axios";
// Импортируем компоненты карты
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./Product.module.css";

// Исправление бага с иконками маркеров Leaflet в React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Product({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [coords, setCoords] = useState([43.2389, 76.8897]); // Начальные координаты (Алматы)

  const userData = JSON.parse(sessionStorage.getItem("user"));

  // Внутренний компонент для обработки кликов по карте
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoords([lat, lng]);
        
        // Бесплатное геокодирование через Nominatim (превращаем клик в адрес)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.display_name) {
              setAddress(data.display_name);
            }
          })
          .catch(() => {
            setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          });
      },
    });
    return <Marker position={coords} />;
  }

  const handleOrder = async () => {
    if (!userData) {
      alert("Пожалуйста, войдите в систему");
      return;
    }
    if (!address.trim()) {
      alert("Введите адрес или выберите на карте");
      return;
    }

    // Поля остались ТЕМИ ЖЕ, что и в твоем исходном коде
    const orderData = {
      product_id: product.id,
      quantity: quantity,
      delivery_address: address 
    };

    try {
      await axios.post("/api/orders/create", orderData, {
        headers: {
          "Authorization": `Bearer ${userData.access_token}`,
          "Content-Type": "application/json"
        }
      });
      alert("Заказ оформлен!");
      setIsModalOpen(false);
      window.location.reload(); // Обновляем страницу, чтобы увидеть изменения в корзине
    } catch (error) {
      console.error(error);
      alert("Ошибка при заказе");
    }
  };

  const hasSale = product.discount_price > 0;

  return (
    <div className={styles.productCard}>
      <span className={styles.productCategory}>{product.category}</span>
      <img src={`${process.env.REACT_APP_URL}${product.image_url}`} alt={product.name} className={styles.productImage} />
      <div className={styles.productName}>{product.name}</div>
      
      <div className={styles.productPriceContainer}>
        {hasSale ? (
          <>
            <span className={`${styles.productPrice} ${styles.discount_price}`}>{product.discount_price} ₸</span>
            <span className={styles.oldPrice}>{product.price} ₸</span>
          </>
        ) : (
          <span className={styles.productPrice}>{product.price} ₸</span>
        )}
      </div>
        <div className={`${styles.productQuantity} ${product.quantity < 5 ? styles.lowStock : ""}`}>

        {product.quantity > 0 ? `В наличии: ${product.quantity} шт.` : "Нет в наличии"}

      </div>
      <div className={styles.productActions}>
        <button 
          className={styles.bucketButton} 
          onClick={() => setIsModalOpen(true)}
          disabled={product.quantity === 0}
        >
          {product.quantity > 0 ? "Купить" : "Под заказ"}
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Оформление заказа</h3>
            <p>Товар: <strong>{product.name}</strong></p>
            
            <div className={styles.inputGroup}>
              <label>Количество:</label>
              <input 
                type="number" min="1" max={product.quantity} 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Адрес доставки (кликните на карту):</label>
              <input 
                type="text" 
                placeholder="Город, улица..." 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>

            {/* Блок с картой */}
            <div className={styles.mapContainer}>
              <MapContainer 
                center={coords} 
                zoom={13} 
                style={{ height: "250px", width: "100%", borderRadius: "8px" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
              <small className={styles.hint}>Кликните на карту, чтобы выбрать точное место</small>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Отмена</button>
              <button className={styles.confirmBtn} onClick={handleOrder}>Подтвердить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}