
interface casterProps{
    profile_path:string,
    id:string,
    name:string,
    character:string

}

interface CastProps {
    caster: casterProps;
}

const Card: React.FC<CastProps> = ({ caster }) => {
    let imglink = '';
    const AltImg = 'https://i.ibb.co/qN55V5Z/360-F-64676383-Ldbmhi-NM6-Ypzb3-FM4-PPu-FP9r-He7ri8-Ju.jpg';
    if(caster.profile_path)
    {
        imglink = `https://image.tmdb.org/t/p/w200${caster.profile_path}`;
    }else{imglink = AltImg};
    let profilePage = '';
    if(caster.id)
    {
        profilePage=`https://www.themoviedb.org/person/${caster.id}`;
    }
    return(
        <a href={profilePage} target="_blank" rel="noopener noreferrer" className="avatar flex flex-col p-1 sm:m-1 sm:py-4 sm:px-2 sm:w-full rounded-lg text-center items-center hover:bg-base-100">
            <div className="w-[5rem] sm:w-[7rem] rounded-full">
                <img src={imglink}
                alt={caster.name}
                onError={() => {imglink=AltImg}}
                />
            </div>
            <p className=" text-1xl font-bold mt-1 w-[7rem] sm:w-[9rem] ">{caster.name}</p>
            {caster.character?(<p>"{caster.character}"</p>):null}
    
        </a>

    )
};

export default Card;