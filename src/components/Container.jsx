import { React, useEffect, useContext  } from 'react';
import { NavLink, useRouteMatch } from "react-router-dom";
import RealTimeContext from "../realtime-context";
import Sidebar from "./Sidebar";
import Content from "./Content";
import NewMessage from "./NewMessage"
import { API_URL } from '../constants';

const Container = (props) => {

    let match = useRouteMatch("/conversation/:id");

    const { connect } = useContext(RealTimeContext);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvbGl2ZXIiLCJuYW1lIjoiT2xpdmVyIFdpbnRlciIsImV4cCI6MjUxNjIzOTAyMiwiaXNzIjoic3RhdGljLWZvci1kZW1vIiwiY2xpZW50X2lkIjoiV2VhdnlEZW1vIiwiZGlyIjoiY2hhdC1kZW1vLWRpciIsImVtYWlsIjoib2xpdmVyLndpbnRlckBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoib2xpdmVyIn0.VuF_YzdhzSr5-tordh0QZbLmkrkL6GYkWfMtUqdQ9FM";
    useEffect(() => {
      fetch(API_URL + '/client/sign-in', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      }).then(res => res.json())
        .then((user) => {
            console.log("CALL CONNECT")
            connect();
        });
    }, [])

    const newMessage = (event) => {
        console.log("show popup");
    };

    return (
        <div id="root-container" className={"dual" + (match ? " two" : " one")}>
            <div className="pane" id="sidebar">
                <header className="pane-header">
                    <NewMessage></NewMessage>
                    <div className="pane-title text-truncate">
                        Telerik Messenger
                    </div>
                    <div className="dropdown-menu dropdown-menu-right" x-placement="bottom-end">
                        <button type="button" className="dropdown-item" data-toggle="modal" data-target="#settings-modal">Inställningar</button>
                    </div>
                </header>
                <div className="pane-body">
                    <Sidebar></Sidebar>
                </div>
            </div>

            <main id="main" className="pane conversation">
                <header className="pane-header">                    
                    <NavLink to="/">Back</NavLink>                       
                    Conversation Header
                </header>
                <div className="pane-body">
                    <Content></Content>
                </div>
            </main>
        </div>
    )
}

export default Container;