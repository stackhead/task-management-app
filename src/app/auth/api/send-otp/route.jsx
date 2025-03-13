import { Resend } from "resend";

const resend = new Resend(process.env.re_8dmfdGbo_DVhMgk7o7g1yLW655owGVxRh);

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    await resend.emails.send({
      from: "abubakaresta@gmail.com", // Replace with verified email
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP code is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });

    return Response.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return Response.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
  }
}
