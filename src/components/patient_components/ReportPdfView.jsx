import { useEffect, useRef, useState } from 'react';

import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const ReportPdfView = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [pdfContainerWidth, setPdfContainerWidth] = useState(undefined);
  const pdfContainerRef = useRef(null);

  // Responsive detection
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
      if (pdfContainerRef.current) {
        setPdfContainerWidth(pdfContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    console.log({ numPages });
    setNumPages(numPages);
  }
  return (
    <div className="w-full h-full flex items-start justify-center overflow-auto">
      <div style={{ width: '100%' }}>
        <div className="w-full flex justify-center items-start pt-0 ">
          <div
            className="relative w-full bg-gray-900 pb-8  shadow-2xl p-0 flex flex-col items-center"
            style={{ minHeight: '80vh' }}
          >
            <div className="sticky top-0 z-10 w-full flex justify-center bg-gray-800 px-4 py-5 border-b border-gray-700 shadow-md" />
            <div
              ref={pdfContainerRef}
              className="w-full flex-1 flex justify-center items-center overflow-x-hidden overflow-y-auto py-0 md:py-4"
              style={{ maxWidth: isMobile ? '100vw' : undefined, paddingLeft: 0, paddingRight: 0 }}
            >
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page-container-${index + 1}`} className={'mb-4'}>
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      scale={isMobile ? 1 : 1.2}
                      width={isMobile && pdfContainerWidth ? pdfContainerWidth - 16 : undefined}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPdfView;
