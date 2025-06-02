import { NavLink } from "react-router";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
    <img src="/public/404.png" alt="404 error" style={{width: '600px', height: '400px'}} />
      <h1 className="text-5xl font-bold mb-4">Page not found</h1>
      <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist or has been moved.</p>
      <NavLink to="/" className="text-blue-500 hover:underline">
        Go back to homepage
      </NavLink>
    </div>
  );
};

export default NotFound;
