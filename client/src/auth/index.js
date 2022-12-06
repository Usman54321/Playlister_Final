import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
//console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    LOGIN_OR_REGISTER_ERROR: "LOGIN_OR_REGISTER_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        loginError: "",
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    loginError: "",
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    loginError: "",
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    loginError: "",
                })
            }
            case AuthActionType.LOGIN_OR_REGISTER_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    loginError: payload,
                })
            }

            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function (firstName, lastName, email, userName, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, email, userName, password, passwordVerify);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch (e) {
            console.log(e.response.data.errorMessage);
            authReducer({
                type: AuthActionType.LOGIN_OR_REGISTER_ERROR,
                payload: e.response.data.errorMessage
            })
        }
    }

    auth.loginUser = async function (email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch (e) {
            console.log(e.response.data.errorMessage);
            authReducer({
                type: AuthActionType.LOGIN_OR_REGISTER_ERROR,
                payload: e.response.data.errorMessage
            })
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function () {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        } else if (auth.loggedIn) {
            initials = "GS";
        }

        return initials;
    }

    auth.closeErrorModal = function () {
        authReducer({
            type: AuthActionType.LOGIN_OR_REGISTER_ERROR,
            payload: ""
        })
    }

    auth.loginAsGuest = function () {
        authReducer({
            type: AuthActionType.LOGIN_USER,
            payload: { user: null }
        })
        // history.push("/community-lists");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };