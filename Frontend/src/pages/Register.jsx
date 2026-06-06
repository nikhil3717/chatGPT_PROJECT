import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  function handelChange(e) {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form.firstName);


    axios.post(`${API_BASE_URL}/api/auth/register`, {
      fullName:{
        firstName:form.firstName,
         lastName:form.lastName
      }, 
      email:form.email,
      password: form.password
    },{
        withCredentials:true
      })
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((error) => {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please try again.";
        alert(message);
        console.log(error);
      });
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Create account</p>
          <h1>Register</h1>
          <p>Join to start your journey.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Jane"
                value={form.firstName}
                onChange={handelChange}
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handelChange}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handelChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handelChange}
            />
          </div>
          <button className="btn" type="submit">
            Create account
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
