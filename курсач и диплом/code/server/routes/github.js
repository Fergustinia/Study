const express = require('express');
const router = express.Router();
const axios = require('axios');
const GitHubRepo = require('../models/GitHubRepo');
const auth = require('../middleware/auth');

// Поиск репозиториев на GitHub
router.get('/search', auth, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/search/repositories', {
      params: {
        q: req.query.q,
        sort: 'stars',
        order: 'desc',
      },
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Привязать репозиторий к проекту
router.post('/projects/:projectId/github', auth, async (req, res) => {
  try {
    const { repoId } = req.body;
    const response = await axios.get(`https://api.github.com/repositories/${repoId}`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const repo = new GitHubRepo({
      projectId: req.params.projectId,
      repoId: response.data.id,
      name: response.data.name,
      fullName: response.data.full_name,
      description: response.data.description,
      htmlUrl: response.data.html_url,
    });

    const savedRepo = await repo.save();
    res.status(201).json(savedRepo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Получить все привязанные репозитории проекта
router.get('/projects/:projectId/github', auth, async (req, res) => {
  try {
    const repos = await GitHubRepo.find({ projectId: req.params.projectId });
    res.json(repos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отвязать репозиторий от проекта
router.delete('/projects/:projectId/github/:repoId', auth, async (req, res) => {
  try {
    const repo = await GitHubRepo.findOne({
      projectId: req.params.projectId,
      repoId: req.params.repoId,
    });

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    await repo.remove();
    res.json({ message: 'Repository unlinked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 