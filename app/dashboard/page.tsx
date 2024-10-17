import { Metadata } from "next";
import Main from "../components/Main";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";

export const metadata: Metadata = {
    title: "Broodl · Dashboard",
  };
  

export default function DashboardPage() {

    const isAuthenticated = false;
    let children = <Login />;

    if(isAuthenticated)
        children = <Dashboard />;

    return (
        <Main>
            {children}
        </Main>
    )
}