# Friends Cafe

A modern web application for Friends Cafe, featuring a comprehensive menu system, online ordering capabilities, and a seamless user experience.

## Features

- **Interactive Menu System**
  - Categorized food items with detailed descriptions
  - Diet preference filtering (Veg/Non-Veg)
  - Dynamic pricing for different sizes (applicable for pizzas)
  - Real-time menu updates

- **User-Friendly Interface**
  - Responsive design for all devices
  - Intuitive navigation with category tabs
  - Beautiful food item cards with images
  - Modern UI components with smooth transitions

- **Shopping Cart**
  - Real-time cart updates
  - Free delivery on orders above ₹300
  - Special handling for pizza box charges
  - Easy quantity modification

- **Account Management**
  - User authentication
  - Password reset functionality
  - Order history tracking
  - Profile management

## Tech Stack

- **Frontend Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Hooks (useCart, useToast)
- **UI Components**: Custom shadcn/ui components
- **Authentication**: Built-in Next.js authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd friends-cafe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── data/               # Menu and other data
├── hooks/              # Custom React hooks
├── images/             # Image assets
├── lib/                # Utility functions
├── public/             # Static assets
└── styles/             # Global styles
```

## Menu Categories

- Breakfast
- Noodles & Chinese
- Rice Bowls
- Main Course (Veg & Non-Veg)
- Paneer Specials
- Pizza (Single, Double, Multiple Sizes)
- Sandwiches & Burgers
- Beverages (Shakes & Mocktails)
- And more...

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.