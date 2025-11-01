import React from 'react'
import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {

    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });

    const { loading, signup } = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(inputs);
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-6 bg-base-200 rounded-md shadow-sm">
                <h1 className="text-2xl font-semibold mb-4">Create account</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm mb-1">
                            <span>Full Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder='Your Name'
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            value={inputs.fullName}
                            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            <span>Username</span>
                        </label>
                        <input
                            type="text"
                            placeholder='Enter username'
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
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
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            <span>Confirm password</span>
                        </label>
                        <input
                            type="password"
                            placeholder='Confirm password'
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            <span>Gender</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={inputs.gender === "male"}
                                    onChange={(e) =>
                                        setInputs({ ...inputs, gender: e.target.checked ? "male" : "" })
                                    }
                                />
                                <span>Male</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={inputs.gender === "female"}
                                    onChange={(e) =>
                                        setInputs({ ...inputs, gender: e.target.checked ? "female" : "" })
                                    }
                                />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <button className='btn btn-block btn-sm mt-2' disabled={loading}>
                            {loading ? <span className='loading loading-spinner '></span> : "Sign Up"}
                        </button>
                    </div>

                    <Link to='/login' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
                        Already have an account?
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default SignUp