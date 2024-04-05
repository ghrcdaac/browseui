import React from 'react'
import { Backdrop } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { isImage } from "../../lib/isImage";
import TextFileViewer from "./fileViewer/TextFileViewer";
import ImageViewer from "./fileViewer/ImageViewer";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PdfViewer from "./fileViewer/PdfViewer";
import MiscDocsViewer from "./fileViewer/MiscDocsViewer";

import './../../styles/fileviewer.css'

const FileViewer = ({ open, setOpen }) => {

  const rowData  = useSelector((state)=>state.rowData.value);
  console.log('rowdataredux', rowData)

  const img = rowData ? rowData[0].Key : null
  console.log("img", img)
  const checkFormat = img && (isImage(img) === "jpeg" || isImage(img) === "png" || isImage(img) === "gif")
  const checkPdf = img && (isImage(img) === "pdf")
  const checkText = img && (isImage(img) === "text")

  let ViewerComponent;
  if (checkFormat) {
    ViewerComponent = ImageViewer;
  } else if (checkPdf) {
    ViewerComponent = PdfViewer;
  } else if (checkText) {
    ViewerComponent = TextFileViewer;
  } else {
    ViewerComponent = MiscDocsViewer;
  }

  const handleNavigationClick = () => {

  }

  const handleClose = () => {

  }

  const addFile = (row) => {
    // if (!urls.includes(row)) setUrls([...urls, row]);
    // else {
    //   const newArray = urls.filter((item) => item !== row);
    //   setUrls(newArray);
    // }
  };

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
        {/* <ViewerComponent
          handleNavigationClick={handleNavigationClick}
          addFile={addFile}
          isExist={isExist}
          handleClose={handleClose}
          fileUrl={fileUrl}
          urls={urls}
          rowData={rowData}
          img={img}
          response={response}
          filePath={filePath}
          setProgress={setProgress}
          showArrowRight={showArrowRight}
          showArrowLeft={showArrowLeft}
        /> */}
    </Backdrop>
    )
}

export default FileViewer