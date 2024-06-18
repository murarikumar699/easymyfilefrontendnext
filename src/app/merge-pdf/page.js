'use client'
import React, { useState,useCallback, useEffect, useRef } from 'react';
import {useDropzone} from 'react-dropzone'
import { Document,Page,pdfjs } from 'react-pdf'
import { PDFDocument } from 'pdf-lib';
import constant from '../../constant'
import { useSelector } from 'react-redux'
var signatures = ["application/pdf"];

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

const MergePdf = ({setLayout}) => {
    let [showToogleMenu, setshowToogleMenu] = useState("d-none");
    // const showToogleMenu = useSelector((state) => state.toogleMenu.value)

    useEffect(() => {
        document.title = 'Merge PDF Online - Combine PDF File For Free';
    }, []);

    const [preview, setPreview] = useState([]);    
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
            const mergedPdf = await PDFDocument.create();
            const pdfsToMerge = await Promise.all(
              Array.from(preview).map(async (file) => {
                return PDFDocument.load(file);
              })
            );

            for (const pdfDoc of pdfsToMerge) {
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
              }
          
              const mergedPdfFile = await mergedPdf.save();
              const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = constant.projectName+'.pdf';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

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
                                 onTouchEnd={(event) => handleTouchEnd(event, i)}
                                >
                                <Document file={pdf}  onLoadSuccess={onDocumentLoadSuccess} draggable='false'>
                                <img src={constant.deleteImage}  className='deletePdf'  onClick={() => handleDelete(i)} alt='delete' />
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
                preview.length > 0 &&  <button className='exportButton' onClick={() => exportToImage()}>Export to PDF</button>
            }
            </div>
        </>
    );
};

export default MergePdf;