import React, { useState } from "react";

const Profile = () => {
  // Example user data (replace with real data or props/context)
  const [user, setUser] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    bio: "Web developer. Coffee enthusiast. Lifelong learner.",
    avatar:
      "https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(user);
    setEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(form);
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <img
          src={user.avatar}
          alt="avatar"
          style={{ width: 80, height: 80, borderRadius: "50%", marginRight: 24 }}
        />
        <div>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <p style={{ color: "#888", margin: 0 }}>{user.email}</p>
        </div>
      </div>
      {editing ? (
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 16 }}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>
              Bio:
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 60 }}
              />
            </label>
          </div>
          <div>
            <button type="submit" style={{ marginRight: 8 }}>Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>Bio:</strong>
            <p style={{ margin: "8px 0" }}>{user.bio}</p>
          </div>
          <button onClick={handleEdit}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default Profile;