
import { Navigate } from 'react-router-dom';

// Redirect to the index dashboard route
const Dashboard = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Dashboard;
