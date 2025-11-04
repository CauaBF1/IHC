import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Importando a biblioteca oficial
import multer from 'multer';
import fs from 'fs';
import Papa from 'papaparse';
import db from './database.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Históricos temporários em memória
const tempChatHistory = {}; // { sessionId: [{ message, response, chatType }] }


// --- Configuração do upload (para CSV) ---
const upload = multer({ dest: 'uploads/' });

// Verificação da chave de API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Erro: GEMINI_API_KEY não está definida no seu arquivo .env");
  process.exit(1); // Encerra o processo se a chave não estiver configurada
}

// Configuração da Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Escolha o modelo que deseja usar.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });


const PORT = process.env.PORT || 3000; // Usando 3001 como padrão se PORT não estiver no .env

app.post('/chat', async (req, res) => {
  const { userId, message, chatType } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'A mensagem é obrigatória no corpo da requisição.' });
  }

  try {

    // --- 1. Buscar histórico do usuário ---
    const history = db
      .prepare(`SELECT message, response FROM chat_history WHERE user_id = ? AND chat_type = ? ORDER BY id DESC LIMIT 5`)
      .all(userId, chatType);
    //console.log("historico de conversas: ", history);
    const historyText = history
      .map(h => `Usuário: ${h.message}\nAssistente: ${h.response}`)
      .reverse() // para mostrar do mais antigo para o mais recente
      .join('\n');

    // --- 2. Definir estilo de conversa ---
    const chatStyles = {
      general: "Leia as mensagens anteriores e responda ao que o usuário está falando levando em consideração o contexto das mensagens anteriores",
      csv: "Ajude o usuário a entender e interpretar os dados enviados no CSV. Considere os resultados dos outros dados do usuário.",
      sleep: "O usuário pode estar enfrentando alguma dificuldade para dormir. Considere perguntar como tem sido as noites de sono."
    };
    const stylePrompt = chatStyles[chatType] || "Seja prestativo e educado.";

    // --- 3. Montar prompt para Gemini ---
    const prompt = `${stylePrompt} Histórico recente: ${historyText || '(Sem histórico anterior)'} Usuário: "${message}"`;
    // Chamada à API Gemini usando a biblioteca oficial
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text(); // O método .text() extrai o texto da resposta
    // Chame esta função ao iniciar o servidor para depuração
    //listAvailableModels();

    res.json({ reply });
  } catch (err) {
    console.error('Erro ao chamar Gemini:', err); // A biblioteca lida com erros de forma mais direta
    res.status(500).json({ error: 'Erro ao chamar Gemini' });
  }
});

app.post('/upload-csv', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(csvContent, { header: true });
    fs.unlinkSync(filePath); // apaga o arquivo temporário

    const dataPreview = JSON.stringify(parsed.data.slice(0,10));

    const prompt = `
      Você é um assistente que analisa dados do Samsung Health.
      Aqui estão os primeiros registros de um CSV: ${dataPreview}

      1. Escolha a segunda coluna (day_time) e a sexta coluna (count). 
      2. O gráfico será a quantidade de passos dados por dia (dia no eixo X e passos no eixo Y).
      3. Retorne **apenas um JSON válido** neste formato:
      {
        "labels": ["day_time", "count"],
        "data": [valor1, valor2],
        "explanation": "Texto explicando sobre a saúde da pessoa a partir dos dados. Lembrando que a pessoa pode ser leiga no assunto e em computação."
      }
      `;

    // Chamada ao Gemini
    const result = await model.generateContent(prompt);

    // Extrai o texto da resposta
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    console.log("Texto cru retornado pelo Gemini:", text);

    // Remove aspas triplas e espaços extras
    const cleaned = text
      .replace(/^```json\s*/i, '')  // remove ```json do início se existir
      .replace(/^'''|'''$/g, '')    // remove aspas triplas
      .replace(/```$/g, '')         // remove ``` do fim
      .trim();

    console.log("Texto limpo:", cleaned);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleaned);
    } catch (e) {
      console.warn("Falha ao fazer JSON.parse(), retornando fallback:", e);
      parsedResponse = { labels: [], data: [], explanation: text };
    }

    console.log("JSON final:", parsedResponse);
    res.json(parsedResponse);

  } catch (err) {
    console.error('Erro ao processar CSV:', err);
    res.status(500).json({ error: 'Erro ao processar CSV' });
  }
});

