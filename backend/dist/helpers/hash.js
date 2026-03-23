import bcrypt from "bcrypt";
export async function hashing(password) {
    const hashedPass = await bcrypt.hash(password, 10);
    return hashedPass;
}
//# sourceMappingURL=hash.js.map