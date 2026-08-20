import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportElementToPDF = async (elementRef, filename = "Relatorio_Alfa_Academy.pdf") => {
  if (!elementRef) return;
  
  try {
    window.scrollTo(0, 0); // Lock scroll to prevent cut off
    
    const canvas = await html2canvas(elementRef, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#1a1a1a'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Houve um problema ao gerar o PDF.");
  }
};
