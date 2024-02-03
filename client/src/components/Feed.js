import { IoBookOutline } from "react-icons/io5";
import { useEffect } from 'react'
import { NavLink } from "react-router-dom";

let Feed = (props) => {

    /*use span to position image left of body
    include a book title and author
    */

    useEffect(()=>{
        console.log("Feed.js useEffect")
        props.setDisplayHeaders(true);
    }, [])

    const renderPosts = () => (
        props.list.map((data, idx) => {
            return(
                <div className="post" key={idx}>
                <p style={{margin: 0, paddingTop: 9, fontWeight: 'bold'}}>{data.username}</p>
                <p style={{margin: 0, fontSize: 14, fontStyle: "italic", paddingBottom: 10}}>{data.date}</p>
                {data.image[0]? <p style={{marginTop: 0}}>
                    <img className="postImage" src={data.image[0]} />
                    <p className="postInfo">{data.bookTitle}, {data.bookAuthor}</p>
                    {data.body}
                </p> : 
                <div>
                    <p className="postInfo">{data.bookTitle}, {data.bookAuthor}</p>
                    <p style = {{marginTop: "0px"}}>{data.body}</p>
                </div>
                }
                </div>
            )
        })
    )

    const handleSortAscending = () => {
        console.log("ascending");
        //take the list and resort it using a raw Date variable
        let newList = [...props.list];
        const sorted = newList.sort((a, b) => Date.parse(a.timeStamp) - Date.parse(b.timeStamp));
        props.setList(sorted);
    }

    const handleSortDescending = () => {
        console.log("Descending");
        //take the list and resort it using a raw Date variable
        let newList = [...props.list];
        const sorted = newList.sort((a, b) => Date.parse(b.timeStamp) - Date.parse(a.timeStamp));
        props.setList(sorted);
    }

    return(
    <>
    <div className="feedWrapper">

        <div className="bookIcon"><IoBookOutline color={"white"} size={25}/></div>

        <div className="filterSort">Sort
            <div className="filterOptions">
                <button onClick={handleSortAscending}>ascending</button>
                <button onClick={handleSortDescending} style={{marginLeft: 85}}>descending</button>
            </div>
        </div>

        {renderPosts()}

    </div>
    </>
    );
    }
    
    export default Feed
