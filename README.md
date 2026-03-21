# TraderOS Lite 🚀

**The trading dashboard that exposes your mistakes.**

A professional-grade trading performance dashboard designed for retail traders. Track your trades, analyze performance, and discover why you win or lose.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**: Secure signup/login with Supabase Auth
- **Trade Logging**: Add, edit, and delete trades with detailed information
- **Performance Analytics**: Automatic calculation of key trading metrics
- **Professional Charts**: Beautiful visualizations using Recharts
- **Dark Theme UI**: Futuristic trading terminal design

### 📊 Analytics & Metrics
- Total trades, wins, losses, and win rate
- Total P&L and average trade performance
- Profit factor calculation
- Best and worst performing pairs
- Equity curve visualization
- Win/loss distribution charts
- Performance by trading pair

### 🎨 Professional Design
- Bloomberg-style dark UI
- Neon accent colors (green/red for P&L)
- Card-based metrics panels
- Smooth animations and transitions
- Responsive design for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd traderos-lite
npm install
```

### 2. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy your project URL and anon key
5. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy the contents from supabase/schema.sql
```

### 4. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (Supabase)
- **State Management**: React Context + Custom Hooks

### Project Structure
```
traderos-lite/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/trades/        # API routes
│   │   ├── dashboard/         # Protected dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   └── layout.tsx         # Root layout with AuthProvider
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── charts/            # Chart components
│   │   └── trades/            # Trade-related components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Route protection
├── supabase/
│   └── schema.sql             # Database schema
└── README.md
```

## 📈 Key Features Explained

### Trade Management
- Add trades with pair, direction, entry/exit prices, P&L, setup tags, and notes
- Edit existing trades to correct mistakes
- Delete trades with confirmation
- Date-based trade organization

### Performance Analytics
- **Win Rate**: Percentage of profitable trades
- **Profit Factor**: Ratio of average win to average loss
- **Equity Curve**: Visual representation of account growth over time
- **Pair Performance**: Analysis of profitability by trading instrument

### Professional UI/UX
- Dark theme optimized for long trading sessions
- Real-time data updates
- Mobile-responsive design
- Keyboard-friendly forms
- Loading states and error handling

## 🎯 Future Enhancements

### Planned Features
- [ ] AI-powered trade analysis
- [ ] Screenshot upload for trade validation
- [ ] Strategy tracking and backtesting
- [ ] Advanced filtering and search
- [ ] Export to CSV/Excel
- [ ] Trading journal with templates
- [ ] Risk management tools
- [ ] Multi-account support
- [ ] Pro subscription features

### Technical Improvements
- [ ] Real-time data synchronization
- [ ] Advanced caching strategies
- [ ] Performance optimizations
- [ ] PWA capabilities
- [ ] Dark/light theme toggle
- [ ] Internationalization

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by professional trading platforms
- Designed for the retail trading community

---

**TraderOS Lite** - Transform your trading journey today! 📈