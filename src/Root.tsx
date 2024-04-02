import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"


export default function Root() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!window.location.search) {
            navigate("/Home");
        }
    },[]);
    let theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme || 'dark');
    return (
        <>
            <Analytics/>
            <main>
                <Outlet/>
            </main>
            
        </>
    )
}