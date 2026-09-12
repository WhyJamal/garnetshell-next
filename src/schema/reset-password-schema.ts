import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Неправильная электронная почта"),
    code: z.string().length(6, "Код должен содержать 6 цифр"),
    password: z.string().min(8, "Пароль должен содержать не менее 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
