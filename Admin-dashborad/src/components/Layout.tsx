import { Outlet } from "react-router";



const Layout = () => {
  return (
    <>

      <main style={{ minHeight: "70vh" }}>
        <Outlet />
      </main>

    </>
  );
};

export default Layout;
