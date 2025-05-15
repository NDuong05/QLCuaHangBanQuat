document.getElementById("duong1").onclick = function () {
    document.getElementById("import-kho").style.display = "block";
    document.getElementById("export-kho").style.display = "none";
    document.getElementById("warehouse-products").style.display = "none";
}

document.getElementById("duong2").onclick = function () {
    document.getElementById("import-kho").style.display = "none";
    document.getElementById("export-kho").style.display = "block";
    document.getElementById("warehouse-products").style.display = "none";
}

document.getElementById("duong3").onclick = function () {
    document.getElementById("import-kho").style.display = "none";
    document.getElementById("export-kho").style.display = "none";
    document.getElementById("warehouse-products").style.display = "block";
}


// sản phẩm trong khokho
document.addEventListener("DOMContentLoaded", function () {
    let productList = JSON.parse(localStorage.getItem("productList")) || [];
    let tableBody = document.getElementById("warehouse-product-list");

    tableBody.innerHTML = "";

    productList.forEach(product => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price.toLocaleString()} đ</td>            
            <td>${product.power}</td>
            <td>${product.brandid}</td>
            <td>${product.madein}</td>
            <td>${product.year}</td>
            <td>${product.quantity}</td>
        `;

        tableBody.appendChild(row);
    });
});


// --- TẢI DANH SÁCH SẢN PHẨM VÀO COMBOBOX ---
document.addEventListener("DOMContentLoaded", function () {
    const productSelect = document.getElementById("import-product");
    const productList = JSON.parse(localStorage.getItem("productList")) || [];

    // Thêm các option sản phẩm vào combobox
    productList.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index; // lưu index để tra lại tên
        option.textContent = product.name;
        productSelect.appendChild(option);
    });

    // Tải lại lịch sử nhập kho nếu có
    renderImportHistory();
});

// --- LẬP PHIẾU NHẬP ---
document.getElementById("import-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const productIndex = document.getElementById("import-product").value;
    const quantity = parseInt(document.getElementById("import-quantity").value);
    const price = parseInt(document.getElementById("import-price").value);
    const supplier = document.getElementById("supplier-search").value.trim();
    const date = new Date().toLocaleDateString("vi-VN");

    const productList = JSON.parse(localStorage.getItem("productList")) || [];
    const importHistory = JSON.parse(localStorage.getItem("importHistory")) || [];

    // Lấy tên sản phẩm theo index
    const productName = productList[productIndex]?.name || "Không xác định";

    // Tăng số lượng tồn kho nếu có
    if (productList[productIndex]) {
        productList[productIndex].quantity += quantity;
        localStorage.setItem("productList", JSON.stringify(productList));
    }

    // Lưu lịch sử nhập kho
    importHistory.push({
        date: date,
        name: productName,
        quantity: quantity,
        price: price,
        supplier: supplier
    });
    localStorage.setItem("importHistory", JSON.stringify(importHistory));

    // Hiển thị lại bảng
    renderImportHistory();

    // Reset form
    this.reset();
});

// --- HIỂN THỊ LỊCH SỬ NHẬP KHO ---
function renderImportHistory() {
    const tbody = document.getElementById("import-history");
    const importHistory = JSON.parse(localStorage.getItem("importHistory")) || [];

    tbody.innerHTML = "";

    importHistory.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.name}</td>
            <td>${entry.quantity}</td>
            <td>${entry.price.toLocaleString()} đ</td>
            <td>${entry.supplier}</td>
        `;
        tbody.appendChild(row);
    });
}

// xuatkho.js

function getXuatKhoData() {
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    let xuatkho = [];

    orders.forEach(order => {
        if (order.trangthai === 1) {
            order.items.forEach(item => {
                let product = products.find(p => p.productid == item.id);
                if (product) {
                    let xuat = {
                        madon: order.id,
                        masp: product.productid,
                        tensp: product.name,
                     
                        soluong: item.quantity,
                        dongia: product.price,
                        tong: item.quantity * product.price,
                        ngayxuat: formatDate(order.date),
                        tenkhach: order.user.username
                      
                    };
                    xuatkho.push(xuat);
                }
            });
        }
    });

    return xuatkho;
}

function formatDate(dateStr) {
    let d = new Date(dateStr);
    let day = ('0' + d.getDate()).slice(-2);
    let month = ('0' + (d.getMonth() + 1)).slice(-2);
    let year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// xuatkhoUI.js

function showXuatKhoTable() {
    let data = getXuatKhoData();
    let html = "";

    data.forEach((item, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.madon}</td>
                <td>${item.masp}</td>
                <td>${item.tensp}</td> 
                <td>${item.soluong}</td>
                <td>${vnd(item.dongia)}</td>
                <td>${vnd(item.tong)}</td>
                <td>${item.ngayxuat}</td>
                <td>${item.tenkhach}</td>
                
            </tr>
        `;
    });

    document.getElementById("table-xuatkho-body").innerHTML = html;
}

function vnd(num) {
    return Number(num).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Gọi hàm khi load trang hoặc khi cần cập nhật
document.addEventListener("DOMContentLoaded", showXuatKhoTable);


function showSanPhamTrongKho() {
    const productList = JSON.parse(localStorage.getItem("productList")) || [];
    const tableBody = document.getElementById("warehouse-product-list");

    tableBody.innerHTML = "";

    productList.forEach(product => {
        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price.toLocaleString()} đ</td>            
            <td>${product.power}</td>
            <td>${product.brandid}</td>
            <td>${product.madein}</td>
            <td>${product.year}</td>
            <td>${product.quantity}</td>
        `;

        tableBody.appendChild(row);
    });
}

