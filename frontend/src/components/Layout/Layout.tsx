import { Outlet } from "react-router-dom"
import cl from './index.module.css'
import { Header } from "../Header/Header"

export const Layout = () => {
    return (
        <div className={cl.Layout}>
            <Header />
            <div className={cl.Body}>
                <Outlet />
            </div>
        </div>
    )
}