import { useEffect, useState } from "react"
import constant from "../../constant"


export default function Header({setLayout}){
    // console.log("setLayout",setLayout)
    let [showMenu,setShowMenu] = useState("d-none")
    let [selectedMenu, showSelectedMenu] = useState("/");    

    const toogleMenu = () =>{
        setShowMenu(showMenu === "d-none"  ? "" :"d-none" )
        setLayout(showMenu === "d-none"  ? "" :"d-none" )
    }
    
    useEffect(() => {
        showSelectedMenu(window.location.pathname);
    },[])

    return(
        <>
            <nav>
                <div className="header">
                    <div>
                        <a href="/"><img src={constant.logo} className="logoImage" alt="easymyfile"></img></a>
                    </div>
                    <div className="headerMEnu">
                            <a href={"/image-to-pdf"} className={selectedMenu ===  "/" || selectedMenu === "/image-to-pdf" ? "activeMenu" : ""}>IMAGE TO PDF</a>
                            <a href={"/pdf-to-jpg"} className={selectedMenu === "/pdf-to-jpg" ? "activeMenu" : ""} >PDF TO JPEG</a>
                            <a href={"/merge-pdf"} className={selectedMenu === "/merge-pdf" ? "activeMenu" : ""}>MERGE PDF</a>
                            <a href={"/compress-image"} className={selectedMenu === "/compress-image" ? "activeMenu" : ""}>COMPRESS IMAGE</a>
                    </div>
                    <div className="headermobileMenu">
                       <img src={constant.menuImage} className="menuImage"  onClick={() => toogleMenu() }  alt="menu"></img>
                       <a href="/"><img src={constant.logo} className="logoImageMobile"alt="easymyfile"></img></a>
                    </div> 
                    <div className={`showMore  ${showMenu} ` }>
                        <div><a href={"/image-to-pdf"} className={selectedMenu === "/" || selectedMenu === "/image-to-pdf" ? "activeMenu" : ""}>IMAGE TO PDF</a></div>
                        <div><a href={"/pdf-to-jpg"} className={selectedMenu === "/pdf-to-jpg" ? "activeMenu" : ""}>PDF TO JPEG</a></div>
                        <div><a href={"/merge-pdf"} className={selectedMenu === "/merge-pdf" ? "activeMenu" : ""}>MERGE PDF</a></div>
                        <div><a href={"/compress-image"} className={selectedMenu === "/compress-image" ? "activeMenu" : ""}>COMPRESS IMAGE</a></div>
                    </div>                                      
                </div>
            </nav>
           
        </>
    )
}