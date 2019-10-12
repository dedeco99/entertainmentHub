import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class AppMenu extends Component {
    handleClick = (e) => {
        var i = 0;

        var a = document.getElementsByTagName("a");
        for (i = 0; i < a.length; i++) {
            a[i].classList.remove("active");
        }

        e.target.closest("a").classList.add("active");
    }

    getAppList = () => {
        const apps = [
            { id: 1, name: "Reddit", icon: "icofont-reddit icofont-2x", endpoint: "/reddit" },
            { id: 2, name: "Youtube", icon: "icofont-youtube-play icofont-2x", endpoint: "/youtube" },
            { id: 3, name: "Twitch", icon: "icofont-twitch icofont-2x", endpoint: "/twitch" },
            { id: 4, name: "TV Series", icon: "icofont-monitor icofont-2x", endpoint: "/tv" }
        ];

        return apps.map(app => {
            return (
                <li className="nav-item sliding-middle-out" data-toggle="tooltip" data-placement="right" title={app.name} onClick={this.handleClick} key={app.id}>
                    <NavLink to={app.endpoint}><i className={app.icon}></i></NavLink>
                </li>
            )
        })
    }

    componentDidMount() {
        //window.$("[data-toggle='tooltip']").tooltip();
    }

    componentDidUpdate() {
        //window.$("[data-toggle='tooltip']").tooltip();

        const activeLi = document.querySelector("li.active");
        console.log(activeLi);
    }

    render() {
        return (
            <div className="appMenu">
                <ul className="nav flex-column">
                    {this.getAppList()}
                </ul>
            </div>
        );
    }
}

export default AppMenu;
