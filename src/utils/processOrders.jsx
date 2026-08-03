import { useState, useEffect } from 'react';
import { processOrdersData } from './utils/processOrders'; // wherever you place the function

export default function AdminCustomerDirectory() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Fetch your Google Sheet data here
    async function loadData() {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwjR5KBDf8iB9e5Dh4ye5TxmIsbcirJsevDjMWma6B_Ine3HCYwC1ImeXgmr0XdVI9FZg/exec');
      const rawData = await response.json();
      
      // Process and group the data
      const structuredCustomers = processOrdersData(rawData);
      setCustomers(structuredCustomers);
    }

    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Customer List Column */}
      <div style={{ flex: 1, borderRight: '1px solid #ddd', paddingRight: '20px' }}>
        <h2>Customer Directory ({customers.length})</h2>
        {customers.map(cust => (
          <div 
            key={cust.id} 
            onClick={() => setSelectedCustomer(cust)}
            style={{ padding: '12px', marginBottom: '8px', background: '#f9f9f9', borderRadius: '6px', cursor: 'pointer' }}
          >
            <strong>{cust.name}</strong> ({cust.phone})[cite: 1]
            <div>Code: <span style={{ fontFamily: 'monospace' }}>{cust.customerCode}</span>[cite: 1]</div>
            <div>Lifetime Spend: **₹{cust.totalSpent.toFixed(2)}** ({cust.ordersCount} orders)</div>
          </div>
        ))}
      </div>

      {/* Expanded Order History & Detail View Column */}
      <div style={{ flex: 1.5 }}>
        {selectedCustomer ? (
          <div>
            <h3>Profile: {selectedCustomer.name}</h3>
            <p><strong>Phone:</strong> {selectedCustomer.phone}[cite: 1] | <strong>Customer Code:</strong> {selectedCustomer.customerCode}[cite: 1]</p>
            <p><strong>Total Lifetime Spend:</strong> ₹{selectedCustomer.totalSpent.toFixed(2)}</p>
            
            <h4>Order History ({selectedCustomer.orders.length})</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {selectedCustomer.orders.map((order, idx) => (
                <li key={idx} style={{ background: '#fff', border: '1px solid #eee', padding: '10px', marginBottom: '6px', borderRadius: '4px' }}>
                  <div><strong>{order.item}</strong> — ₹{order.amount}[cite: 1]</div>
                  <small style={{ color: '#666' }}>Date: {order.date} | Status: {order.paymentStatus} | Delivery: {order.deliveryMode}</small>[cite: 1]
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Select a customer from the left to view their complete order history and breakdown.</p>
        )}
      </div>
    </div>
  );
}