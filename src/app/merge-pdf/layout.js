'use client'
import { useState } from "react";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "../globals.css";
import Header from '../layout/header';
import FileUpload from "./page";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
    let [showMenu,setShowMenu] = useState("d-none")
  return (
        <html lang="en">
            <body className={inter.className}  >
                <Header setLayout={setShowMenu} />
                <FileUpload setLayout={showMenu}/>
                {/* {children} */}
            </body>
        </html>
       
  );
}
