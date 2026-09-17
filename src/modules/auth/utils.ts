import { cookies as nextCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export async function generateAuthCookie({ prefix, value }: Props) {
  const cookies = await nextCookies();
  cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    path: "/",
    //   sameSite: "none",
    // domain:""
    // TODO: ensure cross domain cookie sharing
  });
}
