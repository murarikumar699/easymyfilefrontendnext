'use client'
import { useState } from "react";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "../globals.css";
import FileUpload from "./page";
import Header from "../layout/header";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout() {
  let [showMenu,setShowMenu] = useState("d-none")
  return (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ff0000" />
            <title>Compress Image Online. Compress Image Online Free and its Very Easy</title>
            <meta name="description" content="Compress all images to JPG free. Convert or extract PDF to JPG online, easily and free."/>
            <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
            <meta name="author" content="easymyfile.com"/>
            <link rel="image_src" href="http://easymyfile.com/logo.png"></link>
            <meta name="keywords" content="JPG to PDF, Merge PDF, combine PDF, extract PDF, convert PDF, PDF to JPG"/>
            <link rel="canonical" href="https://www.easymyfile.com/image-to-pdf"/>
            <meta property="og:site_name" content="easymyfile - Online tools to convert Image to PDF"/>
            <meta property="og:title" content="Convert JPG to PDF. Extract images from a PDF online free"/>
            <meta property="og:description" content="Convert all pages in a PDF to JPG or extract all images in a PDF to JPG. Convert JPG to PDF and it is easy and free to use."/>
            <meta property="og:image" content="https://www.easymyfile.com/image-to-pdf"/>
            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://www.easymyfile.com/image-to-pdf"/>
            <meta name="twitter:card" content="convert_pdf_to_jpg"/>
            <meta name="twitter:site" content="@easymyfile"/>
            <meta name="twitter:creator" content="@easymyfile"/>
            <meta name="twitter:title" content="Convert JPG to PDF. Get all images from a PDF"/>
            <meta name="twitter:description" content="Convert all pages in a PDF to JPG or extract all images in a PDF to JPG. Convert or extract PDF to JPG online, easily and free."/>    
          </head>
          <body className={inter.className}>
              <Header setLayout={setShowMenu} />
              <FileUpload setLayout={showMenu}/>
          </body>
        </html>
       
  );
}
