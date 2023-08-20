const fs = require("fs");
const PDFDocument = require("pdfkit");

const txtContent = fs.readFileSync("./corpus/hemingway.txt", "utf-8"); // Read the TXT file
const pdfDoc = new PDFDocument();

pdfDoc.pipe(fs.createWriteStream("output.pdf")); // Output PDF file

pdfDoc.text(txtContent); // Add the content to the PDF

pdfDoc.end(); // Finalize the PDF

console.log("PDF created successfully.");
