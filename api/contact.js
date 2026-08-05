export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, type, message, bot_field } = req.body;

  // Honeypot check
  if (bot_field) {
    return res.status(200).json({ success: true, message: 'Message sent' }); // Fake success for bots
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Attempt to use Resend API if key is present
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    // If no API key is configured, log the message and return success
    // This allows the UI to work while waiting for the user to configure their backend
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Type: ${type}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');
    console.warn('RESEND_API_KEY is not set. The message was logged but not emailed.');

    return res.status(200).json({
      success: true,
      message: 'Message processed locally (API key pending)'
    });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>', // Resend sandbox domain, change for prod
        to: 'vvibhansh@gmail.com', // Vibhansh's email
        subject: `New Inquiry from ${name} - ${type}`,
        reply_to: email,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${type}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      console.error('Resend API Error:', errorData);
      return res.status(500).json({ error: 'Failed to send email via provider.' });
    }
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
