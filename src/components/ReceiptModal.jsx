import React, { useEffect, useRef } from 'react';
import { usePOS } from '../context/POSContext';
import { jsPDF } from 'jspdf';
import { Download, X, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

export const ReceiptModal = () => {
  const { currentOrder, isReceiptOpen, setIsReceiptOpen } = usePOS();
  const modalRef = useRef(null);

  useEffect(() => {
    if (isReceiptOpen) {
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isReceiptOpen]);

  if (!isReceiptOpen || !currentOrder) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ANTIGRAVITY POS", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${currentOrder.id}`, 20, 30);
    doc.text(`Date: ${new Date(currentOrder.date).toLocaleString()}`, 20, 36);
    
    doc.line(20, 40, 190, 40);
    
    let yPos = 50;
    currentOrder.items.forEach((item) => {
      doc.text(`${item.quantity}x ${item.name}`, 20, yPos);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPos, { align: "right" });
      yPos += 8;
    });
    
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 12;
    
    doc.setFont("helvetica", "bold");
    doc.text("Total (inc. Tax):", 20, yPos);
    doc.text(`$${currentOrder.total.toFixed(2)}`, 170, yPos, { align: "right" });
    
    doc.save(`receipt_${currentOrder.id.replace('#', '')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="glassmorphism w-full max-w-md p-6 rounded-2xl border-success/30 border-t-4 relative"
      >
        <button 
          onClick={() => setIsReceiptOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-success/20 p-3 rounded-full text-success mb-3">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold">Order Complete!</h2>
          <p className="text-sm font-mono text-white/50 mt-1">{currentOrder.id}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto custom-scrollbar">
          {currentOrder.items.map(item => (
            <div key={item.id} className="flex justify-between py-2 border-b border-white/5 last:border-0 text-sm">
              <span><span className="text-accent">{item.quantity}x</span> {item.name}</span>
              <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg font-bold mb-6 pt-4 border-t border-white/10">
          <span>Total Paid</span>
          <span className="font-mono text-success">${currentOrder.total.toFixed(2)}</span>
        </div>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={downloadPDF}
          className="w-full bg-accent hover:bg-accent/90 text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <Download size={20} />
          Download Receipt PDF
        </motion.button>
      </div>
    </div>
  );
};
