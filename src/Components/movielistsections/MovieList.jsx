import Trending from './Trending'
import Recommended from './Recommended'
import List from './List'
export default function MovieList(){

    return(
        <div className="bg-gray-900 min-h-screen ">
            <Trending />
            <Recommended />
            <List />
        </div>
    )
}