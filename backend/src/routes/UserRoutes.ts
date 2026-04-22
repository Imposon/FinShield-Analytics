import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export class UserRoutes {
    public router: Router;
    private controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.post('/register', this.controller.register);
        this.router.post('/login', this.controller.login);
        this.router.get('/profile/:id', this.controller.getProfile);
    }
}

export default UserRoutes;
