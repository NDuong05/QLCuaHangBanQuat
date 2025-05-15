let perPage = 10;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    showProductArr(productShow);
}

function setupPagination(productAll, perPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);
    for (let i = 1; i <= page_count; i++) {
        let li = paginationChange(i, productAll, currentPage);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChange(page, productAll, currentPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="#">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
    })
    return node;
}
function attachDeleteEvents() {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function (e) {
            const id = e.target.closest('button').dataset.id;
            console.log("Button clicked, ID:", id); 
            deleteProduct(parseInt(id)); 
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
    attachDeleteEvents(); 
});


function showProductArr(arr) {
    let productHtml = "";
    if (arr.length === 0) {
        productHtml = `<div class="no-result"><div class="no-result-i"><i class="fa-solid fa-face-sad-cry"></i></div><div class="no-result-h">Không có sản phẩm để hiển thị</div></div>`;
    } else {
        arr.forEach(product => {
            let quantityClass = "";
            if (product.quantity === 0) {
                quantityClass = "out-of-stock"; // Hết hàng
            } else if (product.quantity <= 5) {
                quantityClass = "low-stock"; // Số lượng thấp
            }

            let btnCtl = product.status === 1
                ? `<button class="btn-delete" data-id="${product.productid}" data-action="delete"><i class="fa-solid fa-trash"></i></button>`
                : `<button class="btn-delete" data-id="${product.productid}" data-action="restore"><i class="fa-solid fa-eye"></i></button>`;
            productHtml += `
                <div class="list">
                    <div class="list-left">
                        <img src="${product.img}" alt="">
                        <div class="list-info">
                            <h4>${product.name}</h4>
                            <span class="list-category">${product.category}</span>
                            <p class="list-quantity ${quantityClass}">Số lượng: <span>${product.quantity}</span></p> <!-- Hiển thị số lượng -->
                        </div>
                    </div>
                    <div class="list-center">
                        <div class="list-detail">
                            <p class="power">Công Suất: ${product.power}</p>
                            <p class="size">Kích Thước: ${product.size}</p>
                            <p class="madeIn">Xuất Xứ: ${product.madein}</p>
                            <p class="namSx">Năm: ${product.year}</p>
                            <p class="baoHanh">Bảo Hành: 12 tháng</p>
                            <p class="hang">Hãng: ${product.brandid}</p>
                        </div>
                    </div>
                    <div class="list-right">
                        <div class="list-price">
                            <span class="list-current-price">${product.price} VND</span>
                        </div>
                        <div class="list-control">
                            <div class="list-tool">
                                <button class="btn-edit" onclick="editProduct('${product.productid}')"><i class="fa-solid fa-pen-to-square"></i></button>
                                ${btnCtl}
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    }
    document.getElementById("show-product").innerHTML = productHtml;
    attachDeleteEvents(); 
}

function attachDeleteEvents() {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function (e) {
            const id = e.target.closest('button').dataset.id;
            const action = e.target.closest('button').dataset.action;
            if (action === 'delete') {
                console.log("Delete button clicked, ID:", id); 
                deleteProduct(parseInt(id)); 
            } else if (action === 'restore') {
                console.log("Restore button clicked, ID:", id); 
                changeStatusProduct(parseInt(id)); 
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});



function showProduct() {
    let selectOp = document.getElementById('the-loai').value;
    let valeSearchInput = document.getElementById('form-search-product').value.trim();
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];

    let result;
    if (selectOp === "Tất cả") {
        result = products.filter(item => item.status === 1);
    } else if (selectOp === "Đã xóa") {
        result = products.filter(item => item.status === 0);
    } else {
        result = products.filter(item => item.category === selectOp && item.status === 1);
    }

    if (valeSearchInput) {
        result = result.filter(item => item.name.toUpperCase().includes(valeSearchInput.toUpperCase()));
    }

    showProductArr(result);
    displayList(result, perPage, currentPage);
    setupPagination(result, perPage, currentPage);
}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});


function showUserName() {
    if (document.getElementById('name-acc')) document.getElementById('name-acc').innerText = userlogin.username;
}


function createId(arr) {
    let id = arr.length ? Math.max(...arr.map(item => item.productid)) + 1 : 1;
    let check = arr.find((item) => item.productid == id);
    while (check != null) {
        id++;
        check = arr.find((item) => item.productid == id);
    }
    return id;
}



function addProduct() {
    let products = JSON.parse(localStorage.getItem("productList")) || [];
    let categoryTmp = document.getElementById("chon-sanPham").value;
    let categoryText;
    switch (categoryTmp) {
        case 'Quạt đứng':
            categoryText = 'quatdung';
            break;
        case 'Quạt treo tường':
            categoryText = 'quattreotuong';
            break;
        case 'Quạt trần':
            categoryText = 'quattran';
            break;
        case 'Quạt lửng':
            categoryText = 'quatlung';
            break;
    }

    let newProduct = {
        productid: createId(products),
        name: document.getElementById("ten-sanPham").value,
        img: document.querySelector(".upload-image-preview").src,
        category: categoryText,
        price: parseInt(document.getElementById("gia-moi").value),
        quantity: parseInt(document.getElementById("so-luong").value), // Thêm số lượng
        madein: document.getElementById("madeIn").value,
        power: document.getElementById("power").value,
        size: document.getElementById("size").value,
        brandid: document.getElementById("hang").value,
        year: document.getElementById("year").value,
        status: 1
    };

    if (
        newProduct.name && newProduct.img && newProduct.category &&
        newProduct.price && newProduct.quantity >= 0 && newProduct.madein &&
        newProduct.power && newProduct.size && newProduct.brandid && newProduct.year
    ) {
        products.push(newProduct);
        localStorage.setItem("productList", JSON.stringify(products));
        toast({ title: "Success", message: "Thêm sản phẩm thành công!", type: "success", duration: 3000 });
        setDefaultValue();
        showProduct();
        document.querySelector(".add-product").classList.remove("open");
    } else {
        toast({ title: "Warning", message: "Vui lòng điền đầy đủ thông tin!", type: "warning", duration: 3000 });
    }
}



document.getElementById("add-product-button").addEventListener("click", (e) => {
    e.preventDefault();
    addProduct();
});


document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});


function deleteProduct(id) {
    console.log("Attempting to delete product with ID:", id); 
    const products = JSON.parse(localStorage.getItem("productList")) || [];
    const index = products.findIndex(item => item.productid === id);

    if (index !== -1 && confirm("Bạn có chắc muốn xóa?")) {
        products[index].status = 0; 
        localStorage.setItem("productList", JSON.stringify(products));
        showProduct(); 
    } else {
        console.error("Product not found or unable to delete");
    }
}


function changeStatusProduct(id) {
    let products = JSON.parse(localStorage.getItem("productList")) || [];
    let index = products.findIndex(item => item.productid === id);

    if (index !== -1 && confirm("Bạn có chắc chắn muốn khôi phục sản phẩm?")) {
        products[index].status = 1; 
        localStorage.setItem("productList", JSON.stringify(products));
        toast({ title: 'Success', message: 'Khôi phục sản phẩm thành công!', type: 'success', duration: 3000 });
        showProduct(); 
    }
}


var indexCur;
function editProduct(id) {
    let products = JSON.parse(localStorage.getItem("productList")) || [];
    let index = products.findIndex(item => item.productid == id);
    indexCur = index;

    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "block";
    });
    document.querySelector(".add-product").classList.add("open");

    
    document.querySelector(".upload-image-preview").src = products[index].img;
    document.getElementById("ten-sanPham").value = products[index].name;
    document.getElementById("gia-moi").value = products[index].price;
    document.getElementById("so-luong").value = products[index].quantity; // Hiển thị số lượng
    document.getElementById("chon-sanPham").value = products[index].category;
    document.getElementById("size").value = products[index].size;
    document.getElementById("power").value = products[index].power;
    document.getElementById("hang").value = products[index].brandid;
    document.getElementById("madeIn").value = products[index].madein;
    document.getElementById("year").value = products[index].year;
}

function getPathImage(path) {
    let patharr = path.split("/");
    return "./hinhanh/quatdien/" + patharr[patharr.length - 1]
}

let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let products = JSON.parse(localStorage.getItem("productList"));
    let idProduct = products[indexCur].productid;
    let imgProduct = products[indexCur].img;
    let nameProduct = products[indexCur].name;
    let curProduct = products[indexCur].price;
    let categoryProduct = products[indexCur].category;
    let madeInProduct = products[indexCur].madein;
    let powerProduct = products[indexCur].power;
    let sizeProduct = products[indexCur].size;
    let yearProduct = products[indexCur].year;
    let brandProduct = products[indexCur].brandid;

    let imgProductCur = document.querySelector(".upload-image-preview").src;
    let nameProductCur = document.getElementById("ten-sanPham").value;
    let curProductCur = document.getElementById("gia-moi").value;
    let categoryTmp = document.getElementById("chon-sanPham").value;
    let categoryText;
    switch (categoryTmp) {
        case 'Quạt đứng':
            categoryText = 'quatdung';
            break;
        case 'Quạt treo tường':
            categoryText = 'quattreotuong';
            break;
        case 'Quạt trần':
            categoryText = 'quattran';
            break;
        case 'Quạt lửng':
            categoryText = 'quatlung';
            break;
    }
    let madeInProductCur = document.getElementById("madeIn").value;
    let powerProductCur = document.getElementById("power").value;
    let sizeProductCur = document.getElementById("size").value;
    let yearProductCur = document.getElementById("year").value;
    let brandProductCur = document.getElementById("hang").value;

    
    if (
        imgProductCur && nameProductCur && curProductCur && categoryText &&
        madeInProductCur && powerProductCur && sizeProductCur && yearProductCur && brandProductCur
    ) {
        let productadd = {
            productid: idProduct,
            name: nameProductCur,
            img: imgProductCur,
            category: categoryText,
            price: parseInt(curProductCur),
            madein: madeInProductCur,
            power: powerProductCur,
            size: sizeProductCur,
            brandid: brandProductCur,
            year: yearProductCur,
            status: 1,
        };
        products.splice(indexCur, 1);
        products.splice(indexCur, 0, productadd);
        localStorage.setItem("productList", JSON.stringify(products));
        toast({ title: "Success", message: "Sửa sản phẩm thành công!", type: "success", duration: 3000 });
        setDefaultValue();
        showProduct();
        
        document.querySelector(".add-product").classList.remove("open");
    } else {
        toast({ title: "Warning", message: "Vui lòng điền đầy đủ thông tin!", type: "warning", duration: 3000 });
    }
});

document.querySelector(".modal-close.product-form").addEventListener("click", () => {
    setDefaultValue();
})

function setDefaultValue() {
    document.querySelector(".upload-image-preview").src = "./assets/img/ADD_img.jpg"; 
    document.getElementById("ten-sanPham").value = "";
    document.getElementById("gia-moi").value = "";
    document.getElementById("chon-sanPham").value = "Quạt đứng";
    document.getElementById("size").value = "";
    document.getElementById("power").value = "";
    document.getElementById("hang").value = "";
    document.getElementById("madeIn").value = "";
    document.getElementById("year").value = "";
}



let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
});


let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
    closePopup[i].onclick = () => {
        modalPopup[i].classList.remove("open");
    };
}


function uploadImage(el) {
    const file = el.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector(".upload-image-preview").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

