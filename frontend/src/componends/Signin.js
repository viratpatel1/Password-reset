import React from 'react';
import { useForm } from "react-hook-form";
import { Form, Container, Nav, Button } from "react-bootstrap";
import axios from "axios";
import { useHistory, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import "./Signin.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const LocalUrl = "https://passwords-reset.herokuapp.com/"


// To Handle Signin Operation
export const Signin = () =>
{
    const { register, handleSubmit } = useForm();
    const onSubmit = handleSubmit(async (data) =>
    {
        try
        {
            const { email, password } = data;
            // console.log(email, password)
            await axios.post(`${LocalUrl}`, { email, password })
                .then((res) => toast(res.data.message))
                .catch((error) => toast(error.response.data.message))
        } catch (error)
        {
            toast(error.response.data.message)
            console.log(error.message)
        }
    });

    // const Click = () => { toast("Working") }

    return (
        <>

            <div className="box">
                <h2>Login</h2>
                <Form onSubmit={onSubmit} >
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control {...register("email")} name="email" type="text" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control {...register("password")} name="password" type="password" placeholder="Password" />
                    </Form.Group>
                    <Link to={"/signup"}>Create Account </Link>
                    <Link to={"/resetpassword"}> Forget Password</Link><br />
                    <br /><Button variant="primary" type="submit">
                        Login
                    </Button>
                    {/* <Button onClick={Click} variant="primary" type="submit">
                    Login
                </Button> */}
                </Form>
                <ToastContainer />
            </div>
        </>
    )
}


// To Handle Singnup Operation
export const Signup = () =>
{

    const { register, handleSubmit } = useForm();

    const onSubmit = handleSubmit(async (data) =>
    {
        try
        {
            await axios.post(`${LocalUrl}signup`, data)
                .then(res => toast(res.data.message))
                .catch((error) => toast(error.response.data.message))

            console.log("data ", data)
        } catch (error)
        {
            toast(error.response.data.message)
            console.log(error.message)
        }
    });
    return (
        <>

            <div className="box">
                <h3>Register</h3>
                <Form method="POST" onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control {...register("username")} name="username" type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control {...register("email")} name="email" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control {...register("password")} name="password" type="password" placeholder="Password" />
                    </Form.Group>
                    <Link to={"/"} > Allready Have an Account</Link><br /><br />
                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
                <ToastContainer />
            </div>
        </>
    )
}


// To Handle Forget Password Operation
export const ForgetPassword = () =>
{
    const { register, handleSubmit } = useForm();
    const history = useHistory();
    const onSubmit = handleSubmit(async (data) =>
    {
        try
        {
            const { email } = data;
            console.log(email);
            await axios.post(`${LocalUrl}resetpassword`, { email })
                .then((res) => toast(res.data.message))
                .catch((error) => toast(error.response.data.message));
            // history.push("/")
        } catch (error)
        {
            toast(error.response.data.message);
            console.log(error.message);
        }
    });

    return (
        <>

            <div className="box">
                <h2>Forget Password</h2>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control {...register("email")} name="email" type="email" placeholder="Email for Reset Link" />
                    </Form.Group>
                </Form>
                <Link to={"/"} >Login</Link><br />
                <Button onClick={onSubmit} variant="primary" type="submit">
                    Submit
                </Button><br />
                <ToastContainer />
            </div>
        </>
    )
}


// To Handle Create New Password
export const ResetPassword = () =>
{
    const { register, handleSubmit } = useForm();
    const { token } = useParams();
    // const history = useHistory();
    console.log(token);
    const onSubmit = handleSubmit(async (data) =>
    {
        try
        {
            const { newPassword } = data;
            console.log(token)
            await axios.post(`${LocalUrl}newpassword`, { newPassword, token })
                .then((res) => toast(res.data.message))
                .catch((error) => toast(error.response.data.message));
            // history.push("/")

        } catch (error)
        {
            toast(error.response.data.message);
            console.log(error.message);
        }
    });

    return (
        <>

            <div className="box">
                <h2>Update Password</h2>
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control {...register("newPassword")} name="newPassword" type="text" placeholder="Enter New Password" />
                    </Form.Group>
                    <Link to={"/"} >Login</Link><br /><br />
                    <Button variant="primary" type="submit">
                        Change Password
                    </Button>
                </Form>
                <ToastContainer />
            </div>
        </>
    )
}


export default { Signin, Signup, ForgetPassword, ResetPassword }
