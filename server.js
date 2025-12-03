require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const Sentry = require("@sentry/node");
const nodemailer = require('nodemailer');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Sentry
if (isProduction && process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
    });
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
}

// ============================================
// LOGGING
// ============================================
// ============================================
// LOGGING
// ============================================
const isVercel = process.env.VERCEL === '1';

// Only create logs directory if NOT on Vercel (Read-only FS)
const logsDir = isVercel ? '/tmp' : path.join(__dirname, 'logs');

if (!isVercel && !fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Access log stream - Only locally or on VPS
if (!isVercel) {
    const accessLogStream = fs.createWriteStream(
        path.join(logsDir, 'access.log'),
        { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
}

app.use(morgan('dev')); // Console logging (Captured by Vercel)

// ============================================
// SECURITY MIDDLEWARE
// ============================================
// Helmet for security headers (with CSP adjusted for inline styles/scripts)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "data:"],
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "'unsafe-eval'", 
                "https://cdn.jsdelivr.net", 
                "https://cdnjs.cloudflare.com", 
                "https://www.googletagmanager.com", 
                "https://www.google.com", 
                "https://www.gstatic.com"
            ],
            scriptSrcAttr: ["'unsafe-inline'"], // Allow inline event handlers
            imgSrc: ["'self'", "data:", "https:", "blob:", "https://www.google-analytics.com", "https://www.googletagmanager.com"],
            connectSrc: [
                "'self'", 
                "https://api.github.com", 
                "https://github-contributions-api.jogruber.de", 
                "https://www.google-analytics.com", 
                "https://www.googletagmanager.com", 
                "https://stats.g.doubleclick.net",
                "https://cdn.jsdelivr.net"
            ],
            frameSrc: ["'self'", "https:", "https://www.google.com"],
            objectSrc: ["'none'"],
            workerSrc: ["'self'"],
            upgradeInsecureRequests: isProduction ? [] : null,
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// ============================================
// RATE LIMITING
// ============================================
// General rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 API requests per windowMs
    message: { error: 'Too many API requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Contact form specific limiter (stricter)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact submissions per hour
    message: { error: 'Too many contact submissions. Please try again in an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

// ============================================
// COMPRESSION & PARSING
// ============================================
app.use(compression());
app.use(cors({
    origin: isProduction ? 'https://sameeralikhan.com' : '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// STATIC FILES WITH CACHING
// ============================================
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isProduction ? '1y' : '0',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Set cache headers based on file type
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        } else if (isProduction && filePath.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

// ============================================
// INPUT VALIDATION HELPERS
// ============================================
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

const sanitizeInput = (str) => {
    if (typeof str !== 'string') return '';
    return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 2000); // Limit length
};

const validateContactForm = (data) => {
    const errors = [];
    
    // Check honeypot (should be empty)
    if (data.website && data.website.trim() !== '') {
        return { valid: false, errors: ['Spam detected'], isSpam: true };
    }
    
    // Validate name
    const name = sanitizeInput(data.name);
    if (!name || name.length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    if (name.length > 100) {
        errors.push('Name must be less than 100 characters');
    }
    
    // Validate email
    const email = sanitizeInput(data.email);
    if (!email || !validateEmail(email)) {
        errors.push('Please provide a valid email address');
    }
    
    // Validate message
    const message = sanitizeInput(data.message);
    if (!message || message.length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    if (message.length > 2000) {
        errors.push('Message must be less than 2000 characters');
    }
    
    return {
        valid: errors.length === 0,
        errors,
        sanitized: { name, email, message }
    };
};

// ============================================
// API ROUTES
// ============================================

// Resume download
// Resume download
app.get('/api/download-resume', (req, res) => {
    // Use absolute path for safety
    const resumePath = path.resolve(__dirname, 'Sameer_Ali_Khan_Resume.pdf');
    
    // Check if file exists
    if (!fs.existsSync(resumePath)) {
        console.error('Resume file not found:', resumePath);
        return res.status(404).json({ error: 'Resume not found' });
    }
    
    // Log download
    console.log(`📄 Resume downloaded by ${req.ip} at ${new Date().toISOString()}`);
    
    // Set headers explicitly
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Sameer_Ali_Khan_Resume.pdf');
    
    res.download(resumePath, 'Sameer_Ali_Khan_Resume.pdf', (err) => {
        if (err) {
            console.error('Error downloading resume:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download resume' });
            }
        }
    });
});

// Activity Logging Endpoint
app.post('/api/log-activity', (req, res) => {
    try {
        const { eventType, details, timestamp } = req.body;
        
        const stmt = db.prepare('INSERT INTO analytics (event_type, details, ip, user_agent) VALUES (?, ?, ?, ?)');
        stmt.run(eventType, JSON.stringify(details), req.ip, req.get('User-Agent'), function(err) {
            if (err) {
                console.error('Error logging activity to DB:', err.message);
            }
        });
        stmt.finalize();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Activity logging error:', error);
        // Don't fail the request, just log error
        res.json({ success: false });
    }
});

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { recaptchaToken } = req.body;

        // Verify reCAPTCHA
        // Only verify if secret key is present (allows local testing without it if needed, but user asked for integration)
        // Ideally, we should enforce it.
        if (process.env.RECAPTCHA_SECRET_KEY) {
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
            
            try {
                const verifyRes = await fetch(verifyUrl, { method: 'POST' });
                const verifyData = await verifyRes.json();
                
                if (!verifyData.success || verifyData.score < 0.5) {
                    console.log(`🚫 reCAPTCHA failed: ${JSON.stringify(verifyData)}`);
                    return res.status(400).json({ success: false, message: 'Anti-spam verification failed.' });
                }
            } catch (err) {
                console.error('reCAPTCHA verification error:', err);
                // Fail open or closed? Closed for security.
                return res.status(500).json({ success: false, message: 'Verification service error.' });
            }
        }

        const validation = validateContactForm(req.body);
        
        // Check for spam
        if (validation.isSpam) {
            console.log(`🚫 Spam detected from ${req.ip}`);
            // Return success to not tip off spammers
            return res.json({ success: true, message: 'Message received!' });
        }
        
        // Return validation errors
        if (!validation.valid) {
            return res.status(400).json({ 
                success: false, 
                errors: validation.errors 
            });
        }
        
        const { name, email, message, subject } = req.body; // Get subject from body as well
        const sanitizedMessage = validation.sanitized.message;
        
        console.log(`📧 Contact form submission from ${name} (${email}) at ${new Date().toISOString()}`);
        
        // 1. Insert into Database (Promisified) - OPTIONAL / NON-BLOCKING
        let contactId = 'temp_' + Date.now();
        try {
            contactId = await new Promise((resolve, reject) => {
                const stmt = db.prepare('INSERT INTO contacts (name, email, subject, message, ip, user_agent, email_status) VALUES (?, ?, ?, ?, ?, ?, ?)');
                stmt.run(name, email, subject, sanitizedMessage, req.ip, req.get('User-Agent'), 'pending', function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                });
                stmt.finalize();
            });
            console.log(`✅ Contact saved to DB with ID: ${contactId}`);
        } catch (dbError) {
            console.error('⚠️ Database insertion failed (continuing to email):', dbError.message);
            // Continue execution - do not fail the request just because DB failed
        }

        // 2. Send Emails
        let emailStatus = 'skipped';
        let emailSentAt = null;

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            console.log('Attempting to send email...');
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // upgrade later with STARTTLS
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            // Verify connection configuration
            /*
            transporter.verify(function(error, success) {
                if (error) {
                    console.error('Email Server Error:', error);
                } else {
                    console.log('Email Server is ready to take our messages');
                }
            });
            */

            // Email to Admin (Sammy)
            const mailToAdmin = {
                from: process.env.SMTP_USER,
                to: 'sammysameerkhan007@gmail.com',
                subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
                text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${sanitizedMessage}`,
                html: `
                    <h3>New Contact Form Submission</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
                `
            };

            // Auto-reply to User
            const mailToUser = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Thank you for contacting Sameer Ali Khan',
                text: `Hi ${name},\n\nThank you for reaching out! I have received your message regarding "${subject || 'your inquiry'}" and will get back to you as soon as possible.\n\nBest regards,\nSameer Ali Khan`,
                html: `
                    <p>Hi ${name},</p>
                    <p>Thank you for reaching out! I have received your message regarding "<strong>${subject || 'your inquiry'}</strong>" and will get back to you as soon as possible.</p>
                    <br>
                    <p>Best regards,</p>
                    <p><strong>Sameer Ali Khan</strong></p>
                    <p><a href="https://sameeralikhan.com">sameeralikhan.com</a></p>
                `
            };

            // Send both emails
            try {
                await Promise.all([
                    transporter.sendMail(mailToAdmin),
                    transporter.sendMail(mailToUser)
                ]);
                console.log('📧 Emails sent successfully');
                emailStatus = 'sent';
                emailSentAt = new Date().toISOString();
            } catch (emailErr) {
                console.error('Failed to send emails:', emailErr);
                emailStatus = 'failed';
            }
        } else {
            console.log('⚠️ SMTP credentials not found. Emails not sent.');
            emailStatus = 'skipped_no_creds';
        }
        
        // 3. Update Database with Email Status (if DB worked)
        if (typeof contactId === 'number') {
            try {
                db.run('UPDATE contacts SET email_status = ?, email_sent_at = ? WHERE id = ?', [emailStatus, emailSentAt, contactId], (err) => {
                    if (err) console.error('Error updating email status:', err);
                    else console.log(`Updated contact ${contactId} with status: ${emailStatus}`);
                });
            } catch (dbUpdateError) {
                console.error('Error updating DB status:', dbUpdateError.message);
            }
        }
        
        res.json({ 
            success: true, 
            message: 'Thank you! Your message has been received. I\'ll get back to you soon!' 
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'An unexpected error occurred. Please try again later.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============================================
// IN-MEMORY CACHE (Performance Optimization)
// ============================================
const cache = {
    guestbook: [],
    stats: { total: 0, daily: {} },
    newsletter: [],
    newsletter: []
};

// Load data into memory on start
const loadCache = () => {
    try {
        // On Vercel, logsDir is /tmp, which is empty on cold start
        if (fs.existsSync(path.join(logsDir, 'guestbook.json'))) {
            cache.guestbook = JSON.parse(fs.readFileSync(path.join(logsDir, 'guestbook.json'), 'utf8'));
        }
        if (fs.existsSync(path.join(logsDir, 'visitor-stats.json'))) {
            cache.stats = JSON.parse(fs.readFileSync(path.join(logsDir, 'visitor-stats.json'), 'utf8'));
        }
        if (fs.existsSync(path.join(logsDir, 'newsletter-subscriptions.json'))) {
            cache.newsletter = JSON.parse(fs.readFileSync(path.join(logsDir, 'newsletter-subscriptions.json'), 'utf8'));
        }
        console.log('🚀 Data loaded into in-memory cache');
    } catch (err) {
        console.error('Error loading cache:', err);
    }
};

loadCache();

// Helper to persist data asynchronously
const persistData = (file, data) => {
    // On Vercel, we cannot write to the filesystem (except /tmp, but it's ephemeral)
    // So we skip persistence to avoid errors
    if (isVercel) return;

    fs.writeFile(path.join(logsDir, file), JSON.stringify(data, null, 2), (err) => {
        if (err) console.error(`Error saving ${file}:`, err);
    });
};

// Newsletter subscription endpoint
app.post('/api/newsletter', apiLimiter, (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Please provide a valid email address.' 
            });
        }
        
        // Check for duplicate in memory
        if (cache.newsletter.some(s => s.email === email)) {
            return res.json({ success: true, message: 'You\'re already subscribed!' });
        }
        
        cache.newsletter.push({
            email,
            timestamp: new Date().toISOString(),
            ip: req.ip
        });
        
        // Persist async
        persistData('newsletter-subscriptions.json', cache.newsletter);
        
        console.log(`📬 New newsletter subscription: ${email}`);
        res.json({ success: true, message: 'Thank you for subscribing!' });
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ success: false, error: 'Subscription failed. Please try again.' });
    }
});

// Guestbook endpoints
app.get('/api/guestbook', (req, res) => {
    // Serve from memory - Instant!
    res.json({ success: true, entries: cache.guestbook.slice(0, 50) });
});

app.post('/api/guestbook', apiLimiter, (req, res) => {
    try {
        const { name, message } = req.body;
        
        if (!name || name.length < 2 || name.length > 50) {
            return res.status(400).json({ success: false, error: 'Please provide a valid name.' });
        }
        
        if (!message || message.length < 3 || message.length > 500) {
            return res.status(400).json({ success: false, error: 'Please provide a valid message (3-500 characters).' });
        }
        
        const entry = {
            name: name.trim().substring(0, 50),
            message: message.trim().substring(0, 500),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            timestamp: new Date().toISOString()
        };
        
        cache.guestbook.unshift(entry);
        cache.guestbook = cache.guestbook.slice(0, 100); // Keep only last 100 entries
        
        // Persist async
        persistData('guestbook.json', cache.guestbook);
        
        console.log(`📝 New guestbook entry from ${name}`);
        res.json({ success: true, entry });
        
    } catch (error) {
        console.error('Guestbook error:', error);
        res.status(500).json({ success: false, error: 'Failed to save entry. Please try again.' });
    }
});

// Visitor counter endpoint
app.post('/api/visit', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update memory
    cache.stats.total++;
    cache.stats.daily[today] = (cache.stats.daily[today] || 0) + 1;
    
    // Persist async
    persistData('visitor-stats.json', cache.stats);
    
    res.json({ success: true, total: cache.stats.total });
});

app.get('/api/stats', (req, res) => {
    // Serve from memory - Instant!
    res.json({ success: true, visitors: cache.stats.total });
});

// GitHub Stats Endpoint

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sentry Error Handler (must be before any other error middleware)
if (isProduction && process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
}

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: isProduction ? 'Internal server error' : err.message 
    });
});

// ============================================
// START SERVER
// ============================================
// Graceful shutdown
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log('');
        console.log('╔════════════════════════════════════════════════════╗');
        console.log('║     🚀 SAMEER ALI KHAN - PORTFOLIO SERVER 🚀       ║');
        console.log('╠════════════════════════════════════════════════════╣');
        console.log(`║  🌐 Server:    http://localhost:${PORT}               ║`);
        console.log(`║  📄 Resume:    http://localhost:${PORT}/api/download-resume ║`);
        console.log(`║  🏥 Health:    http://localhost:${PORT}/api/health          ║`);
        console.log(`║  🔒 Mode:      ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}                       ║`);
        console.log(`║  📧 SMTP User: ${process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 3) + '***' : 'NOT SET'}                        ║`);
        console.log('╚════════════════════════════════════════════════════╝');
        console.log('');
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('Process terminated');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        console.log('SIGINT received. Shutting down gracefully...');
        server.close(() => {
            console.log('Process terminated');
            process.exit(0);
        });
    });
}

module.exports = app;
