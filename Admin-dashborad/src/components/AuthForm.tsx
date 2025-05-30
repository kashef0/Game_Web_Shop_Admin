import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setAuthError,
  setAuthSuccess,
  setCredentials,
} from "../redux/slices/authSlice";
import usePost from "../hooks/usePost";
import type { RootState } from "../redux/store";
import Button from "./Button";

type AuthFormProps = {
  isLogin: boolean;
};

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  // lokal state för formulärfält
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  // hooks för navigation och redux dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // hämtar auth status från redux store
  const { status } = useSelector((state: RootState) => state.auth);

  const BASE_URL = import.meta.env.VITE_DATABASE_API_URL;

  // hook för post anrop url beroende på login eller register
   
  const {
    error: postError,
    loading,
    postData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = usePost<any>(
    isLogin
      ? `${BASE_URL}/api/auth/login-admin`
      : `${BASE_URL}/api/auth/register-admin`
  );

  // hanterar formulärskick
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // paketera data beroende på login eller register
    const requestData = {
      email,
      password,
      name: !isLogin ? name : "Unknown",
      adminSecret: !isLogin ? adminSecret : undefined,
    };

    try {
      // skicka data till servern
      const responseData = await postData(requestData);

      // om svar finns, uppdatera redux och localStorage navigera vidare
      if (responseData) {
        dispatch(
          setCredentials({
            user: {
              _id: responseData._id,
              name: responseData.name,
              email: responseData.email,
              role: responseData.role,
              profilePic: responseData.profilePic,
            },
            token: responseData.token,
          })
        );

        dispatch(setAuthSuccess());

        localStorage.setItem("token", responseData.token);
        localStorage.setItem("role", responseData.role);
        localStorage.setItem("username", responseData.name);
        localStorage.setItem("id", responseData._id);

        navigate("/Games_List");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // vid fel sätt felmeddelande i redux
      dispatch(setAuthError(postError || "Authentication failed"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mt-5"
      style={{ maxWidth: "500px" }}
    >
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {isLogin ? "Admin Login" : "Admin Register"}
          </h2>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label">Admin Secret</label>
              <input
                type="text"
                className="form-control"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
              />
            </div>
          )}

          <div className="d-grid mb-3">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              classNames="w-100"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Register"}
            </Button>
          </div>

          <div className="text-center">
            {isLogin ? (
              <span>
                Don’t have an account? <Link to="/register">Create one</Link>
              </span>
            ) : (
              <span>
                Already have an account? <Link to="/login">Login here</Link>
              </span>
            )}
          </div>

          {postError && (
            <div className="alert alert-danger text-center mt-3">
              {postError}
            </div>
          )}

          {status === "succeeded" && (
            <div className="alert alert-success text-center mt-3">
              You logged out successfully.
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default AuthForm;
