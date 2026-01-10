# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please **do not** create a public GitHub issue. Instead:

1. **Email:** security@claimpoint.app
2. **Include:**

   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Your contact information

3. **Timeline:**
   - We will acknowledge receipt within 24 hours
   - We will work to resolve critical vulnerabilities within 7 days
   - We will keep you updated on our progress

## Security Features

### Authentication & Authorization

- ✅ JWT token-based authentication
- ✅ bcryptjs password hashing (10 salt rounds)
- ✅ Role-based access control (RBAC)
- ✅ OTP email verification on registration
- ✅ Session expiration
- ✅ Secure cookie storage

### Data Protection

- ✅ Sensitive data encryption (hidden details backend-only)
- ✅ Public/private data separation
- ✅ UUID primary keys (non-sequential IDs)
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection (React sanitization)
- ✅ CSRF protection

### API Security

- ✅ Input validation on all endpoints
- ✅ Rate limiting on auth endpoints
- ✅ HTTPS enforcement (production)
- ✅ CORS configuration
- ✅ Request size limits
- ✅ Error message sanitization

### Database Security

- ✅ PostgreSQL with encrypted connections
- ✅ Foreign key constraints
- ✅ Transaction support for critical operations
- ✅ Automated backups (recommended)
- ✅ Access control via environment variables
- ✅ Prepared statements (via ORM)

### Infrastructure Security

- ✅ Environment variables for sensitive data
- ✅ No credentials in version control (.gitignore)
- ✅ Dependency vulnerability scanning (npm audit)
- ✅ Secure external service integrations
- ✅ Cloudinary secure API usage
- ✅ Email service authentication

## Security Best Practices

### For Users

- Use strong, unique passwords
- Enable email verification
- Don't share login credentials
- Report suspicious activity

### For Developers

- Keep dependencies updated: `npm audit fix`
- Use `.env` for sensitive configuration
- Never commit credentials
- Validate all user inputs
- Use HTTPS in production
- Enable CORS only for trusted domains
- Review logs for suspicious activity

### For Administrators

- Regularly update software
- Monitor access logs
- Rotate credentials periodically
- Backup data regularly
- Use strong database passwords
- Restrict staff access levels appropriately
- Review user activities

## Vulnerability Response

We take security seriously and will:

1. Investigate all reports promptly
2. Work towards a fix in private
3. Notify users if their data is affected
4. Release patches as soon as possible
5. Credit the researcher (if they wish)

## Supported Versions

| Version | Status      | Support Until |
| ------- | ----------- | ------------- |
| 1.0.0   | Active      | 2027-01-10    |
| < 1.0.0 | Unsupported | -             |

## Security Updates

- Subscribe to release notifications
- Check [CHANGELOG.md](./CHANGELOG.md) for security patches
- Apply updates promptly
- Report any issues after updates

## Third-Party Dependencies

We use the following external services:

- **Cloudinary** - Image hosting (review their security at: https://cloudinary.com/trust)
- **HuggingFace** - AI models (review their policies)
- **Nodemailer** - Email delivery (uses SMTP)
- **PostgreSQL** - Database (community supported)

For each dependency, we:

- Keep versions updated
- Monitor security advisories
- Review change logs before updates
- Test updates in development first

## Compliance

- 📋 Follows OWASP top 10 security practices
- 🔒 Implements industry-standard encryption
- 📝 Maintains audit logs
- 🛡️ Regular security reviews

## Questions?

If you have security questions or concerns:

- 📧 Email: security@claimpoint.app
- 📖 Check [documentation](./docs/README_COMPREHENSIVE.md#security-features)
- 💬 Open an issue with "security" label

Thank you for helping keep ClaimPoint secure! 🙏
