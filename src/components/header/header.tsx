import Link from "next/link";
import React from "react";
import AuthButtons from "./auth-buttons";

function Header() {
  return (
    <header className="fixed z-50 top-0 w-full border-b-1  bg-main-background/60 backdrop-blur-sm ">
      <div className="flex w-full  justify-between rounded-xl items-center p-4   md:py-4 md:px-14">
        {/* logo */}

        <Link href="/">
          <div className="flex gap-4 items-center">
            <svg
              width={24}
              height={25}
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1_303)">
                <g clipPath="url(#clip1_1_303)">
                  <path
                    d="M17.5077 1.77031C18.2108 0.964062 19.228 0.5 20.2968 0.5C22.3405 0.5 23.9999 2.15937 23.9999 4.20312C23.9999 5.27187 23.5358 6.29375 22.7296 6.99687L13.0171 15.4531L12.5343 14.9703L9.53428 11.9703L9.04678 11.4828L17.5077 1.77031ZM7.98271 12.5422L8.47021 13.0297L11.4702 16.0297L11.9577 16.5172L11.0577 20.4266C10.8749 21.2281 10.2655 21.8656 9.47334 22.0859L1.14365 24.4203L5.61553 19.9484C5.7374 19.9812 5.86865 20 6.00459 20C6.83428 20 7.50459 19.3297 7.50459 18.5C7.50459 17.6703 6.83428 17 6.00459 17C5.1749 17 4.50459 17.6703 4.50459 18.5C4.50459 18.6359 4.52334 18.7625 4.55615 18.8891L0.0795898 23.3562L2.41396 15.0312C2.63428 14.2391 3.27178 13.6297 4.07334 13.4469L7.98271 12.5469V12.5422Z"
                    fill="#262626"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_1_303">
                  <rect
                    width={24}
                    height={24}
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
                <clipPath id="clip1_1_303">
                  <path d="M0 0.5H24V24.5H0V0.5Z" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p className="font-mono text-lg">MiniBlog</p>
          </div>
        </Link>

        {/* navigation */}
        <nav className="text-sm  shrink-0">
          <ul className="flex items-center gap-4   ">
            {/* Search Input */}
            <AuthButtons />
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
