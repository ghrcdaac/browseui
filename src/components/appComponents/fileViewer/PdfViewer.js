import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import config from "../../../config";
import printJS from "print-js";
import FileDownloader, {
  downloadFile,
  useProgress,
} from "../../universal/FileDownloader";
import NavigationButton from "./NavigationButton";
import { BiFullscreen, BiExitFullscreen, BiZoomIn, BiZoomOut } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const toolbarButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#f1f1f1",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 8px",
  borderRadius: "4px",
  transition: "background-color 0.2s",
};

const PdfViewer = ({
  handleNavigationClick,
  img,
  fileUrl,
  addFile,
  isExist,
  setProgress,
  handleClose,
  filePath,
  urls,
  rowData,
  showArrowRight,
  showArrowLeft,
}) => {
  const documentUrl = fileUrl || `${config.cloudWatchUrlBase}${img}`;

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const pageRefs = useRef({});
  const visibilityMap = useRef(new Map());
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    pageRefs.current = {};
    visibilityMap.current.clear();
    setPageNumber(1);
    setPageInput("1");
    setNumPages(null);
  }, [documentUrl]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen?.().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
      }
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput("1");
  };

  const scrollToPage = (pageNum) => {
    const targetPage = Math.max(1, Math.min(pageNum, numPages || 1));
    setPageNumber(targetPage);
    setPageInput(String(targetPage));
    const targetEl = pageRefs.current[targetPage];
    if (targetEl) {
      isProgrammaticScrollRef.current = true;
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 600);
    }
  };

  // IntersectionObserver to sync pageNumber and pageInput during continuous scroll
  useEffect(() => {
    if (!numPages || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const page = Number(entry.target.getAttribute("data-page-number"));
          if (entry.isIntersecting) {
            visibilityMap.current.set(page, entry.intersectionRatio);
          } else {
            visibilityMap.current.delete(page);
          }
        });

        if (isProgrammaticScrollRef.current) return;

        if (visibilityMap.current.size > 0) {
          let bestPage = 1;
          let highestRatio = -1;
          visibilityMap.current.forEach((ratio, page) => {
            if (ratio > highestRatio) {
              highestRatio = ratio;
              bestPage = page;
            }
          });
          setPageNumber(bestPage);
          setPageInput(String(bestPage));
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: [0.1, 0.4, 0.7],
      }
    );

    const currentRefs = pageRefs.current;
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [numPages]);

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      scrollToPage(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (numPages && pageNumber < numPages) {
      scrollToPage(pageNumber + 1);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = () => {
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= (numPages || 1)) {
      scrollToPage(parsed);
    } else {
      setPageInput(String(pageNumber));
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handlePageInputSubmit();
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleZoomReset = () => {
    setScale(1.0);
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <span className={"topCenter"}>
          <h2 className="file-name">
            {" "}
            {documentUrl.split("/").pop()}
          </h2>
        </span>
        <span className={"topRight"}>
          <span className={!showArrowLeft ? "disabled-icon" : ""}>
            <NavigationButton
              onClick={() => handleNavigationClick(rowData, "left")}
              title={"prev"}
              direction="prev"
            />
          </span>
          <span className={"printIcon"}>
            <button
              className={"downPrint"}
              onClick={() =>
                printJS({
                  printable: documentUrl,
                  type: "pdf",
                })
              }
            >
              <NavigationButton
                direction="print"
                title="Print"
              />
            </button>
          </span>
          <span className={"printIcon"}>
            <button
              className={"downPrint"}
              onClick={() => downloadFile(documentUrl)}
            >
              <NavigationButton
                onClick={""}
                direction="download"
                title="Download"
              />
            </button>
          </span>
          <span className={"printIcon"}>
            <button className={"downPrint"} onClick={() => addFile(rowData)}>
              <NavigationButton
                isExist={isExist(rowData)}
                direction="check"
                title="Select"
              />
            </button>
          </span>
          <span className={"printIcon"}>
            <button
              className={
                "downPrint" + (useProgress() !== 0 ? " disabled-icon" : "")
              }
              onClick={() => FileDownloader(urls, false, setProgress, false)}
            >
              <NavigationButton
                onClick={""}
                direction="Download as zip"
                title="Download as zip"
              />
            </button>
          </span>
          <NavigationButton
            onClick={() => handleClose(rowData)}
            title={"Close"}
            direction="Close"
          />
          <span className={!showArrowRight ? "disabled-icon" : ""}>
            <NavigationButton
              onClick={() => handleNavigationClick(rowData, "right")}
              title={"next"}
              direction="next"
            />
          </span>
        </span>
      </div>

      <div
        ref={containerRef}
        style={{
          border: "1px solid rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          height: isFullscreen ? "100vh" : "80%",
          width: isFullscreen ? "100vw" : "70%",
          backgroundColor: "#525659",
          borderRadius: isFullscreen ? 0 : "4px",
          overflow: "hidden",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#323639",
            color: "#f1f1f1",
            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            padding: "6px 12px",
            fontSize: "13px",
            userSelect: "none",
          }}
        >
          {/* Fullscreen control */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={toggleFullscreen}
              style={toolbarButtonStyle}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <BiExitFullscreen size={18} />
              ) : (
                <BiFullscreen size={18} />
              )}
            </button>
          </div>

          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              style={{
                ...toolbarButtonStyle,
                opacity: scale <= 0.5 ? 0.4 : 1,
              }}
              title="Zoom Out"
            >
              <BiZoomOut size={18} />
            </button>
            <button
              onClick={handleZoomReset}
              style={{
                ...toolbarButtonStyle,
                minWidth: "50px",
                textAlign: "center",
                fontWeight: "bold",
              }}
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3.0}
              style={{
                ...toolbarButtonStyle,
                opacity: scale >= 3.0 ? 0.4 : 1,
              }}
              title="Zoom In"
            >
              <BiZoomIn size={18} />
            </button>
          </div>

          {/* Page navigation controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={handlePrevPage}
              disabled={pageNumber <= 1}
              style={{
                ...toolbarButtonStyle,
                opacity: pageNumber <= 1 ? 0.4 : 1,
              }}
              title="Previous Page"
            >
              <FaChevronLeft size={14} />
            </button>
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onKeyDown={handlePageInputKeyDown}
              onBlur={handlePageInputSubmit}
              style={{
                width: "42px",
                padding: "2px 4px",
                textAlign: "center",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "#fff",
                fontSize: "13px",
              }}
              title="Current Page"
            />
            <span style={{ color: "#aaa" }}>/ {numPages || "--"}</span>
            <button
              onClick={handleNextPage}
              disabled={!numPages || pageNumber >= numPages}
              style={{
                ...toolbarButtonStyle,
                opacity: !numPages || pageNumber >= numPages ? 0.4 : 1,
              }}
              title="Next Page"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable PDF canvas with Document & all Pages rendered vertically */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "16px",
            backgroundColor: "#525659",
            width: "100%",
          }}
        >
          <Document
            file={documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div
                style={{
                  padding: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ClipLoader color="#ffffff" size={40} />
              </div>
            }
            error={
              <div
                style={{
                  color: "#ff8080",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                Failed to load PDF document.
              </div>
            }
          >
            {numPages && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {Array.from(new Array(numPages), (_, index) => {
                  const page = index + 1;
                  return (
                    <div
                      key={`page_${page}`}
                      id={`pdf-page-${page}`}
                      ref={(el) => (pageRefs.current[page] = el)}
                      data-page-number={page}
                      style={{
                        marginBottom: index === numPages - 1 ? 0 : "20px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Page
                        pageNumber={page}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </Document>
        </div>
      </div>
    </>
  );
};

export default PdfViewer;
