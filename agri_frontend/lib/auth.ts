import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server';
const JWT_SECRET = process.env.JWT_SECRET || 'NishanthKJ'

export function signToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET)
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}
export function generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}


export function getTokenFromRequest(req: NextRequest): string {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("Unauthorized");
    return token;
}