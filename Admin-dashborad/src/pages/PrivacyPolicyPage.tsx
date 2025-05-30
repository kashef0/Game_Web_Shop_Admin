const PrivacyPolicy = () => {
  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <h2 className="mb-4">Privacy Policy</h2>

      <p>
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your personal information when using our website.
      </p>

      <h4 className="mt-4">1. What information we collect</h4>
      <ul>
        <li>Name and email address during registration or login</li>
        <li>Password (stored encrypted, we cannot see it)</li>
        <li>Profile picture if you upload one</li>
        <li>Administrator identification via admin secret</li>
        <li>Game data or other activity linked to your account</li>
      </ul>

      <h4 className="mt-4">2. How we use the information</h4>
      <ul>
        <li>To authenticate and securely log you in</li>
        <li>To display and update your user profile</li>
        <li>To store and show your uploaded images</li>
        <li>To save and show your game activity</li>
        <li>To improve the user experience</li>
      </ul>

      <h4 className="mt-4">3. Storage and protection</h4>
      <ul>
        <li>We store your data in a secure database</li>
        <li>We use HTTPS and token-based authentication</li>
        <li>Only authorized personnel have access to the data</li>
      </ul>

      <h4 className="mt-4">4. Cookies</h4>
      <p>
        We use cookies to manage session data. By using the website, you agree to this.
      </p>

      <h4 className="mt-4">5. Third parties</h4>
      <p>
        We do not share your personal information with third parties. Any images or data are stored only in our own systems.
      </p>

      <h4 className="mt-4">6. Your rights</h4>
      <ul>
        <li>Request to see what data we have about you</li>
        <li>Request correction or deletion of your data</li>
        <li>Unregister and delete your account</li>
      </ul>

      <h4 className="mt-4">7. Contact</h4>
      <p>
        If you have questions about this privacy policy, contact us at:
        <br />
        <a href="mailto:support@kashef.se">support@kashef.se</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
