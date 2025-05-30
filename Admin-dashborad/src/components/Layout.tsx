import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";


const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
