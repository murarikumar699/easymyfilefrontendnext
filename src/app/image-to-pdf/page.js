'use client'
import React, {useCallback, useEffect, useRef} from 'react'
import {useDropzone} from 'react-dropzone'
import { useState } from 'react';
import constant from '../../constant'
var signatures = ["image/png","image/jpg","image/jpeg","image/svg"]   

export default function FileUpload(){
    const divRef = useRef(null);
    const [preview, setPreview] = useState([]);
        useEffect(() => {
            document.title = 'Convert IMAGE to PDF. Convert JPEG file to PDF';
        }, []);
        const onDrop = useCallback((acceptedFiles) => {
          acceptedFiles.forEach((file,i) => {
            console.log("ff",file)
            if(signatures.includes(file.type)){
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(preview => [...preview,reader.result] );
                }
                reader.readAsDataURL(file);
            }            
            
          })
        }, [])
        const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
            accept: {
              'image/jpeg': [],
              'image/jpg': [],
              'image/png': []
            }
          })
        // console.log("preview",preview)

        const exportToPDF = async() => {
            let blob = await fetch(constant.url+"/makePdf", {
                        method: "POST",
                        mode: "cors",
                        headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            image:preview
                        })
                    }).then(function (response) {
                    return response.blob();
                    }).catch(error => {
                        console.warn(error);
                    });                    
            var f = new FileReader();
                    f.readAsDataURL(blob);
                    f.onload = d => {
                    var uri = d.target.result;
                    var link = document.createElement('a');
                    link.download = constant.projectName+".pdf";
                    link.href = uri;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    }
        };

        const handleDrop = (event) => {
            event.preventDefault();           
            const files = event.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(preview => [...preview,reader.result] );
                };
                reader.readAsDataURL(file);
            }
           
        };
        
       

        const handleDelete = (index) => {
            const updatedImages = [...preview];
            updatedImages.splice(index, 1);
            setPreview(updatedImages);
        };

        const draggingDiv = useRef(null);

        const handleTouchStart = (event, index) => {
            document.getElementById("dragelement"+index).classList.add("dragOverClass");
            draggingDiv.current = index;
            event.target.style.opacity = '0.7';
        };
    
        const handleTouchMove = (event, index) => {
            console.log("indexxxx----->",index)
            const target = event.changedTouches[0];
            const dropTarget = document.elementFromPoint(target.clientX, target.clientY);
            const dropIndex = parseInt(dropTarget.getAttribute('imageid'));
            if(dropIndex >= 0){
                console.log("dropIndex",dropIndex);
                document.getElementById("dragelement"+dropIndex).classList.add("dragOverClass");
                
            }
            
        };

        const handleTouchEnd = (event, index) => {
            const target = event.changedTouches[0];
            const dropTarget = document.elementFromPoint(target.clientX, target.clientY);          
            const dropIndex = parseInt(dropTarget.getAttribute('imageid'));
            document.getElementById("dragelement"+index).classList.remove("dragOverClass");
            if (dropIndex !== null &&  dropIndex >= 0 && dropIndex !== undefined && dropIndex !== draggingDiv.current) {
                set.add(draggingDiv.current);
                drop(dropIndex);
            }
        
            draggingDiv.current = null;
            event.target.style.opacity = '1';
        };
                 
        let set = new Set();
        function drag(ev) {
            // console.log("size",e);
            if(set.has(ev)){
                set.clear();
            }else{
                set.add(ev);
            }
        }

        const dragOver = (ev) => {         
            document.getElementById(ev).classList.add("dragOverClass");
        }

        const dragLeave = (ev) => {           
            document.getElementById(ev).classList.remove("dragOverClass");
        }
          
        function drop(ev) {
            set.add(ev);
            // console.log("drop----",Array.from(new Set(set)));
            const index = Array.from(new Set(set));
            document.getElementById("dragelement"+index[0]).classList.remove("dragOverClass");
            if(index.length === 1){
                set.clear();
                return false;
            } 
            [preview[index[0]], preview[index[1]]] = [preview[index[1]], preview[index[0]]]
            setPreview(preview => [...preview]);
            set.clear();
            // console.log("set------>",set);
            document.getElementById("dragelement"+index[1]).classList.remove("dragOverClass");
          }
        return (
            <>
            
               <div>
                <div className='dropzone' {...getRootProps()} >
                    <input {...getInputProps()}  />                
                        {
                            isDragActive &&
                            <div className='dropzoneClass'></div>
                        }                        
                        <>
                        {
                            //  preview.length === 0 &&
                             <div className='selectFile'>                                
                                <p className='fileSelectext'>{  preview.length === 0 ? "Select Image" : "Add More Image"}</p>
                                <p className='text-center mb-5 webView'>Or Drop Your File Here</p>
                            </div>
                        }
                            
                        </>
                    
                </div> 
                <>
                {
                     preview.length > 0 &&  <div className='imagePreview' onDrop={handleDrop}>
                        {
                            preview.map((image,i) => {
                                return(
                                    <>
                                    <div className='showImage'  ref={divRef} key={i} id={'dragelement'+i}  
                                    
                                    draggable="true" onDrop={() => drop(i)} onDragStart={()=> drag(i)} onDragOver={() => dragOver('dragelement'+i)} onDragLeave={() => dragLeave('dragelement'+i)}
                                    
                                    onTouchStart={(event) => handleTouchStart(event, i)}
                                    onTouchMove={(event) => handleTouchMove(event, i)}
                                        onTouchEnd={(event) => handleTouchEnd(event, i)}
                                    >
                                        <img src={image} imageId={i} key={i} className='showImageMiddle draggable' draggable="false"  alt=''/>
                                        <img src={constant.deleteImage} className='deleteImage'   onClick={() => handleDelete(i)} alt='delete' />
                                    </div>
                                    </>
                                )
                            })
                        }                   
                    </div>
                }
                {
                     preview.length > 0 &&  <button className='exportButton'  onClick={() => exportToPDF()}>Export to PDF</button>
                }
               
                </>
                </div>
            </>
            
        )
}