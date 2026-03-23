import express from "express";
import { hashing } from "./helpers/hash.js";
import DOMPurify from "dompurify";
import { db } from "./db.js";
import validator from "email-validator";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    console.log("jansjn");
});
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const isValid = validator.validate(email);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid email" });
        }
        const hashedPass = await hashing(DOMPurify.sanitize(password));
        const exist = await db.users.findFirst({
            where: { email: email },
        });
        if (exist) {
            return res.status(409).json({ error: "User already exists" });
        }
        await db.users.create({
            data: {
                name: DOMPurify.sanitize(name),
                email: DOMPurify.sanitize(email),
                password: hashedPass,
            },
        });
        return res.status(201).json({ message: "ok" });
    }
    catch (error) {
        return res.status(500).json({ message: "something is wrong" });
    }
});
app.listen(3001, () => {
    console.log("server is running");
});
//# sourceMappingURL=server.js.map