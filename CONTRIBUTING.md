The ClaimPoint project is open source. We welcome contributions!

## How to Contribute

### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/claimpoint-smart-lost-found.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Setup development environment: `npm run setup`

### Development

```bash
# Install dependencies
npm run setup

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Making Changes

1. **Code Style:** Follow existing code patterns
2. **Commits:** Write clear commit messages (`git commit -m 'Add feature: description'`)
3. **Branch:** Use meaningful branch names (`feature/`, `bugfix/`, `docs/`)
4. **Testing:** Test your changes locally before submitting PR

### Submitting a Pull Request

1. Push to your fork
2. Open a Pull Request with:
   - Clear title describing the change
   - Description of what was changed and why
   - Link to related issues (if any)
3. Ensure all tests pass and CI checks are green

### Reporting Bugs

Found a bug? Please open an issue with:

- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

### Suggesting Enhancements

Have an idea? Open an issue with:

- Clear description of the enhancement
- Why it would be useful
- Possible implementation approach (if you have one)

## Code Guidelines

### JavaScript/React

- Use ES6+ syntax
- Use functional components and hooks
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Backend (Node.js)

- Use async/await
- Handle errors properly
- Add input validation
- Log meaningful messages

### Database

- Use Drizzle ORM
- Add migrations for schema changes
- Document complex queries

### Documentation

- Keep README updated
- Document API changes
- Add examples for new features
- Update CHANGELOG

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with coverage
npm test -- --coverage
```

## Questions?

- 📖 Check the [documentation](./docs/README_COMPREHENSIVE.md)
- 💬 Open an issue with the question label
- 📧 Email: support@claimpoint.app

Thank you for contributing! 🙏
