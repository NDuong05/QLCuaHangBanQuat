// // function checkLogin() {
// //     let currentUser = JSON.parse(localStorage.getItem("currentuser"));
// //     if(currentUser == null || currentUser.userType == 0) {
// //         document.querySelector("body").innerHTML = `<div class="access-denied-section">
// //             <img class="access-denied-img" src="./assets/img/access-denied.webp" alt="">
// //         </div>`
// //     } else {
// //         document.getElementById("name-acc").innerHTML = currentUser.username;
// //     }
// // }
// // window.onload = checkLogin();
const loginForm = document.getElementById('dangnhap-form-admin');
const usernameInput = loginForm.querySelector('input[type="text"]');
const passwordInput = loginForm.querySelector('input[type="password"]');
const adminContainer = document.getElementById('admin-container');
const loginButton = loginForm.querySelector('.block-item-admin');
const loginContainer = document.getElementById('container-login-admin');

if (localStorage.getItem('isLoggedIn') === 'true') {
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
}

loginButton.addEventListener('click', function(event) {
    event.preventDefault();

    const username_ = usernameInput.value;
    const password_ = passwordInput.value;

    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts'));

    const isValidAccount = adminAccounts.some(account => 
        account.username === username_ && account.password === password_
    );


    if (isValidAccount) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        localStorage.setItem('isLoggedIn', 'true'); 
        document.getElementById('name-acc').innerText = username_;
        const userlogin = {
            username: username_,
            password: password_,
        };
        localStorage.setItem('userlogin', JSON.stringify(userlogin));
        window.location.href='admin.html'
        
    } else {
        toast({ title: 'Lỗi', message: 'Tài khoản hoặc mật khẩu không đúng!', type: 'error', duration: 3000 });
    }
});

const userlogin = JSON.parse(localStorage.getItem('userlogin'));

showUserName();
window.onload = function () {
    console.log('hihihi');
}
function logout() {
    localStorage.removeItem('userlogin');
    localStorage.removeItem('cart');
    localStorage.setItem('isLoggedIn', 'false');
    // location.href = './index.html';
    loginContainer.style.display = 'block';
    adminContainer.style.display = 'none';

}


const menuIconButton = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");
menuIconButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});


// tab for section
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for (let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");
    };
}

const closeBtn = document.querySelectorAll('.section');
console.log(closeBtn[0])
for (let i = 0; i < closeBtn.length; i++) {
    closeBtn[i].addEventListener('click', (e) => {
        sidebar.classList.add("open");
    })
}

// Get amount product
function getAmoumtProduct() {
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    return products.length;
}

// Get amount user
function getAmoumtUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    return accounts.length;
}

// Get amount order
function getMoney() {
    let tongtien = 0;
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];

    orders.forEach(item => {
        // Check if item.total exists and if item.trangthai is true (or truthy)
        if (item.total !== undefined && item.trangthai == 1) {
            tongtien += item.total;
        }
    });

    return tongtien;
}

document.getElementById("amount-user").innerHTML = getAmoumtUser();
document.getElementById("amount-product").innerHTML = getAmoumtProduct();
document.getElementById("doanh-thu").innerHTML = vnd(getMoney());
function showUserName() {
    if (document.getElementById('name-acc')) document.getElementById('name-acc').innerText = userlogin.username;
}

// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}