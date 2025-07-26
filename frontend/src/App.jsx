import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Browse from './pages/Browse';
import Login from './pages/login';
import Signup from './pages/Signup';
import RecruiterHome from './pages/recruiterHome';
import RecruiterCompany from './pages/recruiterCompany';
import RecruiterJobs from './pages/recruiterJobs';

// This component wraps the layout and decides whether to show the Navbar
const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // Routes where Navbar should be hidden
  const hideNavbarRoutes = ['/', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="w-screen min-h-screen bg-black text-white">
      {!hideNavbar && <Navbar />}
      {/* Apply padding only when navbar is shown */}
      <div className={hideNavbar ? '' : 'px-8 py-6'}>
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/recruiterHome" element={<RecruiterHome />} />
          <Route path="/recruiterCompany" element={<RecruiterCompany />} />
          <Route path="/recruiterJobs" element={<RecruiterJobs />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;
