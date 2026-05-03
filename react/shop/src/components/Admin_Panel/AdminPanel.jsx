import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./AdminPanel.module.css";

export default function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        salePrice: 0,
        quantity: "",
        category: "OTHER",
        file: null,
        currentImageUrl: ""
    });
    const [showCustomCategory, setShowCustomCategory] = useState(false);

    const fileInputRef = useRef(null);

    // Получаем данные пользователя из сессии
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const isAdmin = userData?.admin;
    const accessToken = userData?.access_token;

    const fetchProducts = async () => {
        if (!isAdmin || !accessToken) return;
        try {
            const res = await axios.get("http://localhost:8000/products/get_all_products");
            setProducts(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === "CUSTOM") {
            setShowCustomCategory(true);
            setFormData({ ...formData, category: "" });
        } else {
            setShowCustomCategory(false);
            setFormData({ ...formData, category: value });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!accessToken) {
            alert("Сессия истекла. Пожалуйста, войдите снова.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', Number(formData.price));
        formDataToSend.append('discount_price', Number(formData.salePrice) || 0);
        formDataToSend.append('quantity', Number(formData.quantity) || 0);
        formDataToSend.append('category', formData.category);

        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Добавляем файл только если он выбран
        // Это предотвратит отправку строки "null" на бэкенд
        if (formData.file) {
            formDataToSend.append('image', formData.file);
            console.log('Файл добавлен в запрос:', formData.file.name);
        }

        try {
            if (isEditing) {
                if (!currentProductId) {
                    alert("Ошибка: ID товара потерян.");
                    return;
                }
                formDataToSend.append('pr_id', currentProductId);

                await axios.post(`http://localhost:8000/products/update_product_by_id`, formDataToSend, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });
                alert("Товар успешно обновлен!");
            } else {
                await axios.post("http://localhost:8000/products/add_new_product", formDataToSend, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });
                alert("Новый товар добавлен в каталог!");
            }

            resetForm();
            fetchProducts();
        } catch (err) {
            console.error("Ошибка при сохранении:", err.response?.data || err.message);
            const errorMsg = err.response?.data?.detail;
            alert(typeof errorMsg === 'string' ? errorMsg : "Ошибка валидации данных. Проверьте поля.");
        }
    };

    const handleDelete = async (productId) => {
        if (!accessToken) return;
        if (!window.confirm(`Удалить товар #${productId}?`)) return;

        try {
            // Используем Path Parameter, как мы настроили на бэкенде
            await axios.delete(`http://localhost:8000/products/delete_by_id/${productId}`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            });
            setProducts(products.filter(p => p.id !== productId));
            alert("Удалено успешно");
        } catch (err) {
            console.error("Ошибка удаления:", err.response?.data || err.message);
            alert("Не удалось удалить товар");
        }
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setCurrentProductId(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            salePrice: product.discount_price || 0, // Убедись, что поле совпадает с бэкендом
            quantity: product.quantity,
            category: product.category || "OTHER",
            file: null, // Файл сбрасываем, чтобы не отправлять его повторно без нужды
            currentImageUrl: product.pathToFile || "" 
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentProductId(null);
        setShowCustomCategory(false);
        setFormData({ 
            name: "", price: "", salePrice: 0, quantity: "",
            category: "OTHER", file: null, currentImageUrl: "" 
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className={styles.adminContainer}>
            {!isAdmin ? (
                <div className={styles.accessDenied}>
                    <h1>Доступ запрещен</h1>
                    <p>У вас нет прав администратора.</p>
                </div>
            ) : (
                <>
                    <h1 className={styles.title}>Панель управления</h1>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h2>{isEditing ? `Редактирование ID: ${currentProductId}` : "Новый товар"}</h2>
                        
                        <label>Название</label>
                        <input name="name" value={formData.name} onChange={handleChange} required />

                        <div className={styles.row}>
                            <div>
                                <label>Обычная цена (₸)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Цена со скидкой (₸)</label>
                                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div>
                                <label>Количество</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Категория</label>
                                <select 
                                    name="category_select" 
                                    value={showCustomCategory ? "CUSTOM" : formData.category} 
                                    onChange={handleCategoryChange}
                                >
                                    <option value="CLASSIC">Классические</option>
                                    <option value="SPORT">Спортивные</option>
                                    <option value="CASUAL">Повседневные</option>
                                    <option value="THERMO">Термоноски</option>
                                    <option value="FANTASY">С принтами</option>
                                    <option value="KIDS">Детские</option>
                                    <option value="CUSTOM">-- Свой вариант --</option>
                                </select>
                                {showCustomCategory && (
                                    <input 
                                        type="text"
                                        name="category"
                                        placeholder="Введите свою категорию"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={styles.customCategoryInput}
                                        required
                                    />
                                )}
                            </div>
                        </div>

                        <label>Изображение товара</label>
                        {isEditing && formData.currentImageUrl && !formData.file && (
                            <div className={styles.currentImageWrapper}>
                                <p>Текущее фото:</p>
                                <img src={formData.currentImageUrl} alt="Текущее" className={styles.previewImg} />
                            </div>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.saveBtn}>
                                {isEditing ? "Обновить" : "Создать"}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>

                    <div className={styles.productList}>
                        <h3>Текущий ассортимент</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Цена</th>
                                    <th>Склад</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.name}</td>
                                        <td className={styles.categoryTag}>{p.category}</td>
                                        <td>{p.price} ₸</td>
                                        <td>{p.quantity}</td>
                                        <td className={styles.tableActions}>
                                            <button onClick={() => handleEditClick(p)} className={styles.editBtn}>✎</button>
                                            <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}