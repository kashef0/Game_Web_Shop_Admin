import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import type { RootState } from "../redux/store";

const NavBar = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark bg-gradient px-3 ">
      <div className="container-fluid text-white">
        <Link className="navbar-brand fw-bold text-white" to="/Games_List">
          GameZone
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={
            isAuthenticated
              ? "collapse navbar-collapse"
              : "d-flex justify-content-between"
          }
          id="mainNavbar"
        >
          {isAuthenticated && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item ">
                <NavLink className="nav-link nav-link-custom" to="/Games_List">
                  Games List
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/admin/Add_games">
                  Add Games
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/admin/games/:id/edit">
                  Edit Game
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-link-custom" to="/AdminOrdersPage">
                  Admin Orders
                </NavLink>
              </li>
            </ul>
          )}

          <div className="d-flex align-items-center gap-3 position-relative">
            {/* User Dropdown */}
            {isAuthenticated && user ? (
              <div
                className="dropdown"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex gap-2 nav-link-custom ">
                  <p className="m-0">{user.email}</p>
                  <img
                    src={user.profilePic}
                    alt="avatar"
                    className="rounded-circle bg-white"
                    width={30}
                    height={30}
                  />
                </div>
                {showUserMenu && (
                  <div
                    className="dropdown-menu show position-absolute end-0 mt-2 border rounded shadow"
                    style={{ zIndex: 10 }}
                  >
                    <Link to="/profile" className="dropdown-item">
                      <FaUserCircle className="me-2" />
                      Profile
                    </Link>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="btn btn-outline-light btn-sm" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
