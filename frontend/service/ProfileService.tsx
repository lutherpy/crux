import axios from 'axios';
import { BaseService } from './BaseService';

export class ProfileService extends BaseService {
    constructor() {
        super('/profiles');
    }
}
