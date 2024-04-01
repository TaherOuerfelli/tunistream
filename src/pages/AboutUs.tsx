import Footer from "./Footer";
import Header from "./Header";

export default function AboutUs(){
    return(
        <>
        <Header/>
        <div className="flex justify-center w-full my-10">
        <div className="bg-base-200 rounded-lg mx-10">
            <h1 className='flex justify-center items-start text-4xl font-bold mt-5 '>About Us:</h1>
            <div className='m-10 h-[30rem] text-xl'>
                <p>TUNISTREAM.CLUB your one-stop destination for streaming movies, series, anime, and more!<br></br>
                It's a streaming platform – it's also a community.</p>
                <p className="font-bold mt-10">- This site does not upload/host any of the streamed media.</p>
            </div>
        </div>
        </div>
        <Footer/>
        </>
    )
};