"use server";

import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        await resend.emails.send({
            from: "Festival Contact Form <onboarding@resend.dev>",
            to: process.env.CONTACT_EMAIL || "your-email@example.com",
            subject: `New Contact Form Submission from ${name}`,
            text: `
Name: ${name}
Email: ${email}
Message: ${message}
      `,
            replyTo: email,
        });

        return { success: true };
    } catch (error) {
        return {
            error: {
                _form: ["Failed to send email. Please try again."],
            },
        };
    }
}
