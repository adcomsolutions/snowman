import { mergeOptions } from './utils.js';
import defaultConfig from '../config/default.js';

import dotenv from 'dotenv';

dotenv.config();

const envConfig = {};

export default mergeOptions(defaultConfig, envConfig);
