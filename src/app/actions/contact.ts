"use server";

import { Resend } from "resend";
import { z } from "zod";


const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function sendEmail(prevState: any, formData: FormData) {
    const validatedFields = schema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, message } = validatedFields.data;

    try {
        if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error("Email delivery is not configured.");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: process.env.CONTACT_EMAIL || "submissions@cavicfestival.africa",
            subject: `New Contact Form Submission from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
            replyTo: email,
        });
        if (error) throw new Error(error.message);

        return { success: true };
    } catch (error) {
        return {
            error: {
                _form: ["Failed to send email. Please try again."],
            },
        };
    }
}
