import { Outlet } from "react-router"
import { useEffect } from 'react'
import Navbar from "../components/Navbar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RootLayout() {
  useEffect(() => {
    document.title = 'EventVista'
  }, [])

  return (
    <div>
        <Navbar/>
        <Outlet />
        <ToastContainer/>
    </div>
  )
}

export default RootLayout