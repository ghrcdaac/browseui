import React from 'react'
import { useState } from 'react';
import { Backdrop } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config";
import { isImage } from "../../lib/isImage";
import TextFileViewer from "./fileViewer/TextFileViewer";
import ImageViewer from "./fileViewer/ImageViewer";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import PdfViewer from "./fileViewer/PdfViewer";
import MiscDocsViewer from "./fileViewer/MiscDocsViewer";

import './../../styles/fileviewer.css'

const FileViewer = ({ open, setOpen, urls, addFile, filePath, setProgress, img }) => {

  const [showArrowLeft, setShowArrowLeft] = useState(true);
  const [showArrowRight, setShowArrowRight] = useState(true);

  const rowData  = useSelector((state)=>state.rowData.value);
  console.log("open", open)
  console.log('rowdataredux', rowData)

  const checkFormat = isImage(img) === "jpeg" || isImage(img) === "png" || isImage(img) === "gif"
  const checkPdf = isImage(img) === "pdf"
  const checkText = isImage(img) === "text"

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

  const fileUrl = `${config.cloudWatchUrlBase}${img}`;

  const isExist = (targetItem) => {
    if (targetItem)
      return urls.some(
        (item) => item.Key === targetItem.Key && item.Size === targetItem.Size
      );
  };

  const handleNavigationClick = () => {

  }

  const handleClose = () => {

  }


  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
        {open && <ViewerComponent
          handleNavigationClick={handleNavigationClick}
          addFile={addFile}
          isExist={isExist}
          handleClose={handleClose}
          fileUrl={fileUrl}
          urls={urls}
          rowData={rowData}
          img={img}
          filePath={filePath}
          setProgress={setProgress}
          showArrowRight={showArrowRight}
          showArrowLeft={showArrowLeft}
        />}
    </Backdrop>
    )
}

export default FileViewer