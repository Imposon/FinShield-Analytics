import { Request, Response } from 'express';
import { db } from '../utils/Database';

export class UserController {
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            
            if (!name || !email || !password) {
                res.status(400).json({ success: false, message: 'Missing required fields' });
                return;
            }

            const existing = await db('USERS').where('email', email).first();
            if (existing) {
                res.status(409).json({ success: false, message: 'Email already registered' });
                return;
            }

            const [userId] = await db('USERS').insert({
                name,
                email,
                password,
                role: 'analyst',
                created_at: new Date()
            });

            const user = await db('USERS').where('user_id', userId).first();
            
            res.status(201).json({
                success: true,
                data: {
                    userId: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                res.status(400).json({ success: false, message: 'Missing credentials' });
                return;
            }

            const user = await db('USERS').where('email', email).first();
            
            if (!user || user.password !== password) {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
                return;
            }

            res.json({
                success: true,
                data: {
                    userId: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            const user = await db('USERS').where('user_id', userId).first();
            
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }

            res.json({
                success: true,
                data: {
                    userId: user.user_id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
}

export default UserController;
