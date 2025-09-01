import React, { useState } from 'react';
import { QrCode, Download, Printer, Copy, Check } from 'lucide-react';

const QRGenerator = () => {
  const [tableNumbers, setTableNumbers] = useState('1,2,3,4,5,6,7,8');
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000/menu?qr=true&table=');
  const [copied, setCopied] = useState(null);
  
  const generateTableNumbers = () => {
    return tableNumbers.split(',').map(num => num.trim()).filter(num => num);
  };

  const generateQRUrl = (tableNumber) => {
    return `${baseUrl}${tableNumber}`;
  };

  const copyToClipboard = (text, tableNumber) => {
    navigator.clipboard.writeText(text);
    setCopied(tableNumber);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadQR = (tableNumber) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(generateQRUrl(tableNumber))}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `table-${tableNumber}-qr.png`;
    link.click();
  };

  const printAllQRs = () => {
    const tables = generateTableNumbers();
    const printWindow = window.open('', '_blank');
    const qrCodes = tables.map(tableNumber => {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateQRUrl(tableNumber))}`;
      return `
        <div style="display: inline-block; margin: 20px; text-align: center; page-break-inside: avoid;">
          <h3 style="margin-bottom: 10px; font-family: Arial;">Table ${tableNumber}</h3>
          <img src="${qrUrl}" alt="QR Code for Table ${tableNumber}" style="border: 2px solid #46923c;">
          <p style="margin-top: 10px; font-size: 12px; color: #666; font-family: Arial;">Scan to order from Table ${tableNumber}</p>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Table QR Codes - Mian Taste</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print {
              @page { margin: 1cm; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1 style="text-align: center; color: #46923c; margin-bottom: 30px;">Mian Taste - Table QR Codes</h1>
          ${qrCodes}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#46923c' }}>
            <QrCode className="w-6 h-6 text-white" />
          </div>
          QR Code Generator
        </h2>
        <p className="text-gray-600">Generate QR codes for table ordering</p>
      </div>

      {/* Configuration */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Numbers (comma-separated)
            </label>
            <input
              type="text"
              value={tableNumbers}
              onChange={(e) => setTableNumbers(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46923c] focus:border-transparent"
              placeholder="1,2,3,4,5..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46923c] focus:border-transparent"
              placeholder="http://localhost:3000/menu?qr=true&table="
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={printAllQRs}
            className="px-4 py-2 bg-[#46923c] text-white rounded-lg hover:bg-[#5BC142] transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print All QR Codes
          </button>
        </div>
      </div>

      {/* QR Code Grid */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated QR Codes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {generateTableNumbers().map((tableNumber) => (
            <div key={tableNumber} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-900 mb-3">Table {tableNumber}</h4>
              
              {/* QR Code */}
              <div className="mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(generateQRUrl(tableNumber))}`}
                  alt={`QR Code for Table ${tableNumber}`}
                  className="mx-auto border-2 border-gray-200 rounded"
                />
              </div>
              
              {/* URL */}
              <div className="mb-4">
                <p className="text-xs text-gray-600 break-all bg-gray-50 p-2 rounded">
                  {generateQRUrl(tableNumber)}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => copyToClipboard(generateQRUrl(tableNumber), tableNumber)}
                  className="p-2 text-gray-600 hover:text-[#46923c] transition-colors"
                  title="Copy URL"
                >
                  {copied === tableNumber ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                
                <button
                  onClick={() => downloadQR(tableNumber)}
                  className="p-2 text-gray-600 hover:text-[#46923c] transition-colors"
                  title="Download QR Code"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default QRGenerator;