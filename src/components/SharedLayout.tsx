
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";

const SharedLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${isHomePage ? 'pt-20' : 'container pt-24 pb-12'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default SharedLayout;
