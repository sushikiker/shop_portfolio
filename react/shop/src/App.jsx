import Body from "./components/Body/Body"
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import Registration from "./components/registration/Registration"
import Saidpanel from "./components/Saidpanel/Saidpanel"
import About from "./components/about_us/About"
import Bucket from "./components/Bucket/Bucket" 
import Enter from "./components/Enter/Enter"
import AdminPanel from "./components/Admin_Panel/AdminPanel"
import AdminOrders from "./components/Admin_Panel/AdminOrders"
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route  } from "react-router-dom"
import { useState } from "react"




export default function App(){

    const [filter,set_filter] = useState("")
    return (
        <div className="all"> 
        <BrowserRouter>
        <Header set_filter={set_filter}/>
        <div className="bodiAndSidepanel">
        <Saidpanel />
        <Routes>
            <Route path="/" element={<Body filter = {filter} />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/enter" element={<Enter />}/>
            <Route path="/register" element={<Registration />}/>
            <Route path="/basket" element={<Bucket filter = {filter} />}/>
            <Route path="/admin/products" element={<AdminPanel />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
        </div>
        <Footer />
        </BrowserRouter>
        </div>
    )
}