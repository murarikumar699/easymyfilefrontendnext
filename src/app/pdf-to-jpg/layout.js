'use client'
import { useState } from "react";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "../globals.css";
import Header from '../layout/header';
import PdfToJpg from "./page";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children, pageProps }) {   
  let [showMenu,setShowMenu] = useState("d-none")
  return (
        <html lang="en">
            <body className={inter.className}  >
                <Header  setLayout={setShowMenu}/>
                <PdfToJpg setLayout={showMenu} />
            </body>
        </html>
       
  );
}
