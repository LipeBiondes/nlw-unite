import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom'
import Error from './pages/Error'
import { Attendees } from './pages/Attendees'

export function RoutesApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Attendees />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  )
}
