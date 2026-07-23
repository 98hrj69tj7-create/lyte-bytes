// leadTracker.js

export const trackAbandonedLead = (fieldName, value, customer, cart, googleScriptUrl) => {
  if (fieldName === 'phone' && value && value.length >= 10) {
    const leadData = {
      type: 'ABANDONED_LEAD',
      name: customer.name || 'Not provided',
      phone: value,
      email: customer.email || 'Not provided',
      address: customer.address || 'Not provided',
      cart: JSON.stringify(cart),
      timestamp: new Date().toLocaleString()
    };

    console.log("Sending abandoned lead to Google Sheet:", leadData);

    if (!googleScriptUrl) {
      console.warn("Google Apps Script URL is missing.");
      return;
    }

    fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData)
    })
    .then(() => {
      console.log("Lead successfully synced to sheet background.");
    })
    .catch((error) => {
      console.error("Error syncing lead:", error);
    });
  }
};