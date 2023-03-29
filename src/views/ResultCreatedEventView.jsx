import React, {useEffect, useRef, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import QRCode from "react-qr-code";
import Button from "../components/Button.jsx";

const ResultCreatedEventView = () => {
    const {id} = useParams();


    return (
        <div style={{textAlign: 'center', marginTop: "40px", paddingTop: '20px'}}>
            <QRCode id="qr-code" value={`http://localhost:5173/event/${id}`} size={256}  />
            <br />
            <h2>Or link below</h2>
            <a className="result-page__link" href={`http://localhost:5173/event/${id}`}>{`http://localhost:5173/event/${id}`}</a>
            <Link to={`http://localhost:5173/event/${id}`}>
                <Button
                    value={"Go to event"}
                    className="form-block__button"
                />
            </Link>
            <br/>
        </div>
    );
};

export default ResultCreatedEventView;