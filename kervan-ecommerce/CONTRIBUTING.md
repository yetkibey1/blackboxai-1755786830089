# Contributing to KERVAN E-commerce Platform

Thank you for your interest in contributing to the KERVAN e-commerce platform! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Style Guidelines](#style-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [support@kervan.com](mailto:support@kervan.com).

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git
- npm or yarn

### Setting up the Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/kervan-ecommerce.git
   cd kervan-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**
- **Feature enhancements**
- **Documentation improvements**
- **Code refactoring**
- **Performance optimizations**
- **Security improvements**
- **Translation/Localization**

### Before You Start

1. Check existing issues and pull requests to avoid duplicates
2. Create an issue to discuss major changes before implementing
3. Fork the repository and create a feature branch
4. Follow our coding standards and guidelines

## 💻 Development Guidelines

### Branch Naming Convention

- `feature/feature-name` - for new features
- `bugfix/bug-description` - for bug fixes
- `hotfix/critical-fix` - for critical fixes
- `docs/documentation-update` - for documentation updates
- `refactor/code-improvement` - for code refactoring

### Commit Message Format

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat(auth): add password reset functionality
fix(api): resolve user registration validation error
docs(readme): update installation instructions
```

### Code Style

#### Backend (Node.js/Express)

- Use ES6+ features
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for functions
- Use meaningful variable and function names

```javascript
/**
 * Create a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Created user object
 */
const createUser = async (userData) => {
  try {
    // Implementation
  } catch (error) {
    throw new Error(`User creation failed: ${error.message}`);
  }
};
```

#### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Implement proper prop validation
- Add comments for complex logic

```jsx
/**
 * User profile component
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {Function} props.onUpdate - Update callback
 */
const UserProfile = ({ user, onUpdate }) => {
  // Implementation
};
```

### Database Guidelines

- Use descriptive model names
- Add proper validation
- Include timestamps
- Use indexes for frequently queried fields
- Add comments for complex schemas

### API Guidelines

- Follow RESTful conventions
- Use appropriate HTTP status codes
- Implement proper error responses
- Add input validation
- Include API documentation

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Add reviewers if known

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Fixes #(issue number)
```

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, etc.)
- **Screenshots or error logs**
- **Possible solutions** (if any)

### Feature Requests

When requesting features, please include:

- **Clear title and description**
- **Use case and motivation**
- **Proposed solution**
- **Alternative solutions considered**
- **Additional context**

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

### Writing Tests

- Write unit tests for new functions
- Write integration tests for API endpoints
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

```javascript
describe('User Authentication', () => {
  it('should create a new user with valid data', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Act
    const result = await createUser(userData);

    // Assert
    expect(result).toBeDefined();
    expect(result.email).toBe(userData.email);
  });
});
```

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new functions
- Update API documentation
- Include code examples where helpful

## 🌍 Internationalization

When adding new text content:

- Use translation keys instead of hardcoded strings
- Add translations for all supported languages (ka, en, tr)
- Follow existing translation patterns

## 🔒 Security

- Never commit sensitive information (API keys, passwords)
- Follow security best practices
- Report security vulnerabilities privately
- Use environment variables for configuration

## 📞 Getting Help

If you need help:

- Check existing documentation
- Search existing issues
- Create a new issue with the "question" label
- Contact the maintainers at [support@kervan.com](mailto:support@kervan.com)

## 🎉 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to KERVAN! 🚀
