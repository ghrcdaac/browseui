import { Viewer, Worker } from "@react-pdf-viewer/core";
import config from "../../../config";
import React from "react";
import * as pdfjs from "pdfjs-dist";
import '@react-pdf-viewer/core/lib/styles/index.css';
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import printJS from "print-js";
import { isImage } from "../../../lib/isImage";
import NavigationButton from "./NavigationButton";

import { useDispatch, useSelector } from "react-redux";

const PdfViewer2 = () => {

    const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    const rowDataRedux  = useSelector((state)=>state.rowData.value);
    console.log('rowdataredux', rowDataRedux)
  
    const img = rowDataRedux ? rowDataRedux[0].Key : null

    console.log(">>>>fileUrl", `${config.cloudWatchUrlBase}${img}`)
    return (
            <Worker workerUrl={workerSrc}>
                <div
                    style={{
                    flex: 1,
                    overflow: "hidden",
                    }}
                >
                    <Viewer
                    fileUrl={`${config.cloudWatchUrlBase}${img}`}
                    plugins={[toolbarPluginInstance]}
                    defaultScale={1.25}
                    />
                </div>
            </Worker>
    )
}

export default PdfViewer2