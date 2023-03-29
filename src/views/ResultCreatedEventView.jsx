import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import QRCode from "react-qr-code";

const ResultCreatedEventView = () => {
    const {id} = useParams();
    const downloadQR = () => {
        setTimeout(() => {
            const canvas = document.getElementById('qr-code');
            const dataUrl = canvas.toDataURL('image/jpeg', 0.5);;
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = 'qr-code.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });

    };

    return (
        <div style={{textAlign: 'center', marginTop: "40px", background: '#ccc', paddingTop: '20px'}}>
            <QRCode id="qr-code" value={`http://localhost:5173/event/${id}`} size={256} />
            <br />
            <h2>Or link below</h2>
            <span>{`http://localhost:5173/event/${id}`}</span>
            <br/>
            <button onClick={downloadQR}>Download QR Code</button>
        </div>
    );
};

export default ResultCreatedEventView;