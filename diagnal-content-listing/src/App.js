import { lazy, useEffect, useState } from 'react';
import './App.css';

const Header = lazy(() => import("./Header"));
const Content = lazy(() => import("./Content"));

function App() {

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        getContents();
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getContents = async (currentPage) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_API_URL}data/page${currentPage || page}.json`)
            const json = await res?.json();
            if (json) {
                const allData = page > 1 ? json?.page?.['content-items']?.content : [...data, ...json?.page?.['content-items']?.content];
                setData((d) => allData);
                setResponse(json)
            }
        } catch (e) {
            console.error(e);
        }
    }

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            const totalPageAccessible = Math.round(Number(response?.page?.['total-content-items']) / 20);
            if (page < totalPageAccessible) {
                setPage(p => p + 1)
                getContents()
            }
        }
    }

    const handleClientSideSearch = (searchText) => {
        if (!searchText) {
            getContents(1)
        } else {
            const searchData = data?.filter((content) => content.name.search(searchText));
            setData(searchData);
        }
    }

    return (
        <div className="App">
            <Header title={response?.page?.title} handleSearch={handleClientSideSearch} closeSearch={() => getContents(1)} />
            <div className='content-container'>
                {data?.map((content, i) => (
                    <Content content={content} key={i} />
                ))}
            </div>
        </div>
    );
}

export default App;
