const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/posts', (req, res) => {
    const post = req.body;
    const postId = Date.now().toString();
    const fileName = `public/posts/post-${postId}.json`;

    fs.writeFile(fileName, JSON.stringify(post, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save the blog post.' });
        } else {
            res.json({ message: 'Blog post saved successfully.' });
        }
    });
});

app.get('/api/posts', (req, res) => {
    const posts = [];

    fs.readdir('public/posts', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve blog posts.' });
        } else {
            files.forEach((file) => {
                const filePath = `public/posts/${file}`;
                const post = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                posts.push(post);
            });
            res.json(posts);
        }
    });
});

app.post('/api/tags', (req, res) => {
    const newTag = req.body.tag;

    if (newTag) {
        tags.push(newTag);
        fs.writeFile('public/tags.json', JSON.stringify(tags), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to save tags.' });
            } else {
                res.json({ message: 'Tag saved successfully.' });
            }
        });
    } else {
        res.status(400).json({ error: 'Tag is required.' });
    }
});

app.get('/api/tags', (req, res) => {
    const tags = JSON.parse(fs.readFileSync('public/tags.json', 'utf-8'));
    res.json(tags);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
