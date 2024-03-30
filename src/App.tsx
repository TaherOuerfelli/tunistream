
import Root from "./Root"
import Homepage from "./pages/Homepage"
import About from "./pages/AboutUs"

import MoviePage from "./pages/MoviePage"
import SeriesPage from "./pages/SeriesPage";

import NotFoundPage from "./pages/NotFoundPage";
import Watch from "./pages/Watch";

import { Route, RouterProvider , createBrowserRouter , createRoutesFromElements} from 'react-router-dom';
import ProgressBar from "./components/ProgressBar";
import Settings from "./pages/Settings";



const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route path="/" element={ <Root/> }>
      
      <Route path="Home" element={<Homepage/>} />
      <Route path="about" element={<About/>} />
      <Route path="Settings" element={<Settings/>} />
      <Route path="Movie/:movieID" element={<MoviePage/>} />
      <Route path="Series/:seriesID" element={<SeriesPage/>} />

      <Route path="Progress" element={<ProgressBar value={0} bufferValue={0} onProgressChange={()=>{}} onBufferChange={()=>{}}/>} />
      <Route path="Watch/Movie/:movieID" element={<Watch/>} />
      <Route path="*" element={<NotFoundPage/>} />
    </Route>

  )
);

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
