import React from 'react'
import { Backdrop } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import PdfViewer2 from './fileViewer/PdfViewer2';

import './../../styles/fileviewer.css'

const FileViewer = ({ open, setOpen }) => {

  const rowDataRedux  = useSelector((state)=>state.rowData.value);
  console.log('rowdataredux', rowDataRedux)

  return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <div className="fileviewerContainer">
          <div className="icons"></div>
          <div className="bottomContainer">
            <div className="leftArrow"></div>
            <div className="mainContent">
              <PdfViewer2 />
            </div>
            <div className="rightArrow"></div>
          </div>
        </div>
      </Backdrop>
    )
}

export default FileViewer