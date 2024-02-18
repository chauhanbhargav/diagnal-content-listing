import React, { lazy, useCallback, useEffect, useState } from 'react';
import './App.css';

//  Lazy Imports
const Header = lazy(() => import("./Header"));
const Content = lazy(() => import("./Content"));

function App() {

    //  Local state to maintain response
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [response, setResponse] = useState(null);

    //  Get Initial content
    useEffect(() => {
        getContents();
    }, []);

    //  On scroll fire callback event to get pagination
    useEffect(() => {
        document.addEventListener("scroll", handleScroll, { passive: true });
        return () => document.removeEventListener("scroll", handleScroll);
    }, [response]);

    //  Get contents
    const getContents = async (cPage) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_API_URL}data/page${cPage || page}.json`)
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

    //  Onscroll Callback - Call only dependency change
    const handleScroll = useCallback(() => {
        onScroll()
    }, [response]);


    function onScroll() {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            const totalPageAccessible = Math.round(Number(response?.page?.['total-content-items']) / 20);
            if (page < totalPageAccessible) {
                const newPage = page + 1;
                setPage(newPage)
                getContents(newPage)
            }
        }
    }

    //  Client side search
    const handleClientSideSearch = (searchText) => {
        if (!searchText) {
            getContents(1)
        }
        if (searchText) {
            const searchData = data?.filter((item) => {
                const input = searchText.trim().toLowerCase();
                return ['name'].some(prop => item[prop].toLowerCase().includes(input));
            });
            setData(searchData);
        }
    }

    return (
        <div className="App">
            {/* Header Component wth label and search */}
            <Header
                title={response?.page?.title || "-"}
                handleSearch={(e) => handleClientSideSearch(e)}
                closeSearch={() => getContents(1)}
            />

            {/* Body content */}
            <div className='content-container'>
                {data?.map((content, i) => (
                    <Content
                        key={i}
                        index={i}
                        content={content}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
