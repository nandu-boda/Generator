import React, { useState } from 'react';
import './viewPayslip.css';
const ViewPayslips = () => {
    const [payslipNumber, setPayslipNumber] = useState('');
    const [payslipUrl, setPayslipUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!payslipNumber.trim()) {
            setError("Please enter a valid payslip number.");
            return;
        }

        setLoading(true);
        setError('');
        setPayslipUrl('');

        try {
            const response = await fetch(`http://localhost:5000/viewPayslip?payslipNumber=${payslipNumber}`);

            if (!response.ok) {
                throw new Error('Payslip not found');
            }

            const result = await response.json();
            setPayslipUrl(result.filePath);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h2>Search Payslip</h2>
            <input
                type="text"
                placeholder="Enter Payslip Number"
                value={payslipNumber}
                onChange={(e) => setPayslipNumber(e.target.value)}
            />
            <button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>

            {error && <p className="error">{error}</p>}

            {payslipUrl && (
                <div className="payslip-result">
                    <p>Payslip found:</p>
                    <a href={payslipUrl} target="_blank" rel="noopener noreferrer">
                        View Payslip
                    </a>
                </div>
            )}
        </div>
    );
};

export default ViewPayslips;
