import React, { useCallback, useEffect, useState } from "react";

const Header = ({ title, handleSearch, closeSearch }) => {

    const [searchClick, setSearchClick] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchDebounce = useCallback(() => {
        handleSearch(search);
    }, [search])

    useEffect(() => {
        const delayTimeOut = setTimeout(() => handleSearchDebounce(), 2000);
        return () => clearTimeout(delayTimeOut)
    }, [handleSearchDebounce])

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        handleSearch(search);
    }

    return (
        <div className="header">
            {!searchClick ? (
                <>
                    <div className="back-header">
                        <img className="icon-img" src={`${process.env.REACT_APP_BASE_API_URL}images/Back.png`} alt="back" />
                        <h3>{title}</h3>
                    </div>
                    <img className="icon-img" src={`${process.env.REACT_APP_BASE_API_URL}images/search.png`} alt="back" onClick={() => setSearchClick(true)} />
                </>
            ) : (
                <div className="back-header">
                    <img className="icon-img" src={`${process.env.REACT_APP_BASE_API_URL}images/Back.png`} alt="back" onClick={() => {
                        closeSearch();
                        setSearchClick(false)
                    }} />
                    <input type="text" value={search} onChange={handleInputChange} />
                </div>
            )}

        </div>
    )
}

export default Header;