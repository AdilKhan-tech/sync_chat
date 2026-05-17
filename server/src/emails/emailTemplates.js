const WelcomeEmailTemplate = ({
  name = "Nasir Khan",
  clientURL = "https://sync-chat-f3aib.sevalla.app/",
}) => {
  return `
  <div style="background:#f3f4f6;padding:40px;font-family:Arial">
    <div style="max-width:600px;margin:auto;background:#fff;border-radius:20px;overflow:hidden">

      <div style="background:black;color:white;padding:30px;text-align:center">
        <h1 style="margin:0;font-size:32px;">Welcome!</h1>
        <p style="color:#ccc;margin-top:10px;">
          Welcome to your new chat application 🚀
        </p>
      </div>

      <div style="padding:30px;color:#333">

        <h2 style="font-size:22px;">Hi ${name},</h2>

        <p style="line-height:1.6;margin-bottom:20px;">
          Thank you for joining our chat platform. Your account has been created successfully.
        </p>

        <div style="background:#f9fafb;border:1px solid #e5e7eb;padding:20px;border-radius:12px;margin-bottom:20px">
          <h3 style="margin-bottom:10px;">What you can do</h3>
          <ul>
            <li>Create private chats</li>
            <li>Send real-time messages</li>
            <li>Share files and media</li>
          </ul>
        </div>

        <div style="text-align:center;margin:30px 0">
          <a href="${clientURL}"
             style="background:black;color:white;padding:12px 24px;
             text-decoration:none;border-radius:10px;display:inline-block">
            Start Chatting
          </a>
        </div>

        <p style="color:#666;font-size:14px">
          Need help? Contact support anytime.
        </p>

      </div>

      <div style="text-align:center;padding:20px;font-size:12px;color:#888;background:#f9fafb">
        © 2026 Your Chat App. All rights reserved.
      </div>

    </div>
  </div>
  `;
};

export default WelcomeEmailTemplate;