import React, { useState, useEffect } from 'react';
import { processOrdersData } from './utils/processOrders';

export default function AdminCustomerDirectory() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    async function loadData() {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwjR5KBDf8iB9e5Dh4ye5TxmIsbcirJsevDjMWma6B_Ine3HCYwC1ImeXgmr0XdVI9FZg/exec');
      const rawData = await response.json();
      
      const structuredCustomers = processOrdersData(rawData);
      setCustomers(structuredCustomers);
    }

    loadData();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 'clamp(14px, 4vw, 20px)', 
      padding: 'clamp(12px, 3.5vw, 20px)',
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Customer Directory Header & List Column */}
      <div style={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}>
        <h2 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: 'clamp(18px, 5vw, 22px)', 
          color: '#FF5958',
          margin: '0 0 12px 0'
        }}>
          Customer Directory ({customers.length})
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
          {customers.map(cust => (
            <div 
              key={cust.id} 
              onClick={() => setSelectedCustomer(cust)}
              style={{ 
                padding: 'clamp(10px, 3vw, 12px)', 
                background: selectedCustomer?.id === cust.id ? 'rgba(197, 160, 89, 0.15)' : '#f9f9f9', 
                border: '1px solid rgba(197, 160, 89, 0.3)',
                borderRadius: '12px', 
                cursor: 'pointer',
                minWidth: 0,
                boxSizing: 'border-box'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: 'clamp(13px, 3.8vw, 14px)', color: '#1A1816', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cust.name} ({cust.phone})
              </div>
              <div style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: '#78716C', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Code: <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{cust.customerCode}</span>
              </div>
              <div style={{ fontSize: 'clamp(11px, 3.0vw, 12px)', color: '#8A6D2B', marginTop: '2px', fontWeight: '600' }}>
                Lifetime Spend: ₹{cust.totalSpent.toFixed(2)} ({cust.ordersCount} orders)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Order History & Detail View Column */}
      <div style={{ width: '100%', boxSizing: 'border-box', minWidth: 0, marginTop: '10px', borderTop: '1px solid rgba(197, 160, 89, 0.3)', paddingTop: '16px' }}>
        {selectedCustomer ? (
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(17px, 4.5vw, 20px)', color: '#1A1816', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Profile: {selectedCustomer.name}
            </h3>
            <p style={{ fontSize: 'clamp(11.5px, 3.2vw, 13px)', color: '#78716C', margin: '0 0 4px 0' }}>
              <strong>Phone:</strong> {selectedCustomer.phone} | <strong>Code:</strong> {selectedCustomer.customerCode}
            </p>
            <p style={{ fontSize: 'clamp(11.5px, 3.2vw, 13px)', color: '#8A6D2B', fontWeight: '700', margin: '0 0 14px 0' }}>
              Total Lifetime Spend: ₹{selectedCustomer.totalSpent.toFixed(2)}
            </p>
            
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 4.2vw, 18px)', color: '#FF5958', margin: '0 0 8px 0' }}>
              Order History ({selectedCustomer.orders.length})
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
              {selectedCustomer.orders.map((order, idx) => (
                <li key={idx} style={{ background: '#fff', border: '1px solid rgba(197, 160, 89, 0.3)', padding: '10px 12px', borderRadius: '10px', minWidth: '0', boxSizing: 'border-box' }}>
                  <div style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', fontWeight: '700', color: '#1A1816', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {order.item} — ₹{order.amount}
                  </div>
                  <small style={{ fontSize: 'clamp(10.5px, 2.8vw, 11px)', color: '#666', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Date: {order.date} | Status: {order.paymentStatus} | Delivery: {order.deliveryMode}
                  </small>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', color: '#78716C', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
            Select a customer above to view their complete order history and breakdown.
          </p>
        )}
      </div>
    </div>
  );
}