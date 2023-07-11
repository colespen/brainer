"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const router = express_1.default.Router();
router.get('/highscores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const highscores = yield (0, db_1.query)('SELECT * FROM highscore ORDER BY score DESC');
        res.json(highscores);
    }
    catch (error) {
        console.error('Error fetching highscores:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
router.post('/highscores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, score } = req.body;
    if (!name || !score) {
        res.status(400).json({ message: 'Name and score are required' });
        return;
    }
    try {
        yield (0, db_1.query)('INSERT INTO highscore (name, score) VALUES ($1, $2)', [name, score]);
        res.status(201).json({ message: 'Highscore created' });
    }
    catch (error) {
        console.error('Error creating highscore:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));
exports.default = router;
