const storedBLogs = localStorage.getItem('blog');
const blog = storedBLogs ? JSON.parse(storedBLogs) : [];

function addBlogForm() {
    // Create the form elements with Bootstrap classes
    const formHtml = `
        <form id="addBlogForm" class="mt-4">
            <div class="form-group">
                <label for="newTitle">Tiêu đề:</label>
                <input type="text" id="newTitle" class="form-control" placeholder="Tiêu đề bài viết" required onfocus>
            </div>

            <div class="form-group">
                <label for="newContent">Nội dung:</label>
                <textarea id="newContent" class="form-control" rows="4" placeholder="Nội dung bài viết"></textarea>
            </div>

            <div class="form-group">
                <label for="newDate">Ngày đăng:</label>
                <input type="datetime-local" id="newDate" class="form-control" placeholder="Ngày đăng">
            </div>

            <div class="form-group">
                <label for="newImage">URL ảnh:</label>
                <input type="text" id="newImage" class="form-control" placeholder="img/vanhoa2.jpeg">
            </div>
            
            <div class="form-group text-center">
                <button class="btn btn-success" type="button" onclick="saveBlog()">Lưu</button>
            </div>
        </form>
    `;

    // Replace the content inside the admConfiguration div
    document.getElementById("admConfiguration").innerHTML = formHtml;
}

let blogId = 0;
function saveBlog() {
    blogId++;
    let title = document.getElementById('newTitle').value;
    let content = document.getElementById('newContent').value;
    let date = document.getElementById('newDate').value;
    let image = document.getElementById('newImage').value;

    // Check if the number of blogs is greater than or equal to the limit (3)
    if (blog.length >= 3) {
        // Remove the oldest blog (the one at index 0)
        blog.shift();
    }

    blog.push({ blogId, image, date, title, content});
    localStorage.setItem('blog', JSON.stringify(blog));
    alert('Thêm blog mới thành công!');

    // Clear the form or perform other actions after submission
    document.getElementById("addBlogForm").reset();
}

function manageBlog() {
    const blogConfig = document.getElementById('admConfiguration');
    blogConfig.innerHTML = '';

    const blogTable = document.createElement('table');
    blogTable.className = 'table table-bordered table-striped';

    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th scope="col">Id bài viết</th>
            <th scope="col">Tiêu đề</th>
            <th scope="col">Nội dung</th>
            <th scope="col">Ngày đăng</th>
            <th scope="col">Ảnh</th>
            <th scope="col">Thao tác</th>
        </tr>
    `;
    blogTable.appendChild(tableHeader);

    // Create table body
    const tableBody = document.createElement('tbody');

    // Populate the table with blog list
    blog.forEach((blog, i) => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${i + 1}</td>
            <td>${blog.title}</td>
            <td>${blog.content}</td>
            <td>${blog.date}</td>
            <td>
                <img src="${blog.image}" alt="Blog Image" style="max-width: 100px; max-height: 100px;">
            </td>
            <td>
                <button class="btn btn-success btn-sm" onclick="editBlog(${blog.blogId})">
                    <i class="fa-solid fa-pen-to-square"></i> Sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteBlog('${blog.title}')">
                    <i class="fa-solid fa-trash"></i> Xóa
                </button>
            </td>
        `;
        tableBody.appendChild(tableRow);
    });

    blogTable.appendChild(tableBody);

    blogConfig.appendChild(blogTable);
    blogConfig.style.display = 'block';
}

function deleteBlog(title) {
    // Find the index of the blog with the specified title
    const index = blog.findIndex(blog => blog.title === title);

    if (index !== -1) {
        // Remove the blog from the array
        blog.splice(index, 1);

        // Update local storage with the modified blog array
        localStorage.setItem('blog', JSON.stringify(blog));

        manageBlog();

        alert('Xoá thành công !');
    } else {
        alert('Không tìm thấy Blog');
    }
}

// Function to populate the form for editing a blog
function editBlog(id) {
    // Retrieve the blog data using the index
    const blogToEdit = blog.find(blog => blog.blogId === id);

    if (blogToEdit) {
        // Set editingIndex to the index of the blog being edited
        editingIndex = blog.findIndex(blog => blog.blogId === id);

        // Populate the form fields with existing blog data
        document.getElementById('newTitle').value = blogToEdit.title;
        document.getElementById('newContent').value = blogToEdit.content;
        document.getElementById('newDate').value = blogToEdit.date;
        document.getElementById('newImage').value = blogToEdit.image;

        // Open the edit user modal
        $('#editBlogModal').modal('show');
    } else {
        alert('Không tìm thấy blog');
    }
}

//update blog after finish modal form
function updateBlog() {
    if (editingIndex !== -1) {
        // Retrieve updated values from the form
        const updatedTitle = document.getElementById('newTitle').value;
        const updatedContent = document.getElementById('newContent').value;
        const updatedDate = document.getElementById('newDate').value;
        const updatedImage = document.getElementById('newImage').value;

        // Update the blog data at the specified index
        blog[editingIndex].title = updatedTitle;
        blog[editingIndex].content = updatedContent;
        blog[editingIndex].date = updatedDate;
        blog[editingIndex].image = updatedImage;

        // Update local storage with the modified blog array
        localStorage.setItem('blog', JSON.stringify(blog));

        editingIndex = -1;

        // After updating, close the modal
        $('#editBlogModal').modal('hide');

        // Re-render the blog table
        manageBlog();

        alert('Cập nhật blog thành công!');
    } else {
        alert('Cập nhật blog lỗi!');
    }
}

function displayBlogs() {
    const blogListContainer = document.getElementById("blogList");

    blogListContainer.innerHTML = "";

    // Iterate through blogData and create HTML for each blog
    blog.forEach((blog, index) => {
        const blogHTML = `
      <div class="col-lg-4 col-md-6 col-12">
        <div class="single-news">
          <div class="news-head">
            <img src="${blog.image}" alt="#">
          </div>
          <div class="news-body">
            <div class="news-content">
              <div class="date">${blog.date}</div>
              <h2><a href="">${blog.title}</a></h2>
              <p class="text">${blog.content}</p>
            </div>
          </div>
        </div>
      </div>
    `;

        // Append the blog HTML to the container
        blogListContainer.innerHTML += blogHTML;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Display the blogs on page load
    displayBlogs();
});