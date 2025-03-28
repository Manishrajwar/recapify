'use client';
import { useRef } from 'react';
import './printStyles.css';

export default function PrintPage({ editingNote }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWindow = window.open('', '', 'width=800,height=600');
      newWindow.document.write(`
        <html>
        <head>
          <title>Print Notes</title>
          <link rel="stylesheet" type="text/css" href="printStyles.css" />
        </head>
        <body>
          <div class='print-wrapper'>${printContent}</div>
        </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    }
  };

  return (
    <div className="container">
      <button onClick={handlePrint} className="print-button">Print Notes</button>
      <div ref={printRef} className="print-content">
        {editingNote.content?.map((data, index) => (
          <div key={index} className="note">
            <h2 className="note-title">{data.title}</h2>
            <h3 className="note-subtitle">{data.subtitle}</h3>
            {data.description.map((desc, descIndex) => (
              <p key={descIndex} className="note-description">{desc}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
