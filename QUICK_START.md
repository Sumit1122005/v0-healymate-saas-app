# HealyMate - Quick Start Reference

## 🚀 Launch the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Create Your First Account

1. Click **"Sign up"**
2. Enter email and password
3. Account created instantly (no verification needed)
4. Data is encrypted with your password

## 🎯 Quick Feature Tour (2 minutes)

### Dashboard
- Overview of your wellness stats
- 7-day mood trend chart
- Recent journal entries count
- Meditation sessions completed
- Active goals progress

### Journal
- Click **"New Entry"** or the floating button
- Write freely about your thoughts
- AI analyzes sentiment automatically
- All entries encrypted with your password
- Search past entries anytime

### Mood Tracker
- Log mood 1-10 scale
- Add activities or notes
- See trends over 7, 30 days, or all-time
- Identify patterns and triggers

### Meditation
- Browse guided sessions
- Choose duration: 5, 10, 15, 30 minutes
- Types: breathing, body scan, mindfulness, sleep
- Track your practice consistency

### Goals
- Create wellness objectives
- Set deadlines and milestones
- Track progress visually
- Categories: health, wellness, relationships, growth, lifestyle

### Therapist Directory
- Browse licensed therapists
- Filter by specialty
- View detailed profiles
- Find local or remote options

### Community
- Join supportive discussions
- Post anonymously if you prefer
- Share experiences and tips
- Like helpful responses

### Resources
- Read mental health articles
- Learn evidence-based techniques
- Explore wellness topics
- Topics: anxiety, depression, sleep, stress, relationships, confidence

### Settings
- Update notification preferences
- Choose your theme (light/dark/auto)
- Select language
- Review privacy and security info

## 🔐 Security Highlights

| Feature | Details |
|---------|---------|
| **Encryption** | AES-GCM, 256-bit keys |
| **Key Derivation** | PBKDF2, 100,000 iterations |
| **Password** | Never sent unencrypted |
| **Data Location** | Your device only |
| **Cloud** | No external servers |
| **Access** | Only you, with your password |

## 📊 Test Data Flow

```
You Write Entry
    ↓
AI Analyzes Sentiment (Mock)
    ↓
Entry Encrypted with Your Password
    ↓
Stored in Browser IndexedDB
    ↓
Only Decrypted When You Open It
    ↓
Never Leaves Your Device
```

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Entry | `Ctrl+J` (Journal page) |
| Log Mood | `Ctrl+M` (Mood page) |
| Start Meditation | `Enter` (Meditation page) |
| Search | `Ctrl+K` (Global) |

## 🎨 Theme & Design

**Color Scheme**
- Primary: Teal (#2dd4bf)
- Secondary: Cyan (#06b6d4)
- Neutrals: Grays and whites
- Accessible: High contrast ratios

**Responsive**
- Mobile: Touch-friendly, full-screen
- Tablet: Optimized layout
- Desktop: Sidebar + main content

## 💾 Data Storage

| Type | Storage | Persistence |
|------|---------|-------------|
| User Account | IndexedDB | Forever |
| Journal Entries | IndexedDB (encrypted) | Forever |
| Mood Logs | IndexedDB | Forever |
| Meditation History | IndexedDB | Forever |
| Goals & Progress | IndexedDB | Forever |
| Sessions | localStorage | Until logout |

## 🔄 Offline Support

✅ Works offline after first load
✅ Changes saved locally
✅ Auto-syncs when online (future)
✅ No data loss

## 📱 Device Support

| Device | Support |
|--------|---------|
| iPhone/iPad | ✅ Full |
| Android | ✅ Full |
| Desktop | ✅ Full |
| Tablet | ✅ Full |

## 🚨 Troubleshooting

**Can't login?**
- Password is case-sensitive
- Clear browser cache
- Try incognito mode

**Lost data?**
- Data is device-specific
- Try same browser/device
- Different browsers = different data

**Entries not showing?**
- Check you're on same device/browser
- Refresh the page
- Check if you're logged into correct account

**Encryption not working?**
- Check JavaScript is enabled
- Try modern browser (Chrome, Firefox, Safari, Edge)
- Check device has internet for crypto operations

## 📞 Quick Help

| Question | Answer |
|----------|--------|
| Is my data safe? | Yes, encrypted with bank-level security |
| Can you read my journal? | No, only you can decrypt it |
| Where is my data? | On your device only, not in the cloud |
| What if I forget password? | Your data is lost (we can't recover it) |
| Can I sync to another device? | Not yet (coming soon) |
| Is this a therapist? | No, it's a wellness support tool |
| What if I'm in crisis? | Call 988 (US) or your local emergency service |

## 🎓 Best Practices

1. **Journal daily** - Clearer patterns emerge
2. **Log mood regularly** - Track correlations
3. **Try meditation** - Build consistency
4. **Set goals** - Give yourself direction
5. **Use resources** - Learn new techniques
6. **Join community** - Get support and inspiration
7. **Be honest** - More authentic = better insights
8. **Back up password** - Use password manager

## 🎯 Common Workflows

### Morning Routine (5 minutes)
```
1. Log mood
2. Scan resources
3. Do 5-minute meditation
```

### Evening Journal (10 minutes)
```
1. Write journal entry
2. Log mood
3. Review goals
```

### Weekly Review (15 minutes)
```
1. Check mood trends
2. Review journal entries
3. Update goal progress
4. Read mental health article
```

### Emergency Support
```
1. Browse community posts
2. Read resources
3. Contact mental health professional
4. Call crisis line if needed
```

## 🔑 Keyboard Tips

- Tab through form fields
- Space/Enter to click buttons
- Arrow keys in dropdowns
- Esc to close modals

## 🌍 Language Support

Currently: English

Coming Soon: Spanish, French, German, Japanese

## 📈 Feature Availability

| Feature | Status |
|---------|--------|
| Authentication | ✅ Ready |
| Encryption | ✅ Ready |
| Journaling | ✅ Ready |
| Mood Tracking | ✅ Ready |
| Meditation | ✅ Ready |
| Goal Tracking | ✅ Ready |
| Therapist Directory | ✅ Ready |
| Community Forum | ✅ Ready |
| Resources | ✅ Ready |
| Settings | ✅ Ready |
| Real Therapist Booking | 🔜 Coming |
| Cloud Sync | 🔜 Coming |
| Mobile App | 🔜 Coming |
| Real AI | 🔜 Coming |

## 📚 Full Documentation

- **HEALYMATE_ARCHITECTURE.md** - Complete technical architecture
- **GETTING_STARTED.md** - Comprehensive user guide
- **BUILD_SUMMARY.md** - Build status and deployment

## 🎉 You're Ready!

The app is fully functional and ready to use. All your mental health data is:

✅ **Private** - Only accessible to you
✅ **Secure** - Encrypted with your password
✅ **Safe** - Stays on your device
✅ **Persistent** - Survives browser restarts
✅ **Free** - No costs or subscriptions

Start journaling, tracking your mood, and building better mental health habits today!

---

*Questions? Check GETTING_STARTED.md for the full FAQ*
*Technical details? See HEALYMATE_ARCHITECTURE.md*
*Deployment help? Check BUILD_SUMMARY.md*
