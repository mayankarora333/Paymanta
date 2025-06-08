## Autonomous Payment Agents with Payman AI SDK
A powerful system of intelligent agents that manage financial workflows — from funding bounties and running payroll to paying invoices, issuing refunds, and profit-sharing — all seamlessly powered by a single Payman wallet.

## ⚙️ Overview
This project leverages the Payman AI SDK to build autonomous agents capable of executing complex, rule-based and AI-assisted financial operations. Each agent interacts with the Payman API through a unified wallet interface to handle critical business tasks — with zero manual intervention.

Designed for startups, DAOs, open-source collectives, and modern teams, this solution automates operational finance with intelligence, reliability, and transparency.

 ## What It Does
Using the Payman AI SDK, the system supports the following automated workflows:

✅ Fund Bounties: Agents automatically fund new tasks or GitHub issues when matching criteria are met.

🧾 Run Payroll: Schedule and distribute recurring payments to contributors, employees, or freelancers.

💼 Pay Invoices: Detect due invoices and trigger verified payments from your Payman wallet.

💸 Refund Failed Tasks: Automatically detect and refund payees if a deliverable or task fails validation.

🤝 Split Profits: Share revenues with stakeholders, team members, or token holders based on predefined logic.

💬 Natural Language Triggers: Interact with agents via human-friendly prompts (e.g., “pay contributors from last sprint”).

 ## Use Cases
DAOs & Web3 Communities: Automatically reward contributors and share community earnings.

Startups & SMBs: Automate team payouts and invoice flows with minimal engineering effort.

Open Source Projects: Reward merged PRs or distribute sponsorship earnings to maintainers.

Freelance Collectives: Split project revenue, handle contracts, and pay talent without overhead.
## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack React Query
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **API Integration**: Payman TypeScript SDK

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd payman-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Payman API credentials in `src/services/paymanService.ts`:
```typescript
const PAYMAN_CLIENT_ID = 'your-client-id';
const PAYMAN_CLIENT_SECRET = 'your-client-secret';
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Page footer
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── Payees.tsx      # Payee management
│   ├── Payments.tsx    # Payment history
│   ├── NewPayment.tsx  # Create new payment
│   └── Settings.tsx    # Application settings
├── services/           # API services
│   └── paymanService.ts # Payman API integration
└── hooks/              # Custom React hooks
    └── use-toast.ts    # Toast notifications
```

## Features Overview

### Dashboard
- Real-time account balance and statistics
- Payment volume charts and trends
- Quick access to recent transactions
- Success rate monitoring

### Payee Management
- View all registered payees
- Search and filter functionality
- Payee status tracking (active/inactive)
- Payment history per payee
- Quick payment actions

### Payment Processing
- Send payments to existing payees
- Real-time payment status updates
- Transaction history and tracking
- Support for multiple currencies

### Settings
- API credential configuration
- Application preferences
- Demo mode toggle

## API Integration

This application integrates with the Payman API using the official TypeScript SDK. The service layer (`paymanService.ts`) handles:

- Authentication with client credentials
- Fetching payee data
- Creating and tracking payments
- Retrieving dashboard statistics
- Error handling and fallback to mock data

### Payman API Usage

```typescript
// Basic usage
const response = await payman.ask("List all payees");

// Streaming responses for real-time updates
await payman.ask("Send payment", {
  onMessage: (res) => {
    console.log("Update:", res);
  }
});
```

## Environment Setup

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

The application is configured for deployment on platforms like:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Configuration

### API Credentials
Update the credentials in `src/services/paymanService.ts`:
```typescript
const PAYMAN_CLIENT_ID = 'pm-test-your-client-id';
const PAYMAN_CLIENT_SECRET = 'your-client-secret';
```

### Styling
The application uses Tailwind CSS with a custom configuration. Modify `tailwind.config.ts` to customize the design system.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Security Notes

- API credentials should be stored securely
- Never commit credentials to version control
- Use environment variables in production
- Implement proper error handling for API failures

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Verify your Payman credentials are correct
2. **Build Failures**: Ensure all dependencies are installed with `npm install`
3. **Styling Issues**: Check that Tailwind CSS is properly configured
4. **Component Errors**: Verify all shadcn/ui components are properly imported

### Demo Mode
If API credentials are not configured or invalid, the application automatically falls back to demo mode with mock data.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support with the Payman API, visit the [Payman documentation](https://docs.payman.ai) or contact their support team.

For issues with this dashboard application, please create an issue in the repository.
