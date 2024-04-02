import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


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
            
            <main>
                <Outlet/>
            </main>
            
        </>
    )
}