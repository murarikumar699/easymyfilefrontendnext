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
          <head>
            <meta charset="utf-8" />
            <link rel="icon" href="%PUBLIC_URL%/icon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ff0000" />
            <title>Convert IMAGE to PDF. Convert images to PDF</title>
            <meta name="description" content="Convert all pages in a PDF to JPG or extract all images in a PDF to JPG. Convert or extract PDF to JPG online, easily and free."/>
            <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
            <link rel="image_src" href="http://easymyfile.com/logo.png"></link>
            <meta name="author" content="easymyfile.com"/>
            <meta name="keywords" content="Merge PDF, combine PDF, extract PDF, convert PDF, PDF to JPG, JPG to PDF"/>
            <link rel="canonical" href="https://www.easymyfile.com/pdf-to-jpg"/>
            <meta property="og:site_name" content="easymyfile - Online tools for PDF"/>
            <meta property="og:title" content="Convert PDF to JPG. Extract images from a PDF"/>
            <meta property="og:description" content="Convert all pages in a PDF to JPG or extract all images in a PDF to JPG. Convert PDF to JPG and it is easy and free to use."/>
            <meta property="og:image" content="https://www.easymyfile.com/pdf-to-jpg"/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://www.easymyfile.com/pdf-to-jpg"/>
            <meta name="twitter:card" content="convert_pdf_to_jped"/>
            <meta name="twitter:site" content="@easymyfile"/>
            <meta name="twitter:creator" content="@easymyfile"/>
            <meta name="twitter:title" content="Convert PDF to JPG. Extract images from a PDF"/>
            <meta name="twitter:description" content="Convert all pages in a PDF to JPG or extract all images in a PDF to JPG. Convert or extract PDF to JPG online, easily and free."/>    
          </head>
          <body className={inter.className}  >
              <Header  setLayout={setShowMenu}/>
              <PdfToJpg setLayout={showMenu} />
          </body>
        </html>
       
  );
}
