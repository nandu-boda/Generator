// Step 1: Download the PDF
fetch('path/to/your/pdf')
  .then(response => response.blob())
  .then(blob => {
    // Step 2: Create a Blob
    const url = URL.createObjectURL(blob);

    // Step 3: Create an Anchor Element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filename.pdf'; // Set the desired file name

    // Step 4: Trigger the Download
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  })
  .catch(error => console.error('Error downloading the PDF:', error));