// --- Salvar mensagem e resposta ---
app.post('/save-message', (req, res) => {
  const { userId, message, response, chatType } = req.body;
  if (!userId || !message || !response) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  try {
    db.prepare(
      `INSERT INTO chat_history (user_id, message, response, chat_type) VALUES (?, ?, ?, ?)`
    ).run(userId, message, response, chatType);

    res.send({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar mensagem:', err);
    res.status(500).json({ error: 'Falha ao salvar mensagem no banco' });
  }
});

// --- Buscar histórico do usuário ---
app.get('/get-history/:userId/:chatType', (req, res) => {
  const { userId, chatType } = req.params;
  try {
    const rows = db
      .prepare(`SELECT * FROM chat_history WHERE user_id = ? AND chat_type = ? ORDER BY timestamp ASC`)
      .all(userId, chatType);

    res.send(rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: 'Falha ao buscar histórico' });
  }
});


//Chat temporário
app.post('/chat-temp', async (req, res) => {
  const { sessionId, message, chatType } = req.body;
  // console.log("Dados de entrada: ", sessionId, message, chatType);
  if (!sessionId || !message || !chatType) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes (sessionId, message, chatType).' });
  }

  try {
    // --- 1. Buscar histórico temporário ---
   // console.log("Buscando histórico temporário.......");
    const history = tempChatHistory[sessionId] || [];
    const historyText = history
      .map(h => `Usuário: ${h.message}\nAssistente: ${h.response}`)
      .reverse()
      .join('\n');

    // --- 2. Estilo de conversa ---
    const chatStyles = {
      general: "Converse livremente com o usuário, de forma amigável.",
      csv: "Ajude o usuário a entender e interpretar os dados enviados no CSV."
    };
    const stylePrompt = chatStyles[chatType] || "Seja prestativo e educado.";

    // --- 3. Prompt para o Gemini ---
    const prompt = `
      ${stylePrompt}

      Histórico temporário:
      ${historyText || '(Sem histórico anterior)'}

      Usuário: "${message}"
      `;

    // --- 4. Chamada ao Gemini ---
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    // --- 5. Salvar histórico temporário ---
    if (!tempChatHistory[sessionId]) tempChatHistory[sessionId] = [];
    tempChatHistory[sessionId].push({ message, response: reply, chatType });

    res.json({ reply });
  } catch (err) {
    console.error('Erro no /chat-temp:', err);
    res.status(500).json({ error: 'Erro ao processar a conversa temporária' });
  }
});

// --- Salvar CSV processado no banco ---
app.post('/save-csv', (req, res) => {
  const { userId, fileType, jsonData } = req.body;

  if (!userId || !fileType || !jsonData) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes (userId, fileType, jsonData).' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO user_csv_data (user_id, file_type, json_content)
      VALUES (?, ?, ?)
    `);
    stmt.run(userId, fileType, JSON.stringify(jsonData));
    res.status(200).json({ message: 'CSV salvo com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar CSV:', err);
    res.status(500).json({ error: 'Erro ao salvar CSV no banco' });
  }
});

// --- Buscar CSVs de um usuário e tipo específico ---
app.get('/get-csv/:userId/:fileType', (req, res) => {
  const { userId, fileType } = req.params;

  try {
    const stmt = db.prepare(`
      SELECT * FROM user_csv_data
      WHERE user_id = ? AND file_type = ?
      ORDER BY uploaded_at DESC
    `);
    const rows = stmt.all(userId, fileType);
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar CSV:', err);
    res.status(500).json({ error: 'Erro ao buscar CSV no banco' });
  }
});


// 🔹 Rota de registro
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user_id = uuidv4();
    if (!username || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  try {
    
    const stmt = db.prepare(`INSERT INTO user_profile (user_id, username, password) VALUES (?, ?, ?)`);
    stmt.run(user_id, username, password);
    res.json({ success: true, username });
    console.log("Usuário salvo!")
  } catch (err) {
    console.error('❌ Erro ao registrar usuário:', err);
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ success: false, message: 'Usuário já existe.' });
    }
    res.status(500).json({ success: false, message: 'Erro ao registrar usuário.' });
  }
});

// 🔹 Rota de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
   if (!username || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }
  console.log(`username and password: `, username, password)
  try {
    const users = db.prepare('SELECT * FROM user_profile').all();
    //console.log('Usuários cadastrados:', users);

    // Busca usuário no banco
    const stmt = db.prepare('SELECT * FROM user_profile WHERE username = ? and password = ?');
    const user = stmt.get(username, password);
    // Verifica se o usuário existe e a senha confere
    if (!user || user.password !== password) {
      console.log(`user.password e password: `, user.password, password)
      return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos' });
    }

    // Login OK
    res.json({ success: true, user_id: user.user_id, username: user.username, password: user.password });
  } catch (err) {
    // Loga o erro no servidor e retorna 500
    console.error('Erro no login:', err);
    res.status(500).json({ success: false, message: 'Erro ao realizar login.' });
  }
});

app.post('/save-diary', (req, res) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes (userId, content).' });
  }

  try {
    db.prepare(`
      INSERT INTO diary (user_id, content)
      VALUES (?, ?)
    `).run(userId, content);

    res.status(200).json({ success: true, message: 'Anotação salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar anotação:', err);
    res.status(500).json({ error: 'Erro ao salvar anotação no banco.' });
  }
});

// --- Buscar anotações de um usuário ---
app.get('/get-diary/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    const notes = db.prepare(`
      SELECT id, content, created_at
      FROM diary
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId);

    res.json(notes);
  } catch (err) {
    console.error('Erro ao buscar anotações:', err);
    res.status(500).json({ error: 'Erro ao buscar anotações.' });
  }
});

// --- Excluir uma anotação ---
app.delete('/delete-diary/:noteId', (req, res) => {
  const { noteId } = req.params;

  try {
    db.prepare(`DELETE FROM diary WHERE id = ?`).run(noteId);
    res.json({ success: true, message: 'Diario excluída com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir anotação:', err);
    res.status(500).json({ error: 'Erro ao excluir anotação.' });
  }
});


app.listen(PORT, () =>
  console.log(`✅ Backend rodando em http://localhost:${PORT}`)
);

