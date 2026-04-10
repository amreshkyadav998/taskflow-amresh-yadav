import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export function AppLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
