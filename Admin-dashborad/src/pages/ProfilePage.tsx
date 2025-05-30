import React, { useState, useEffect } from "react";
import usePut from "../hooks/usePut";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import type { RootState } from "../redux/store";
import type { User } from "../types/User";


const ProfilePage = () => {
  // hämtar user och token från redux store
  const { user, token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();

  // lokal state för namn lösenord och fil
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const BASE_URL = import.meta.env.VITE_DATABASE_API_URL;

  // hook för att uppdatera data via PUT
  const { updateData, loading, error } = usePut<User>(
    `${BASE_URL}/api/users/update_profile`
  );

  // sätter initialt namn från user i redux store 
  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  // hanterar filval från input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  // hanterar formulärsändning för att uppdatera profil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // skapar formData för formdata
    const formData = new FormData();
    if (name !== user?.name) formData.append("name", name);
    if (password) formData.append("password", password);
    if (file) formData.append("profilePic", file);

    try {
      // anropar updateData med formData
      const updatedUser = await updateData(formData);
      const updated = updatedUser.data;
      console.log("updatedUser> ", updated);

      // om uppdatering lyckades, uppdatera redux store med nya uppgifter
      if (updated) {
        dispatch(
          setCredentials({
            user: updated,
            token: token || "",
          })
        );
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Update Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="profilePic" className="form-label">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="profilePic"
                    onChange={handleFileChange}
                  />
                </div>

                {!user ? (
                  <button className="btn btn-primary" type="button" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </button>
                ) : (
                  user.profilePic && (
                    <div className="text-center mb-3">
                      <img
                        src={user.profilePic}
                        alt="Profile"
                        className="img-thumbnail"
                        width="200"
                      />
                    </div>
                  )
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
