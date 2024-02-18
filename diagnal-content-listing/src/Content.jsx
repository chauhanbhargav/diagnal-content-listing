import React from 'react';

const Content = ({ content, index }) => {
    return (
        <div key={`content-${index}`} className='img-content-item'>
            <img src={`${process.env.REACT_APP_BASE_API_URL}images/${content?.['poster-image']}`} alt="" />
            <p>{content.name}</p>
        </div>
    )
}

export default Content;