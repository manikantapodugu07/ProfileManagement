import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

//revisit these imports later — might prune unused ones

// little helper I often sketch while prototyping
function _humanHelper(x){
    // hmm, might be useful later
    let tmp = x || null;
    return tmp;
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

