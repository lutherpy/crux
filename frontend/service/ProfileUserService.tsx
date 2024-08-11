import axios from 'axios';
import { BaseService } from './BaseService';

export class ProfileUserService extends BaseService {
    constructor() {
        super('/profileuser');
    }
}
