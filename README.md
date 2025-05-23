# SecureWeb Simple Auth Example

## Backend Setup

1. Install backend dependencies:
   ```
   npm install express nodemailer body-parser dotenv cors
   ```

2. **Create a `.env` file** in the backend root with your SMTP credentials:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```

3. **Create an empty `users.json` file** in the backend root:
   ```
   []
   ```

4. Start the backend server:
   ```
   node server.js
   ```

## Frontend Setup

1. Go to the `frontend` folder:
   ```
   cd frontend
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. If you see an error about missing `@vitejs/plugin-react`, run:
   ```
   npm install @vitejs/plugin-react --save-dev
   ```

4. If you get permission errors, fix them with:
   ```
   sudo chown -R $USER:$GROUP .
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open the URL shown in the terminal (usually http://localhost:5173).

## Endpoints

- `POST /signup` with `{ email, password }`
- `POST /verify-signup` with `{ email, code }`
- `POST /login` with `{ email, password }`
- `POST /verify-login` with `{ email, code }`

## Notes

- The backend runs on port 3000 by default.
- The frontend expects the backend at `http://localhost:3000`.
- Never commit your `.env` or `users.json` file to public repositories.
- For Gmail, you may need to use an App Password if 2FA is enabled.

## How to Enable SMTP for Gmail

1. **Enable 2-Step Verification** on your Google account:  
   Go to [Google Account Security](https://myaccount.google.com/security) and turn on 2-Step Verification.

2. **Create an App Password**:  
   - Go to [App Passwords](https://myaccount.google.com/apppasswords) after enabling 2-Step Verification.
   - Select "Mail" as the app and "Other" as the device.
   - Click "Generate" and copy the 16-character password.

3. **Update your `.env` file**:  
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password   # Use the app password, not your regular password
   ```

4. **Restart your backend server** after updating the `.env` file.