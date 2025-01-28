import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './payslip.css';
import { saveAs } from 'file-saver';

const Payslip = () => {
    const location = useLocation();
    const { payslipData } = location.state || {};

    if (!payslipData) {
        return <div>No payslip data available.</div>;
    }

    const generatePDF = async () => {
        const input = document.getElementById('payslip');
        const button = document.getElementById('pdf-button');
        

        try {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            const position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            const pdfBlob = pdf.output('blob');
            saveAs(pdfBlob, `payslip_${payslipData.payslipNumber}.pdf`);

           
           
        } catch (error) {
            console.error('Error generating PDF:', error);
            
        }
    };

    return (
        <div id="payslip" className="container-ps" style={{ height: '1000px' }}>
            <div className='head'>
                <h2>Payslip </h2>
                <p>No:#{payslipData.payslipNumber}</p>
            </div>
            <div className="invoice-header">
                <div>
                    <p><strong>Employee Name:</strong> {payslipData.employeeName}</p>
                    <p><strong>Employee ID:</strong> {payslipData.employeeId}</p>
                </div>
                <div>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="invoice-details">
                <p><strong>Basic Pay:</strong> {payslipData.basicPay}</p>
                <p><strong>Allowances:</strong> {payslipData.allowances}</p>
                <p><strong>Overtime:</strong> {payslipData.overtime}</p>
                <p><strong>Bonuses:</strong> {payslipData.bonuses}</p>
            </div>
            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Pay</td>
                        <td>{payslipData.basicPay}</td>
                    </tr>
                    <tr>
                        <td>Allowances</td>
                        <td>{payslipData.allowances}</td>
                    </tr>
                    <tr>
                        <td>Overtime</td>
                        <td>{payslipData.overtime}</td>
                    </tr>
                    <tr>
                        <td>Bonuses</td>
                        <td>{payslipData.bonuses}</td>
                    </tr>
                </tbody>
            </table>
            <div className="invoice-total">
                <p>Total: {parseFloat(payslipData.basicPay) + parseFloat(payslipData.allowances) + parseFloat(payslipData.overtime) + parseFloat(payslipData.bonuses)}</p>
            </div>
            <div className="invoice-footer">
                <div>
                    <p><strong>Company Name</strong></p>
                    <p>Address Line 1</p>
                    <p>Address Line 2</p>
                </div>
                <div>
                    <p><strong>Contact Information</strong></p>
                    <p>Email: {payslipData.email}</p>
                    <p>Phone:{payslipData.phoneNo} </p>
                </div>
            </div>
            <div className="btns">
                <button id="pdf-button" className="button" onClick={generatePDF}data-html2canvas-ignore >Export to PDF</button>
                <button id="word-button" className="button" onClick={() => generateWord(payslipData)}data-html2canvas-ignore>Export to Word</button>
            </div>
        </div>
    );
}

export default Payslip;
