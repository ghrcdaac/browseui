import React from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route,  } from "react-router-dom"
import { Provider } from 'react-redux'
import TopBar from './components/universal/TopBar';
import { CssBaseline } from '@mui/material';
import App from './App'
import store from './app/store'
import { Footer } from './components/universal/Footer';
import PageNotFound from './pages/PageNotFound';
import config from './config'

const root = createRoot(document.getElementById('root'))

root.render(
    <React.StrictMode>
        <Provider store={store}>
        <div className="app">
            <header>
                <CssBaseline />
                <TopBar />
            </header>
            <main>

            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App />} />
                    <Route path='/browseui/404' element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
            </main>
            <span style={{'text-align': 'right', 'margin-right':'30px'}}> {config.version}</span>
            <footer>
            <Footer />
            </footer>
        </div>
        </Provider>
    </React.StrictMode>,
)
