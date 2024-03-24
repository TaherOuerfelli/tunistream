import Footer from "./Footer";
import Header from "./Header";

export default function AboutUs(){
    return(
        <>
        <Header/>
        <div className="flex justify-center w-full my-10">
        <div className="bg-base-200 rounded-lg mx-10">
            <h1 className='flex justify-center items-start text-3xl font-bold mt-5 '>About Us:</h1>
            <div className='m-10'>
                <p>TUNISTREAM.CLUB is an aggregeration service, this site does not upload/host any of the streamed media, It is merely linking to 3rd party providers. zadifuzirfhjeqhgjqehfgjhfegjqsdfghsdjghjdfghsdjhfgspdjgfhsdjghsjdghsjdfgsdfjgh</p>
            </div>
        </div>
        </div>
        <Footer/>
        </>
    )
};