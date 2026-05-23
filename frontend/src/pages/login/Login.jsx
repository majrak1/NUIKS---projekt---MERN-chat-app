import React from 'react'
import { useState } from 'react'
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";


const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const { loading, login } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(username, password);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-6 bg-base-200 rounded-md shadow-sm">
                <h1 className="text-2xl font-semibold mb-4">Log in</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm mb-1">
                            <span>Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder='Enter username'
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            <span>Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder='Enter password'
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>


                    <div>
                        <button className='btn btn-block btn-sm mt-2' disabled={loading}>
                            {loading ? <span className='loading loading-spinner '></span> : "Login"}
                        </button>
                    </div>

                    <Link to='/signup' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
                        {"Don't"} have an account?
                    </Link>


                    {/* <div className="flex items-center justify-between">
                        <button className="btn btn-neutral">Sign in</button>
                        <a className="text-sm text-base-content/70">Forgot?</a>
                    </div> */}
                </form>
            </div>
        </div>
    )
}

export default Login