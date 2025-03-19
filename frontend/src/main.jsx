import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import Detection from './pages/detection/Detection'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detection" element={<Detection />} />
            </Routes>
        </Router>
    </StrictMode>
)