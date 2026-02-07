import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

import { ConvexProvider } from "convex/react";
import { convex } from "./convexClient";

if (!convex) {
    console.error("Convex client is null");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <ConvexProvider client={convex}>
                <App />
            </ConvexProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
