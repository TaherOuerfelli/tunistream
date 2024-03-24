export default function EmptyResults(){
    return(
        <>
        <div className='flex flex-col justify-center items-center my-32 gap-3'>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentcolor" stroke-width="1" stroke-linecap="square" stroke-linejoin="arcs"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
            <h1 className="mx-2 font-thin"> No <span className="font-bold">results</span> found!</h1>
        </div>
        </>
    )
};