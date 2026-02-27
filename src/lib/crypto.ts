import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function getKey() {
	const s = process.env.ENCRYPTION_SECRET ?? "";
	return Buffer.from(s.padEnd(32, "0").slice(0, 32));
}

export function encrypt(text: string): string {
	const iv = randomBytes(16);
	const c = createCipheriv("aes-256-gcm", getKey(), iv);
	const enc = Buffer.concat([c.update(text, "utf8"), c.final()]);
	return JSON.stringify({
		iv: iv.toString("base64"),
		enc: enc.toString("base64"),
		tag: c.getAuthTag().toString("base64"),
	});
}

export function decrypt(data: string): string {
	const { iv, enc, tag } = JSON.parse(data);
	const d = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(iv, "base64"));
	d.setAuthTag(Buffer.from(tag, "base64"));
	return d.update(Buffer.from(enc, "base64")).toString("utf8") + d.final("utf8");
}
