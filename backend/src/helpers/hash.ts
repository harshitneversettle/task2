import bcrypt from "bcrypt";

export async function hashing(password: string) {
  const hashedPass = await bcrypt.hash(password, 10);
  return hashedPass;
}
