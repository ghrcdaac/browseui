import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import React from 'react'
import { useSelector } from 'react-redux'
import { saveAs } from 'file-saver';
import config from '../../config';

const GetURLBtn = () => {
    const [open, setOpen] = React.useState(false);
    const scroll  = 'paper'
    const listOfLinks = React.useRef([]);

    const selectedList = useSelector(state => state.selectedList.value)

    const handleClickOpen = () => {
        setOpen(true);
        // setScroll(scrollType);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleDownload = () => {
        var tmp = listOfLinks.current.toString().split(",").join("\n")
        var blob = new Blob([tmp], {type: 'text/plain', endings:'native'});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(blob);
        element.download = "BrowseUI_URL_links.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      };

      const handleCopy = () => {
        var tmp = listOfLinks.current.toString().split(",").join("\n")
        navigator.clipboard.writeText(tmp)
      };
    
      const descriptionElementRef = React.useRef(null);
      React.useEffect(() => {
        if (open) {
          const { current: descriptionElement } = descriptionElementRef;
          if (descriptionElement !== null) {
            descriptionElement.focus();
          }
        }
      }, [open]);

    const handleClick = () => {
        //helps prevent download every time a row is selected
        downloader(selectedList)
        handleClickOpen()
    }

    const downloader = (linkList) => {
        var url = window.location.href;
        // var tmpUrl = url.split('#')[0]
        var urlPlain = url.split('#')[0]
        if(urlPlain.endsWith("/")) {
          urlPlain = urlPlain.slice(0,-1)
        }
        
        listOfLinks.current = [];

        linkList.forEach((path, i) =>{
            listOfLinks.current[i] = urlPlain +'#'+path['Key']
            
            
        })
        console.log(listOfLinks)
        // listOfLinks.map((link, index) =>
        // console.log(link)
        // // <li>{link}</li> 
         
        //  )
        // linkList.forEach((link) =>{
        //     fetch(`${config.cloudWatchUrlBase}${link['Key']}`)
        //         .then(res => res.blob())
        //         .then(blob => {
        //             saveAs(blob, link['Key'].split('/').pop())
        //         })
        // })
    }


  return (
    <div>
    <Button
    onClick={() => {handleClick()}}
    variant='outlined'
    sx={{ml: 3, borderRadius: 2}}>
        Get URL
    </Button>
    {/* <Button onClick={handleClickOpen()}>scroll=paper</Button> */}

    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        fullWidth={true}
        scroll= 'paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">List of URLs</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            
        {
          listOfLinks.current.map((link, index) => 
            <div> <a href ={link} target="_blank">{link}</a></div>
           
            )
          
        }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCopy}>Copy to Clipboard</Button>
        <Button onClick={handleDownload}>Download as a file</Button>
          <Button onClick={handleClose}>Close</Button>
          
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default GetURLBtn