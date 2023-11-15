const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content');

navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        contentSections.forEach((section) => {
            if (section.id === targetId) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
});

tinymce.init({
    selector: 'textarea#blog-content',
    plugins: 'link image media',
    toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image media',
    height: 300
});

const tagsCloud = document.getElementById('tags-cloud');
const addTagBtn = document.getElementById('add-tag-btn');
const deleteTagBtn = document.getElementById('delete-tag-btn');

let tags = [];

function displayTags() {
    tagsCloud.innerHTML = tags.map(tag => `<span class="badge badge-primary">${tag}</span>`).join(' ');
}

displayTags();

addTagBtn.addEventListener('click', () => {
    const newTag = prompt('Enter a new tag:');
    if (newTag) {
        tags.push(newTag);
        displayTags();
    }
});

deleteTagBtn.addEventListener('click', () => {
    const tagToDelete = prompt('Enter the tag to delete:');
    if (tagToDelete && tags.includes(tagToDelete)) {
        tags = tags.filter(tag => tag !== tagToDelete);
        displayTags();
    } else {
        alert('Tag not found.');
    }
});

const savePostBtn = document.getElementById('save-post-btn');
const blogList = document.getElementById('blog-list');
const blogPosts = [];

function createBlogPost(title, content, date, tags, category) {
    const post = document.createElement('article');
    post.innerHTML = `
        <h3>${title}</h3>
        <p>${content}</p>
        <div class="metadata">
            <span class="date">${date}</span>
            <span class="tags">Tags: ${tags.join(', ')}</span>
            <span class="category">Category: ${category}</span>
        </div>
    `;
    return post;
}

function displayBlogPosts() {
    blogList.innerHTML = '';
    blogPosts.forEach((post) => {
        const blogPost = createBlogPost(post.title, post.content, post.date, post.tags, post.category);
        blogList.appendChild(blogPost);

        const postTitle = blogPost.querySelector('h3');
        postTitle.addEventListener('click', () => {
            // Open the full blog post (implement this)
        });
    });
}

savePostBtn.addEventListener('click', () => {
    const content = tinymce.get('blog-content').getContent();
    if (content.trim() !== '') {
        const title = prompt('Enter the post title:');
        if (title) {
            const date = new Date().toLocaleString();
            const tags = prompt('Enter tags (comma-separated):');
            const category = prompt('Enter category:');
            const post = { title, content, date, tags: tags.split(','), category };
            
            blogPosts.push(post);
            displayBlogPosts();
            tinymce.get('blog-content').setContent('');
        }
    } else {
        alert('Please enter some content for the post.');
    }
});

// Function to create and display blog posts
function createAndDisplayBlogPosts() {
    blogList.innerHTML = '';
    blogPosts.forEach((post, index) => {
        const blogPost = createBlogPost(post.title, post.content, post.date, post.tags, post.category, index);
        blogList.appendChild(blogPost);
    });
}

// Event listener for opening and editing a blog post
blogList.addEventListener('click', (e) => {
    if (e.target.classList.contains('blog-title')) {
        const postIndex = e.target.dataset.index;
        openAndEditPost(postIndex);
    }
});

// Function to open and edit a blog post
function openAndEditPost(index) {
    const post = blogPosts[index];
    tinymce.get('blog-content').setContent(post.content);
    currentEditingIndex = index;
}

// Event listener for saving changes to a blog post
savePostBtn.addEventListener('click', () => {
    const content = tinymce.get('blog-content').getContent();
    if (content.trim() !== '') {
        const title = prompt('Enter the post title:');
        if (title) {
            const date = new Date().toLocaleString();
            const tags = prompt('Enter tags (comma-separated):');
            const category = prompt('Enter category:');
            const post = { title, content, date, tags: tags.split(','), category };
            if (currentEditingIndex !== null) {
                // Update existing post
                blogPosts[currentEditingIndex] = post;
            } else {
                // Create a new post
                blogPosts.push(post);
            }
            createAndDisplayBlogPosts();
            tinymce.get('blog-content').setContent('');
            currentEditingIndex = null;
        }
    } else {
        alert('Please enter some content for the post.');
    }
});

// Event listener for deleting a blog post
deletePostBtn.addEventListener('click', () => {
    if (currentEditingIndex !== null) {
        if (confirm('Are you sure you want to delete this post?')) {
            blogPosts.splice(currentEditingIndex, 1);
            createAndDisplayBlogPosts();
            tinymce.get('blog-content').setContent('');
            currentEditingIndex = null;
        }
    } else {
        alert('No post selected for deletion.');
    }
});

// Event listener for exporting a blog post as PDF
// Event listener for exporting a blog post as PDF
exportPostPdfBtn.addEventListener('click', () => {
    if (currentEditingIndex !== null) {
        const post = blogPosts[currentEditingIndex];
        
        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Set the title of the PDF
        doc.setTitle(post.title);

        // Add content to the PDF
        doc.text(post.title, 10, 10); // Add the title
        doc.text(post.content, 10, 20); // Add the content
        doc.text(`Date: ${post.date}`, 10, 30); // Add the date
        doc.text(`Tags: ${post.tags.join(', ')}`, 10, 40); // Add tags
        doc.text(`Category: ${post.category}`, 10, 50); // Add category

        // Save the PDF with a filename
        doc.save(`${post.title}.pdf`);
    } else {
        alert('No post selected for export.');
    }
});

// Event listener for exporting a blog post as HTML
exportPostHtmlBtn.addEventListener('click', () => {
    if (currentEditingIndex !== null) {
        const post = blogPosts[currentEditingIndex];
        // Implement HTML export logic
        const htmlContent = `
            <html>
            <head>
                <title>${post.title}</title>
            </head>
            <body>
                <h1>${post.title}</h1>
                <p>${post.content}</p>
                <p>Date: ${post.date}</p>
                <p>Tags: ${post.tags.join(', ')}</p>
                <p>Category: ${post.category}</p>
            </body>
            </html>
        `;
        // Create a Blob containing the HTML content
        const blob = new Blob([htmlContent], { type: 'text/html' });
        // Create a download link and trigger a click to download the HTML file
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${post.title}.html`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert('No post selected for export.');
    }
});