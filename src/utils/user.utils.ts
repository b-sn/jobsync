import "server-only";
import { auth } from "@/auth";
import { CurrentUser } from "@/models/user.model";

export const getCurrentUser = async () => {
  const session = await auth();
  if (!session?.accessToken) return null;
  const { sub, name, email, locale, iat, exp } = session?.accessToken;
  const user: CurrentUser = {
    id: sub,
    name,
    email,
    locale,
    iat,
    exp,
  };
  return user;
};
