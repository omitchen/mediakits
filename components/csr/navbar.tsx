import React from "react";
import { ModeToggle } from "@/components/csr/theme-toggle";
import Logo from "@/assets/img/logo.webp";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 shadow-md z-10 bg-white dark:bg-black">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Image src={Logo} alt="logo" width={100} height={100} />
          </div>
          <ul className="flex space-x-4">
            <li>
              <ModeToggle />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
