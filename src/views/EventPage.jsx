import React from 'react';
import {useParams} from "react-router-dom";
import './EventPage.css';
import sprite from '../assets/sprite.svg';
import presentationIcon from '../assets/presentation-icon.svg';
import download from '../assets/download.svg';
const EventPage = () => {
    const { id } = useParams();
    console.log(id)
    return (
        <>
            <header>
                <h2>Event</h2>
                <div className="event-title" style={{ backgroundImage: `url(${sprite})` }}>
                    <h3>28 Mar 17.00</h3>
                </div>
            </header>
            <main>
                <section className="section section-event-timeline">
                    <div className="event__1 event-block ">
                        <div className="event-block__content">
                            <div className="circle circle-disabled"></div>
                            <div className="line circle-disabled"></div>
                            <div className="card-event">
                                <img src="https://images.unsplash.com/photo-1497290756760-23ac55edf36f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt=""/>
                                <div className="card-event__content">
                                    <h4 className="disabled">GeoApp</h4>
                                    <span>Jakub</span>
                                </div>
                            </div>
                        </div>
                        <button className="event-block__button">
                            i
                        </button>
                    </div>
                    <div className="event__1 event-block">
                        <div className="event-block__content">
                            <div className="circle circle-active"></div>
                            <div className="line circle-active"></div>
                            <div className="card-event">
                                <img src="https://images.unsplash.com/photo-1630094539386-280edfb5d46a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
                                <div className="card-event__content">
                                    <h4>AI Med</h4>
                                    <span>Petr</span>
                                </div>
                            </div>
                            <div className="event-status">
                                <span>Now</span>
                            </div>
                        </div>
                        <button className="event-block__button">
                            i
                        </button>
                    </div>
                    <div className="event__1 event-block">
                        <div className="event-block__content">
                    <div className="circle circle-outline"></div>
                    <div className="card-event">
                        <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
                        <div className="card-event__content">
                            <h4>Event Creator</h4>
                            <span>Kevin</span>
                        </div>
                    </div>
                        </div>
                        <button className="event-block__button">
                            i
                        </button>

                </div>

                </section>
                <section className="section section-materials">
                    <h2>All available materials</h2>
                    <div className="section-materials__list">
                        <div className="card">
                            <div className="card-content">
                                <img src={presentationIcon} alt=""/>
                                <h4>Presentation: GeoApp </h4>
                            </div>
                            <div className="card-buttons">
                                <button className="card-buttons__download">
                                    <img src={download} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                            <img src={presentationIcon} alt=""/>
                            <h4>Presentation: AI Med </h4>
                            </div>
                            <div className="card-buttons">
                                <button className="card-buttons__download">
                                    <img src={download} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                            <img src={presentationIcon} alt=""/>
                            <h4>Presentation: Event Creator </h4>
                            </div>
                            <div className="card-buttons">
                                <button className="card-buttons__download">
                                    <img src={download} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    );
};

export default EventPage;