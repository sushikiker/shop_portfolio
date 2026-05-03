import { useEffect, useState } from "react"
import styles from "./Body.module.css"
import Product from "./Product/Product"
import axios from "axios"


export default function Body({filter}){
    
const [data,set_data] = useState([])


useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get( "http://localhost:8000/products/get_all_products");
      console.log(res.data)
      set_data(res.data);
    } catch (err) {
      console.error("Ошибка запроса:", err);
    }
  };

  fetchData();
}, []);
  
 const filteredData = data.filter(e => e.name?.toLowerCase().includes(filter?.toLowerCase()) || e.category?.toLowerCase().includes(filter?.toLowerCase() ))
 
  return(<div className={styles.body}>{filteredData.map(item => <Product key = {item.id} product = {item} />)}</div>)
    
}