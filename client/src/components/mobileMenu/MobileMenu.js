import React from "react";
import { Link } from "react-router-dom";
import "./MobileMenu.scss";

function MobileMenu() {
  const getQueryParams = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const visitorId = queryParameters.get("visitorId");
    const interactiveNonce = queryParameters.get("interactiveNonce");
    const assetId = queryParameters.get("assetId");
    const interactivePublicKey = queryParameters.get("interactivePublicKey");
    const urlSlug = queryParameters.get("urlSlug");

    return `visitorId=${visitorId}&interactiveNonce=${interactiveNonce}&assetId=${assetId}&interactivePublicKey=${interactivePublicKey}&urlSlug=${urlSlug}`;
  };

  const nav = (
    <nav className="nav-header-mobile">
      {/* <ul className="upperMenuBar">
        <li>Admin Panel</li>
      </ul> */}
      <ul>
        <li>
          <Link to={`/?${getQueryParams()}`}>
            <div className="labelIcon">
              <span>
                <i className="fa-solid fa-house"></i>
              </span>
            </div>
            <div className="labelMenu">
              <p style={{ margin: "0px" }}>Home</p>
            </div>
          </Link>
        </li>
        <li>
          <Link to={`/settings?${getQueryParams()}`}>
            <div className="labelIcon">
              <span style={{ margin: "0px" }}>
                <i className="fa-solid fa-gear"></i>
              </span>
            </div>
            <div className="labelMenu">
              <p style={{ margin: "0px" }}>Settings</p>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );

  return <>{nav}</>;
}

export default MobileMenu;
