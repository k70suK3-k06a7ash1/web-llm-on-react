import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Chat} from './components/Chat.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Chat />
  </StrictMode>,
)
