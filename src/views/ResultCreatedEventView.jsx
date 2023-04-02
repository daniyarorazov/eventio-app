import React, {useEffect, useRef, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import QRCode from "react-qr-code";
import Button from "../components/Button.jsx";

const ResultCreatedEventView = () => {
    const {id} = useParams();
    const urlOrigin = document.location.origin;

    return (
        <div style={{textAlign: 'center', marginTop: "40px", paddingTop: '20px'}}>
            <QRCode id="qr-code" value={`${urlOrigin}/event/${id}`} size={256}  />
            <br />
            <h2>Or link below</h2>
            <a className="result-page__link" href={`${urlOrigin}/event/${id}`}>{`${urlOrigin}/event/${id}`}</a>
            <Link to={`${urlOrigin}/event/${id}`}>
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