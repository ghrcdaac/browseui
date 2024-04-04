import React from 'react'
import { Backdrop } from "@mui/material";

const FileViewer = ({  }) => {
  return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        Hello
      </Backdrop>
    )
}

export default FileViewer