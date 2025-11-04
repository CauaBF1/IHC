import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
// 🔑 coloque sua API KEY aqui ou use variável de ambiente
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const result = await model.generateContent("Me diga um número aleatório de 1 a 10");
    console.log("Resposta:", result.response.text());
  } catch (err) {
    console.error("Erro:", err);
  }
}

run();
