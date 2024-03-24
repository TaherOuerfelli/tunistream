import { Link } from "react-router-dom"

export default function Footer(){
    return(
        <>
            <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
            <nav className="grid grid-flow-col gap-4">
                <Link to='/Home' className="link link-hover">Homepage</Link>
                <Link to='/about' className="link link-hover">About us</Link>
                <Link to='/Movie' className="link link-hover">MoviePage</Link>

            </nav>
            <nav>
                <div className="grid grid-flow-col gap-4">
                <p>Joins our Discord:</p>
                </div>
            </nav> 
            <aside>
                <p className="text-xl font-light ">TUNISTREAM.CLUB - Watch Movies | Series | Anime and Much more ...</p>
            </aside>
            </footer>
        </>
    )
};