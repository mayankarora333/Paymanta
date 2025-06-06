import { PaymanClient } from '@paymanai/payman-ts';

// Your provided credentials
const PAYMAN_CLIENT_ID = 'pm-test-vvTstyNhGSVkzOsuJjCJlUGE';
const PAYMAN_CLIENT_SECRET = 'EET3VWEwgmailmlbaapmbX0GNZUUgu9cM-phXaupXAuIS70iY1fdsbz0zDlpPYOW';

// Initialize Payman client with your credentials
let payman: PaymanClient | null = null;

// Check if we have valid credentials
const hasValidCredentials = () => {
  return PAYMAN_CLIENT_ID && PAYMAN_CLIENT_SECRET;
};

// Initialize client with your credentials
try {
  payman = PaymanClient.withCredentials({
    clientId: PAYMAN_CLIENT_ID,
    clientSecret: PAYMAN_CLIENT_SECRET
  });
  console.log('Payman client initialized successfully with provided credentials');
} catch (error) {
  console.error('Failed to initialize Payman client:', error);
}

export interface Payee {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  status: 'active' | 'inactive';
  totalPaid: number;
  currency: string;
  createdAt: string;
  type?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Mock data for fallback when API fails
const mockPayees: Payee[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    walletAddress: '0x742d35Cc6123459681e5b120804169bAb7Cecd',
    status: 'active',
    totalPaid: 2500.00,
    currency: 'USD',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    walletAddress: '0x8b3a3B754d3f4a3F4c1234567890abcdef123456',
    status: 'active',
    totalPaid: 1800.00,
    currency: 'USD',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    status: 'inactive',
    totalPaid: 950.00,
    currency: 'USD',
    createdAt: '2024-02-01T09:45:00Z'
  }
];

// Mock payments data for fallback when API fails
const mockPayments: Payment[] = [
  {
    id: 'payment_1',
    amount: 5.00,
    currency: 'TDS',
    recipient: 'chinmay',
    status: 'completed',
    description: 'Project milestone payment',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 'payment_2',
    amount: 10.00,
    currency: 'TDS',
    recipient: 'mayank',
    status: 'completed',
    description: 'Consulting fee',
    createdAt: '2024-01-20T16:45:00Z'
  },
  {
    id: 'payment_3',
    amount: 3.00,
    currency: 'TDS',
    recipient: 'chirag',
    status: 'pending',
    description: 'Expense reimbursement',
    createdAt: '2024-02-01T11:20:00Z'
  }
];

