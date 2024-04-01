
import Card from '../components/Card'
import EmptyResults from '../components/EmptyResults';
import LoadingResults from '../components/LoadingResults'

interface SearchResult {
    id: number;
    type:string;
    title: string;
    releaseYear: string;
    posterUrl: string;
}
interface ResultsProps {
    results: SearchResult[];
    ISsearching:Boolean;
}
const Results: React.FC<ResultsProps> = ({ results, ISsearching }) => {
    let isEmpty: boolean = results.length === 0;
    return(
        <>
        
        <div className='flex flex-wrap justify-start gap-4 max-w-screen-lg mx-auto h-fit'>
            <div className='flex flex-start w-full gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-7 h-7 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                <h1 className='text-xl font-bold'>SEARCH RESULTS</h1>
            </div>
            <div className="divider w-full h-0 m-0"></div>
            {!ISsearching ? (results.map((result) => (
                result.posterUrl && (
                    <Card info={result}/>
                )
            ))):null}
        </div>
        {ISsearching ?( <LoadingResults />): isEmpty && (<EmptyResults />) }
        
        
        </>
    )
};
export default Results;