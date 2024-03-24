
import Root from "./Root"
import Homepage from "./pages/Homepage"
import About from "./pages/AboutUs"

import MoviePage from "./pages/MoviePage"
import SeriesPage from "./pages/SeriesPage";

import { Route, RouterProvider , createBrowserRouter , createRoutesFromElements} from 'react-router-dom';

import NotFoundPage from "./pages/NotFoundPage";
import Watch from "./pages/Watch";


const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route path="/" element={ <Root/> }>
      
      <Route path="about" element={<About/>} />
      <Route path="Home" element={<Homepage/>} />
      <Route path="Movie/:movieID" element={<MoviePage/>} />
      <Route path="Series/:seriesID" element={<SeriesPage/>} />

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
