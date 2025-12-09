# Contributors

Welcome to the allProfanity project! We're excited to have you here and grateful for your interest in contributing to making profanity detection better for everyone.

## Our Contributors

Thank you to all the amazing people who have contributed to this project:

<!-- Add your name below this line -->
- Your Name (@your-github-username)
<!-- Keep the list alphabetically sorted -->

---

## How to Contribute

We welcome contributions of all kinds! Here are some ways you can help:

- Add support for new languages
- Improve existing word lists
- Enhance detection algorithms
- Fix bugs
- Improve documentation
- Add or improve test cases

## Adding a New Language

When adding support for a new language, please follow these important guidelines:

### Required Steps:

1. **Add the word list** for the new language in the appropriate location
2. **Update the configuration** to include the new language
3. **Write comprehensive test cases** for the new language
   - Include tests for common profane words
   - Include tests for edge cases
   - Include tests for false positives (words that should NOT be flagged)
4. **Run all tests** and ensure they pass
5. **Take a screenshot** of the passing tests
6. **Attach the screenshot** to your Pull Request

### Example Test Structure:

```typescript
describe('Language: YourLanguage', () => {
  it('should detect profanity', () => {
    // Your test cases
  });

  it('should not flag clean words', () => {
    // Your test cases
  });
});
```

## Pull Request Guidelines

When submitting a Pull Request, please:

1. **Provide a clear description** of what your PR does
2. **Reference any related issues** (e.g., "Fixes #123")
3. **Include test results** - attach a screenshot showing all tests passing
4. **Follow the existing code style** and conventions
5. **Keep changes focused** - one feature/fix per PR
6. **Update documentation** if you're adding new features

## Testing Your Changes

Before submitting a PR:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting (if applicable)
npm run lint

# Build the project
npm run build
```

Make sure all tests pass and take a screenshot to include in your PR!

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community

## Questions or Need Help?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues and PRs before creating new ones

## Recognition

All contributors will be recognized in this file and in our release notes. Your contributions, no matter how small, are valuable and appreciated!

---

Thank you for making allProfanity better! 🎉
