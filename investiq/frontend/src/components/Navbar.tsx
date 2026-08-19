import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="nav-logo">InvestIQ</Link>
        <ul className="nav-links">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/analyze" className={({ isActive }) => isActive ? 'active' : ''}>Analyze</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
          <li>
            <NavLink to="/analyze" className="nav-cta">
              ⚡ Start Analysis
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
