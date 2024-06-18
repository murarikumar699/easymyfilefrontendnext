'use client'
import React, { useState,useCallback, useEffect, useRef } from 'react';
import {useDropzone} from 'react-dropzone'
import { Document,Page,pdfjs } from 'react-pdf'
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import constant from '../../constant'

var signatures = ["application/pdf"];


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

const PdfToJpg = ({setLayout}) => {
    let [showToogleMenu, setshowToogleMenu] = useState("d-none");
    // const showToogleMenu = useSelector((state) => state.toogleMenu.value)

    useEffect(() => {
        document.title = 'Convert PDF To JPG Online - Convert PDF To JPG Online For Free';
    }, []);

    const [preview, setPreview] = useState([]);    
    const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
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
          'application/pdf': [],
        }
      })

    const [numPages, setNumPages] = useState([]);

    function onDocumentLoadSuccess({ numPages }){
        let totalPage = numPages
        setNumPages(numPages => [...numPages,totalPage]);
    }

    const handleDelete = (index) => {
        const updatedImages = [...preview];
        updatedImages.splice(index, 1);
        setPreview(updatedImages);
    };


    const exportToImage = async() => {    
        try {
            const imagesList = [];
            const canvas = document.createElement("canvas");
            canvas.setAttribute("className", "canv");
            for (let h = 0; h < preview.length; h++) {
                const pdf = await pdfjsLib.getDocument( preview[h] ).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    var page = await pdf.getPage(i);
                    var viewport = page.getViewport({ scale: 1.5 });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    var render_context = {
                    canvasContext: canvas.getContext("2d"),
                    viewport: viewport,
                    };
                    await page.render(render_context).promise;
                    let img = canvas.toDataURL("image/png");
                    imagesList.push(img);                
                }
            }
            const zip = new JSZip();            
           
            for (let [index,value] of imagesList.entries()) {
                const blob = await (await fetch(value)).blob();
                zip.file("image"+(index+1)+".png", blob);
            }

            zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, constant.projectName+".zip");
            });
            
            } catch (error) {
            console.error('Conversion error:', error);
        }
    }

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
            const index = Array.from(new Set(set));
            document.getElementById("dragelement"+index[0]).classList.remove("dragOverClass");
            if(index.length === 1){
                set.clear();
                return false;
            } 
            [preview[index[0]], preview[index[1]]] = [preview[index[1]], preview[index[0]]]
            setPreview(preview => [...preview]);
            set.clear();           

            [numPages[index[0]], numPages[index[1]]] = [numPages[index[1]], numPages[index[0]]]
            setNumPages(numPages => [...numPages]);
            setNumPages(numPages);
            document.getElementById("dragelement"+index[1]).classList.remove("dragOverClass");
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

        const draggingDiv = useRef(null);
        const handleTouchStart = (event, index) => {
            document.getElementById("dragelement"+index).classList.add("dragOverClass");
            draggingDiv.current = index;
            event.target.style.opacity = '0.7';
        };
    
        const handleTouchMove = (event, index) => {
            const target = event.changedTouches[0];
            const dropTarget = document.elementFromPoint(target.clientX, target.clientY).parentElement.parentElement.parentElement;
            const dropIndex = parseInt(dropTarget.getAttribute('imageid'));
            if(dropIndex >= 0){
                console.log("dropIndex",dropIndex);
                document.getElementById("dragelement"+dropIndex).classList.add("dragOverClass");
            }
            
        };
    
        const handleTouchEnd = (event, index) => {            
            const target = event.changedTouches[0];            
            const dropTarget = document.elementFromPoint(target.clientX, target.clientY).parentElement.parentElement.parentElement;          
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
        <div className={setLayout === "d-none"  ? "" :"d-none" }>
            <div className='dropzone' {...getRootProps()} >
                <input {...getInputProps()}  />                
                    {
                        isDragActive &&
                        <div className='dropzoneClass'></div>
                    }
                    <>
                    {
                            <div className='selectFile'>
                            <p className='fileSelectext'>{  preview.length === 0 ? "Select PDF File" : "Add PDF File"}</p>
                            <p className='text-center mb-5 webView'>Or Drop Your File Here</p>
                        </div>
                    }
                        
                    </>
            </div> 
            {
                preview.length > 0 &&  
                <div className='pdfPreview'  onDrop={handleDrop}>
                    {
                        preview.map((pdf,i) => {
                            return(
                                <>
                                <div className='showPdf' imageId={i} key={i} id={'dragelement'+i} draggable="true" onDrop={() => drop(i)} onDragStart={()=> drag(i)} onDragOver={() => dragOver('dragelement'+i)} onDragLeave={() => dragLeave('dragelement'+i)}
                                onTouchStart={(event) => handleTouchStart(event, i)}
                                onTouchMove={(event) => handleTouchMove(event, i)}
                                onTouchEnd={(event) => handleTouchEnd(event, i)}>
                                <img src={constant.deleteImage} className='deletePdf'  onClick={() => handleDelete(i)} alt='delete' />
                                <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page pageNumber={1} />
                                </Document>
                                <p>
                                    Total Pages {numPages[i]}
                                </p>
                                </div>
                                </>
                            )
                        })
                    }                   
                </div>
            }
            {
                preview.length > 0 &&  <button className='exportButton' onClick={() => exportToImage()}>Export to JPEG</button>
            }
            </div>
        </>
    );
};

export default PdfToJpg;
