export const purchaseCartError = (ticket) => {
    return `
        An error occurred while creating the purchase ticket
        
        - The code must be a unique alphanumeric text. Received: '${ticket.code}'
        - The total price is required and must be a number. Received: '${ticket.amount}'
        - Purchaser information is required. Received: '${ticket.purchaser}'
        - The cart cannot be empty
    `;
}