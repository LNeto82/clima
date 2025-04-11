const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Cache simples em memória
const cache = {};

app.get('/recommendation/:city', async (req, res) => {
  const city = req.params.city;

  // Verifica cache (duração de 60s)
  if (cache[city] && (Date.now() - cache[city].timestamp < 60000)) {
    return res.json(cache[city].data);
  }

  try {
    // Faz chamada à API B (Python Flask)
    const response = await axios.get(`http://localhost:5000/weather/${city}`);
    const { city: cityName, temp, unit } = response.data;

    // Gera recomendação com base na temperatura
    let recommendation = '';
    if (temp > 30) {
      recommendation = 'Está muito quente! Hidrate-se e use protetor solar.';
    } else if (temp > 15) {
      recommendation = 'Clima agradável, aproveite seu dia!';
    } else {
      recommendation = 'Está frio, não esqueça o casaco!';
    }

    const data = { city: cityName, temp, unit, recommendation };

    // Armazena no cache
    cache[city] = { data, timestamp: Date.now() };

    res.json(data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Cidade não encontrada na API B' });
    } else {
      res.status(500).json({ error: 'Erro ao consultar API B' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`API A rodando em http://localhost:${PORT}`);
});
