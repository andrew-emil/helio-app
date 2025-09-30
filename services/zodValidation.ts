import { z } from "zod";

//register schema
export const registerSchema = z.object({
    username: z.string()
        .min(3, { message: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }),
    email: z
        .email({ message: "البريد الإلكتروني غير صالح" }),
    password: z.string()
        .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

export type RegisterData = z.infer<typeof registerSchema>;

//login schema
export const loginSchema = z.object({
    email: z
        .email("البريد الإلكتروني غير صالح"),
    password: z
        .string()
        .min(1, "كلمة المرور مطلوبة")
        .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginFormData = z.infer<typeof loginSchema>;