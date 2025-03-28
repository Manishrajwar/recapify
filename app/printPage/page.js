// 'use client';
// import { useRef } from 'react';
// import { useReactToPrint } from 'react-to-print';
// import './printStyles.css';

// export default function PrintPage({  }) {
//   const printRef = useRef(null);
//   const editingNote = JSON.parse(sessionStorage.getItem("printNotes"));

//   console.log("editingNote" ,editingNote);

//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: 'Print Notes',
//   });

//   return (
//     <div className="container">
//       <button onClick={() => {
//         setTimeout(() => handlePrint(), 100);  
//       }} className="print-button">Print Notes</button>

//       <div ref={printRef} className="print-content">
//         {editingNote?.structureNotes?.map((data, index) => (
//           <div key={index} className="note">
//             <h2 className="note-title">{data.title}</h2>
//             <h3 className="note-subtitle">{data.subtitle}</h3>
//             {data.description.map((desc, descIndex) => (
//               <p key={descIndex} className="note-description">{desc}</p>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


'use client';
import { useRef, useState, useEffect } from 'react';
import './printStyles.css';

export default function PrintPage() {
  const printRef = useRef(null);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const storedNotes = sessionStorage.getItem("printNotes");
    if (storedNotes) {
      setEditingNote(JSON.parse(storedNotes));
    }
  }, []);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Notes</title>
              <link rel="stylesheet" href="/printStyles.css" />
            </head>
            <body>
              <div>${printRef.current.innerHTML}</div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className="container">
      <button onClick={handlePrint} className="print-button">
        Print Notes
      </button>

      {editingNote && (
        <div ref={printRef} className="print-content">
          {editingNote?.structureNotes?.map((data, index) => (
            <div key={index} className="note">
              <h2 className="note-title">{data.title}</h2>
              <h3 className="note-subtitle">{data.subtitle}</h3>
              {data.description.map((desc, descIndex) => (
                <p key={descIndex} className="note-description">{desc}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}