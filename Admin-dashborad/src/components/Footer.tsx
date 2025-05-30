import { Link } from "react-router";


const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4 mt-10 border-t">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Gamezone. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/PrivacyPolicy" className="hover:underline px-2">
            Privacy Policy
          </Link>
          <Link to="/AdminInstructions" className="hover:underline px-2">
            Admin Instructions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