// Helper function to parse payees from text content (improved for structured format)
const parsePayeesFromText = (content: string): Payee[] => {
  const payees: Payee[] = [];
  try {
    console.log('Parsing payees from structured text content:', content);

    const lines = content.split('\n');
    let currentPayee: Partial<Payee> | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      const payeeNameMatch = trimmedLine.match(/^\d+\.\s+Payee:\s*(.+)$/);
      if (payeeNameMatch) {
        if (currentPayee && currentPayee.name) {
          payees.push({
            id: `payee_${Date.now()}_${payees.length}`,
            name: currentPayee.name,
            email: currentPayee.email || `${currentPayee.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
            walletAddress: currentPayee.walletAddress,
            status: currentPayee.status || 'active',
            totalPaid: currentPayee.totalPaid || 0,
            currency: currentPayee.currency || 'TSD',
            createdAt: currentPayee.createdAt || new Date().toISOString(),
            type: currentPayee.type || 'standard'
          });
        }

        currentPayee = {
          name: payeeNameMatch[1].trim(),
          currency: 'TSD',
          status: 'active',
          totalPaid: 0
        };
        continue;
      }

      if (currentPayee) {
        const typeMatch = trimmedLine.match(/^-\s*Type:\s*(.+)$/);
        if (typeMatch) currentPayee.type = typeMatch[1].trim().toLowerCase().replace(/\s+/g, '_');

        const currencyMatch = trimmedLine.match(/^-\s*Currency:\s*(.+)$/);
        if (currencyMatch) currentPayee.currency = currencyMatch[1].trim();

        const walletIdMatch = trimmedLine.match(/^-\s*Wallet ID:\s*(.+)$/);
        if (walletIdMatch) currentPayee.walletAddress = walletIdMatch[1].trim();

        const orgNameMatch = trimmedLine.match(/^-\s*Organization Name:\s*(.+)$/);
        if (orgNameMatch) currentPayee.email = `${orgNameMatch[1].trim().toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
      }
    }

    if (currentPayee && currentPayee.name) {
      payees.push({
        id: `payee_${Date.now()}_${payees.length}`,
        name: currentPayee.name,
        email: currentPayee.email || `${currentPayee.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`,
        walletAddress: currentPayee.walletAddress,
        status: currentPayee.status || 'active',
        totalPaid: currentPayee.totalPaid || 0,
        currency: currentPayee.currency || 'TSD',
        createdAt: currentPayee.createdAt || new Date().toISOString(),
        type: currentPayee.type || 'standard'
      });
    }

    console.log(`Successfully parsed ${payees.length} payees from structured text`);
  } catch (error) {
    console.error('Error parsing payees from structured text:', error);
  }

  return payees;
};

// Helper function to parse payees from response
const parsePayeesFromResponse = (response: any): Payee[] => {
  try {
    console.log('Parsing payees response:', response);
    
    // Handle Payman API response structure with artifacts
    if (response && response.artifacts && Array.isArray(response.artifacts)) {
      console.log('Found artifacts in response:', response.artifacts);
      
      let allPayees: Payee[] = [];
      
      // Extract data from artifacts
      response.artifacts.forEach((artifact: any, index: number) => {
        console.log(`Processing artifact ${index + 1}:`, artifact);
        
        if (artifact.parts && Array.isArray(artifact.parts)) {
          artifact.parts.forEach((part: any) => {
            if (part.type === 'text' && part.text) {
              console.log('Found text content in part:', part.text);
              const textPayees = parsePayeesFromText(part.text);
              if (textPayees.length > 0) {
                allPayees = [...allPayees, ...textPayees];
              }
            }
          });
        } else if (artifact.type === 'text' && artifact.content) {
          console.log('Found text content in artifact:', artifact.content);
          const textPayees = parsePayeesFromText(artifact.content);
          if (textPayees.length > 0) {
            allPayees = [...allPayees, ...textPayees];
          }
        }
      });
      
      console.log('Total payees extracted from all artifacts:', allPayees.length);
      
      if (allPayees.length > 0) {
        // Remove duplicates based on name
        const uniquePayees = allPayees.filter((payee, index, self) => 
          index === self.findIndex(p => p.name.toLowerCase() === payee.name.toLowerCase())
        );
        console.log('Unique payees after deduplication:', uniquePayees);
        return uniquePayees;
      }
    }

    // Fallback to original parsing logic
    if (Array.isArray(response)) {
      return response.map((payee, index) => ({
        id: payee.id || `payee_${index + 1}`,
        name: payee.name || `Payee ${index + 1}`,
        email: payee.email || `payee${index + 1}@example.com`,
        walletAddress: payee.walletAddress || payee.wallet_address,
        status: (payee.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
        totalPaid: typeof payee.totalPaid === 'number' ? payee.totalPaid : 0,
        currency: payee.currency || 'USD',
        createdAt: payee.createdAt || payee.created_at || new Date().toISOString(),
        type: payee.type || 'standard'
      }));
    }

    return [];
  } catch (error) {
    console.error('Error parsing payees response:', error);
    return [];
  }
};

// Helper function to parse payments from response with Payman artifacts support
const parsePaymentsFromResponse = (response: any): Payment[] => {
  try {
    console.log('🔍 Parsing payments response:', response);
    
    // Handle Payman API response structure with artifacts
    if (response && response.artifacts && Array.isArray(response.artifacts)) {
      console.log('📦 Found artifacts in response:', response.artifacts.length);
      
      let paymentData: any[] = [];
      
      // Extract data from artifacts
      response.artifacts.forEach((artifact: any, index: number) => {
        console.log(`📄 Processing artifact ${index + 1}:`, artifact);
        
        if (artifact.type === 'text' && artifact.content) {
          try {
            // Try to parse JSON content
            const parsed = JSON.parse(artifact.content);
            console.log('✅ Parsed JSON from artifact:', parsed);
            
            if (Array.isArray(parsed)) {
              paymentData = [...paymentData, ...parsed];
              console.log('📊 Added array data:', parsed.length, 'items');
            } else if (parsed.payments && Array.isArray(parsed.payments)) {
              paymentData = [...paymentData, ...parsed.payments];
              console.log('💰 Added payments data:', parsed.payments.length, 'items');
            } else if (parsed.transactions && Array.isArray(parsed.transactions)) {
              paymentData = [...paymentData, ...parsed.transactions];
              console.log('💳 Added transactions data:', parsed.transactions.length, 'items');
            } else if (parsed.data && Array.isArray(parsed.data)) {
              paymentData = [...paymentData, ...parsed.data];
              console.log('📋 Added data array:', parsed.data.length, 'items');
            } else if (parsed.amount !== undefined) {
              // Single payment object
              paymentData.push(parsed);
              console.log('💸 Added single payment:', parsed);
            }
          } catch (parseError) {
            console.log('❌ Failed to parse JSON, checking for payment info in text');
            // If not JSON, check if content contains payment-like information
            if (artifact.content.includes('amount') || artifact.content.includes('payment') || artifact.content.includes('transaction')) {
              console.log('💰 Found payment content in artifact:', artifact.content);
              
              // Try to extract payment information from text
              const lines = artifact.content.split('\n');
              let currentPayment: any = {};
              
              lines.forEach(line => {
                const amountMatch = line.match(/amount[:\s]+\$?([0-9,.]+)/i);
                const recipientMatch = line.match(/(?:to|recipient|payee)[:\s]+([^,\n]+)/i);
                const statusMatch = line.match(/status[:\s]+(\w+)/i);
                const idMatch = line.match(/(?:id|transaction)[:\s]+([a-zA-Z0-9-_]+)/i);
                
                if (amountMatch) currentPayment.amount = parseFloat(amountMatch[1].replace(',', ''));
                if (recipientMatch) currentPayment.recipient = recipientMatch[1].trim();
                if (statusMatch) currentPayment.status = statusMatch[1].toLowerCase();
                if (idMatch) currentPayment.id = idMatch[1];
              });
              
              if (currentPayment.amount || currentPayment.recipient) {
                paymentData.push(currentPayment);
                console.log('📝 Extracted payment from text:', currentPayment);
              }
            }
          }
        }
        
        // Handle other artifact types that might contain payment data
        if (artifact.data && Array.isArray(artifact.data)) {
          paymentData = [...paymentData, ...artifact.data];
          console.log('📊 Added artifact data array:', artifact.data.length, 'items');
        }
      });
      
      console.log('📈 Total payment data collected:', paymentData.length);
      
      if (paymentData.length > 0) {
        const processedPayments = paymentData.map((payment, index) => {
          const processed = {
            id: payment.id || payment.transactionId || payment.transaction_id || `payment_${Date.now()}_${index}`,
            amount: typeof payment.amount === 'number' ? payment.amount : 
                   typeof payment.value === 'number' ? payment.value : 
                   typeof payment.total === 'number' ? payment.total : 0,
            currency: payment.currency || payment.curr || 'USD',
            recipient: payment.recipient || payment.to || payment.payee || payment.recipient_name || `Recipient ${index + 1}`,
            status: (payment.status || payment.state || 'pending').toLowerCase(),
            description: payment.description || payment.memo || payment.note || payment.purpose || 'Payment transaction',
            createdAt: payment.createdAt || payment.created_at || payment.timestamp || payment.date || new Date().toISOString(),
            metadata: payment.metadata || {}
          };
          
          console.log(`✅ Processed payment ${index + 1}:`, processed);
          return processed;
        });
        
        return processedPayments;
      }
    }

    // Fallback to original parsing logic
    if (Array.isArray(response)) {
      console.log('📋 Processing array response directly');
      return response.map((payment, index) => ({
        id: payment.id || `payment_${index + 1}`,
        amount: typeof payment.amount === 'number' ? payment.amount : 0,
        currency: payment.currency || 'TDS',
        recipient: payment.recipient || payment.to || `Recipient ${index + 1}`,
        status: payment.status || 'pending',
        description: payment.description || payment.memo || 'Payment',
        createdAt: payment.createdAt || payment.created_at || new Date().toISOString(),
        metadata: payment.metadata || {}
      }));
    }

    if (response && response.data && Array.isArray(response.data)) {
      console.log('📋 Processing nested data array');
      return parsePaymentsFromResponse(response.data);
    }

    console.log('❌ No valid payment data found in response');
    return [];
  } catch (error) {
    console.error('❌ Error parsing payments response:', error);
    return [];
  }
};

export class PaymanService {
  static async fetchPayees(): Promise<Payee[]> {
    if (!payman) {
      console.log('Payman client not initialized, using mock data');
      return mockPayees;
    }

    try {
      console.log('Fetching payees from Payman API...');
      
      // Enhanced message to request all payees with better structure
      const response = await payman.ask(`list all payees  . 

For each payee, please provide:
- Name (full name or company name)
- Email address (if available)
- Wallet address or payment address (if available)
- Current status (active/inactive)
- Total amount paid to them historically
- Currency they typically receive
- When they were first added
- Tags or categories

Please format this as a clear list with all available payees.`);
      
      console.log('Raw payees response from Payman:', response);
      
      // Parse the response to extract payee data
      const parsedPayees = parsePayeesFromResponse(response);
      
      // If we got valid data from API, return it; otherwise use mock data
      if (parsedPayees.length > 0) {
        console.log('Successfully parsed payees from API:', parsedPayees.length, 'payees found');
        parsedPayees.forEach((payee, index) => {
          console.log(`Payee ${index + 1}: ${payee.name} (${payee.email})`);
        });
        return parsedPayees;
      } else {
        console.log('No payees found in API response, using mock data');
        return mockPayees;
      }
    } catch (error) {
      console.error('Error fetching payees from Payman API:', error);
      console.log('Falling back to mock data');
      return mockPayees;
    }
  }

  static async createPayee(payeeData: {
    name: string;
    type: string;
    email?: string;
  }): Promise<Payee> {
    if (!payman) {
      console.log('Payman client not initialized, simulating payee creation');
      return {
        id: `payee_${Date.now()}`,
        name: payeeData.name,
        email: payeeData.email || `${payeeData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        status: 'active',
        totalPaid: 0,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        type: payeeData.type
      };
    }

    try {
      console.log('Creating payee with Payman API:', payeeData);
      
      const response = await payman.ask(`Create a Test Rails payee of type ${payeeData.type} called ${payeeData.name}${payeeData.email ? ` with email ${payeeData.email}` : ''}. Return the payee details in JSON format.`);
      console.log('Payee created successfully:', response);
      
      // Parse the payee response
      const parsedPayees = parsePayeesFromResponse(response);
      
      if (parsedPayees.length > 0) {
        return parsedPayees[0];
      }
      
      // Fallback if parsing fails
      return {
        id: `payee_${Date.now()}`,
        name: payeeData.name,
        email: payeeData.email || `${payeeData.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        status: 'active',
        totalPaid: 0,
        currency: 'USD',
        createdAt: new Date().toISOString(),
        type: payeeData.type
      };
    } catch (error) {
      console.error('Error creating payee with Payman API:', error);
      throw new Error('Failed to create payee');
    }
  }

  static async quickPay(amount: number, payeeName: string): Promise<Payment> {
    if (!payman) {
      console.log('Payman client not initialized, simulating quick payment');
      return {
        id: `payment_${Date.now()}`,
        amount: amount,
        currency: 'USD',
        recipient: payeeName,
        status: 'pending',
        description: `Quick payment to ${payeeName}`,
        createdAt: new Date().toISOString()
      };
    }

    try {
      console.log('Processing quick payment:', { amount, payeeName });
      
      let finalResponse = null;
      
      // Use streaming to get real-time updates
      await payman.ask(`Pay ${amount} TDS to ${payeeName}. Process this payment immediately.`, {
        onMessage: (res) => {
          console.log("Quick payment update:", res);
          finalResponse = res;
        }
      });
      
      console.log('Quick payment processed:', finalResponse);
      
      // Parse payment ID from response if available
      let paymentId = `payment_${Date.now()}`;
      let status = 'completed';
      
      if (finalResponse && finalResponse.artifacts) {
        finalResponse.artifacts.forEach((artifact: any) => {
          if (artifact.type === 'text' && artifact.content) {
            try {
              const parsed = JSON.parse(artifact.content);
              if (parsed.id || parsed.transactionId) {
                paymentId = parsed.id || parsed.transactionId;
              }
              if (parsed.status) {
                status = parsed.status;
              }
            } catch {
              // Not JSON, check for ID patterns in text
              const idMatch = artifact.content.match(/(?:id|transaction)[:\s]+([a-zA-Z0-9-_]+)/i);
              if (idMatch) {
                paymentId = idMatch[1];
              }
            }
          }
        });
      }
      
      return {
        id: paymentId,
        amount: amount,
        currency: 'TDS',
        recipient: payeeName,
        status: status as 'pending' | 'completed' | 'failed',
        description: `Quick payment to ${payeeName}`,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error processing quick payment:', error);
      throw new Error('Failed to process quick payment');
    }
  }

  static async createPayment(paymentData: {
    amount: number;
    currency: string;
    recipient: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<Payment> {
    if (!payman) {
      console.log('Payman client not initialized, simulating payment creation');
      return {
        id: `payment_${Date.now()}`,
        amount: paymentData.amount,
        currency: paymentData.currency,
        recipient: paymentData.recipient,
        status: 'pending',
        description: paymentData.description,
        createdAt: new Date().toISOString(),
        metadata: paymentData.metadata
      };
    }

    try {
      console.log('Creating payment with Payman API:', paymentData);
      
      const prompt = `Send a payment of ${paymentData.amount} ${paymentData.currency} to ${paymentData.recipient} for: ${paymentData.description}. Return the payment confirmation details in JSON format.`;
      
      let finalResponse = null;
      
      // Use streaming to get real-time updates
      await payman.ask(prompt, {
        onMessage: (res) => {
          console.log("Payment creation update:", res);
          finalResponse = res;
        },
        metadata: paymentData.metadata || {}
      });
      
      console.log('Payment created successfully:', finalResponse);
      
      // Parse the payment response if it contains artifacts
      let paymentId = `payment_${Date.now()}`;
      let status = 'completed';
      
      if (finalResponse && finalResponse.artifacts) {
        // Try to extract payment ID from artifacts
        finalResponse.artifacts.forEach((artifact: any) => {
          if (artifact.type === 'text' && artifact.content) {
            try {
              const parsed = JSON.parse(artifact.content);
              if (parsed.id || parsed.transactionId) {
                paymentId = parsed.id || parsed.transactionId;
              }
              if (parsed.status) {
                status = parsed.status;
              }
            } catch {
              // Not JSON, check for ID patterns in text
              const idMatch = artifact.content.match(/(?:id|transaction)[:\s]+([a-zA-Z0-9-_]+)/i);
              if (idMatch) {
                paymentId = idMatch[1];
              }
            }
          }
        });
      }
      
      return {
        id: paymentId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        recipient: paymentData.recipient,
        status: status as 'pending' | 'completed' | 'failed',
        description: paymentData.description,
        createdAt: new Date().toISOString(),
        metadata: paymentData.metadata
      };
    } catch (error) {
      console.error('Error creating payment with Payman API:', error);
      throw new Error('Failed to create payment');
    }
  }

  static async fetchPayments(): Promise<Payment[]> {
    console.log('🚀 PaymanService.fetchPayments() called');
    
    if (!payman) {
      console.log('⚠️ Payman client not initialized, using mock data');
      return mockPayments;
    }

    try {
      console.log('🔄 Fetching payments from Payman SDK API...');
      
      const response = await payman.ask(
        "List all my recent payments, transactions, and transfers with complete details including transaction IDs, amounts, recipients, status, descriptions, timestamps, and any metadata. Show both incoming and outgoing transactions. Return comprehensive transaction history in JSON format with an array of transaction objects.",
        {
          onMessage: (res) => {
            console.log("📡 Real-time payment fetch update:", res);
          }
        }
      );
      
      console.log('📦 Raw payments response from Payman SDK:', response);
      
      // Parse the response to extract payment data
      const parsedPayments = parsePaymentsFromResponse(response);
      
      // If we got valid data from API, return it; otherwise use mock data
      if (parsedPayments.length > 0) {
        console.log('✅ Successfully parsed payments from SDK:', parsedPayments.length, 'payments');
        parsedPayments.forEach((payment, index) => {
          console.log(`💰 Payment ${index + 1}: ${payment.recipient} - ${payment.amount} ${payment.currency} (${payment.status})`);
        });
        return parsedPayments;
      } else {
        console.log('⚠️ No payments found in SDK response, using mock data');
        return mockPayments;
      }
    } catch (error) {
      console.error('❌ Error fetching payments from Payman SDK:', error);
      console.log('🔄 Falling back to mock data');
      return mockPayments;
    }
  }

  static async getDashboardStats() {
    if (!payman) {
      console.log('Payman client not initialized, using mock stats');
      return {
        totalBalance: 15420.50,
        totalPayments: 45,
        activePayees: 12,
        pendingPayments: 3,
        monthlyVolume: 8750.00,
        successRate: 98.5
      };
    }

    try {
      console.log('Fetching dashboard stats from Payman API...');
      
      let statsResponse = null;
      
      await payman.ask("Get my tds wallet account balance, total number of payments sent, number of active  test payees,  Return the data in JSON format.", {
        onMessage: (res) => {
          console.log("Dashboard stats update:", res);
          statsResponse = res;
        }
      });
      
      console.log('Dashboard stats response from Payman:', statsResponse);
      
      // Try to parse stats from artifacts
      let stats = {
        totalBalance: 15420.50,
        totalPayments: 45,
        activePayees: 12,
        pendingPayments: 3,
        monthlyVolume: 8750.00,
        successRate: 98.5
      };
      
      if (statsResponse && statsResponse.artifacts) {
        statsResponse.artifacts.forEach((artifact: any) => {
          if (artifact.type === 'text' && artifact.content) {
            try {
              const parsed = JSON.parse(artifact.content);
              if (parsed.balance !== undefined) stats.totalBalance = parsed.balance;
              if (parsed.totalPayments !== undefined) stats.totalPayments = parsed.totalPayments;
              if (parsed.activePayees !== undefined) stats.activePayees = parsed.activePayees;
              if (parsed.pendingPayments !== undefined) stats.pendingPayments = parsed.pendingPayments;
              if (parsed.monthlyVolume !== undefined) stats.monthlyVolume = parsed.monthlyVolume;
              if (parsed.successRate !== undefined) stats.successRate = parsed.successRate;
            } catch {
              // Try to extract numbers from text
              const balanceMatch = artifact.content.match(/balance[:\s]+\$?([0-9,]+\.?[0-9]*)/i);
              if (balanceMatch) stats.totalBalance = parseFloat(balanceMatch[1].replace(',', ''));
            }
          }
        });
      }
      
      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats from Payman API:', error);
      return {
        totalBalance: 15420.50,
        totalPayments: 45,
        activePayees: 12,
        pendingPayments: 3,
        monthlyVolume: 8750.00,
        successRate: 98.5
      };
    }
  }

  static getCredentialStatus() {
    return {
      hasValidCredentials: hasValidCredentials() && payman !== null,
      isUsingMockData: !payman
    };
  }
}
