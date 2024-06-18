'use client'
import React, {useCallback,useEffect,useRef} from 'react'
import {useDropzone} from 'react-dropzone'
import { useState } from 'react';
import constant from '../../constant'
var signatures = ["image/png","image/jpg","image/jpeg","image/svg"]   

export default function CompressImage(){
    const [preview, setPreview] = useState([]);

        useEffect(() => {
            document.title = 'Compress Image Online - Reduce Image Size Online For Free';
        }, []);

        const onDrop = useCallback((acceptedFiles) => {
          acceptedFiles.forEach((file,i) => {
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

        const exportToPDF = async() => {
            for (let h = 0; h < preview.length; h++) {
                await download(preview[h])
            }
        };

        const download = async(element) => {
            var img = new Image();
                img.src = element;
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0.1, 0.1);
                canvas.toBlob(function(blob){
                    var f2 = new File([blob], "image" + ".jpeg");
                    var f = new FileReader();
                        f.readAsDataURL(f2);
                        f.onload = d => {
                        var uri = d.target.result;  
                        var link = document.createElement('a');
                            link.download = constant.projectName+".jpeg";
                            link.href = uri;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);  
                        }
                    }, 'image/jpeg', 0.2);
        }
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

        let set = new Set();
        function drag(ev) {
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
        console.log("drop----",Array.from(new Set(set)));
        const index = Array.from(new Set(set));
        document.getElementById("dragelement"+index[0]).classList.remove("dragOverClass");
        if(index.length === 1){
            set.clear();
            return false;
        } 
        [preview[index[0]], preview[index[1]]] = [preview[index[1]], preview[index[0]]]
        setPreview(preview => [...preview]);
        set.clear();
        console.log("set------>",set);
        document.getElementById("dragelement"+index[1]).classList.remove("dragOverClass");
        }

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
                                    <div className='showImage' key={i} id={'dragelement'+i}  draggable="true" onDrop={() => drop(i)} onDragStart={()=> drag(i)} onDragOver={() => dragOver('dragelement'+i)} onDragLeave={() => dragLeave('dragelement'+i)}
                                    
                                    onTouchStart={(event) => handleTouchStart(event, i)}
                                    onTouchMove={(event) => handleTouchMove(event, i)}
                                    onTouchEnd={(event) => handleTouchEnd(event, i)}
                                    >
                                        <img src={image} key={i} imageId={i} className='showImageMiddle' draggable="false"  alt='' />
                                        <img src={constant.deleteImage} className='deleteImage'  onClick={() => handleDelete(i)} alt='delete' />      
                                    </div>
                                    </>
                                )
                            })
                        }                   
                    </div>
                }
                {
                     preview.length > 0 &&  <button className='exportButton'  onClick={() => exportToPDF()}>Export To JPEG</button>
                }
               
                </>
                </div>
            </>
            
        )
}