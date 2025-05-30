const AdminInstructions = () => {
  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h2>Instructions for the Admin Website</h2>
      <ol>
        <li>
          <strong>Log in</strong> with your admin account via <code>login</code>.
        </li>
        <li>
          <strong>Register a new account</strong>: In the <strong>Login</strong> form, you’ll find a link to register a new account. You can register by providing a name, password, and a secret key which must already exist before <code>login</code>.
        </li>
        <li>
          <strong>Manage games</strong>: Go to <code>games list</code> to view all games, <code>Add game</code> to add new games, and <code>Edit games</code> to update or delete games.
        </li>
        <li>
          <strong>Manage users</strong>: On the <code>Profile page</code> you can view and update user profiles, including changing your admin name or password.
        </li>
        <li>
          <strong>Manage orders</strong>: Under <code>Admin order</code>, you can manage customer orders and their statuses.
        </li>
        <li>
          <strong>Log out</strong> when you're done to keep your account secure.
        </li>
      </ol>

      <p>
        If you experience any issues, contact the system administrator or support at <code>support@kashef.com</code>.
      </p>
    </div>
  );
};

export default AdminInstructions;
