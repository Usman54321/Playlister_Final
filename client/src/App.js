import './App.css';
import { React } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import { Box } from '@mui/material'
import {
    AppBanner,
    HomeWrapper,
    LoginScreen,
    RegisterScreen,
    Statusbar,
    CommunityView,
    UserView,
    ProfileView,
} from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
/*
  This is the entry-point for our application. Notice that we
  inject our store into all the components in our application.
  
  @author McKilla Gorilla
*/
const App = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <GlobalStoreContextProvider>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                            width: "100%",
                            backgroundColor: "#f1f8e9"
                        }}
                    >
                        < AppBanner />
                        <Switch>
                            <Route path="/" exact component={HomeWrapper} />
                            <Route path="/login/" exact component={LoginScreen} />
                            <Route path="/register/" exact component={RegisterScreen} />
                            <Route path="/community-lists/" exact component={CommunityView} />
                            <Route path="/user-lists/" exact component={UserView} />
                        </Switch>
                        <Statusbar />
                    </Box>
                </GlobalStoreContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    )
}

export default App