import React from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./components/App"
import { StoreProvider } from "./hooks"

const root = createRoot(document.getElementById("root"))
root.render(
    <StoreProvider>
        <App />
    </StoreProvider>
)
