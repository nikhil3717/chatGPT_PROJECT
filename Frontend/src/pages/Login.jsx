import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const Login = () => {

const [form, setForm] = useState({email:"", password:""})
const [submitting, setSubmitting] = useState(false);
const navigate = useNavigate()


function handelChange(e) {
  const {name, value} = e.target;

  setForm({...form, [name]:value});

}


  const handleSubmit = (e) => {
    console.log(form)
    e.preventDefault();
    setSubmitting(true)

    axios
      .post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        navigate("/")
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setSubmitting(false)
      });
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Login</h1>
          <p>Access your account to continue.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handelChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handelChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Create one</Link>
        </div>
      </div>
      <div></div>
    </section>
  );
};

export default Login;
