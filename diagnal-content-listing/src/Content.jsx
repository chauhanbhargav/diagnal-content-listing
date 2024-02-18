import React from 'react';

const Content = ({ content, key }) => {
    return (
        <div key={key} className='img-content-item'>
            <img src={`${process.env.REACT_APP_BASE_API_URL}images/${content?.['poster-image']}`} alt="" />
            <p>{content.name}</p>
        </div>
    )
}

export default Content;