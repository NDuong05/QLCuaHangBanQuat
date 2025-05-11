// Kiểm tra trạng thái đăng nhập
let userlogin = undefined;


// Khởi tạo adminAccounts nếu chưa tồn tại
if (!localStorage.getItem('adminAccounts')) {
    const adminAccounts = [
    
        { username: 'admin', password: 'admin', numberphone:'0978254321' }
    ];
    localStorage.setItem('adminAccounts', JSON.stringify(adminAccounts));
}


const openSignIn = document.getElementById('topmenu_icon--user');
const goToSignUp = document.getElementById('GoToSignUp');
const signUpBackToSignIn = document.getElementById('SignUpBackToSignIn');
const closeFormLogin = document.getElementById('CloseFormLogin');
const signInContainer = document.querySelector('.sign-in-container');
const signUpContainer = document.querySelector('.sign-up-container');
const signInForm = signInContainer.querySelector('form');
const signUpForm = signUpContainer.querySelector('form');
const nameUser = document.getElementById('user--name');
const iconUser = document.getElementById('topmenu_icon--user');
const loginContainer = document.getElementById('container-login');
// const adminContainer = document.getElementById('topmenu_icon--gear');

// window.onload = checklogin;
checklogin();

function checklogin() {
    // hideAdmin();
    hideNameUser();
    const user = JSON.parse(localStorage.getItem('userlogin'));
    if (user == null) {
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    
    // Kiểm tra tài khoản người dùng
    userlogin = accounts.find(account => account.username === user.username);
    if (userlogin) {
        hideLogin();
        hideUser();
        showNameUser();
        nameUser.textContent = userlogin.username;
        return;
    }

    // Kiểm tra tài khoản admin
    userlogin = adminAccounts.find(admin => admin.username === user.username && admin.password === user.password);
    if (userlogin) {
        hideLogin();
        hideUser();
        // showAdmin();
        nameUser.textContent = userlogin.username;
        showNameUser();
    }
}

// Hiển thị hộp thoại
function showAlert(message) {
    alert(message);
}

// Hàm lưu tài khoản vào localStorage
function saveAccount(username, numberphone, password) {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let newUser = { username: username, numberphone: numberphone, password: password, status: 1 };
    accounts.push(newUser);
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

// Check tài khoản đã tồn tại hay chưa?
function checkAccount(username) {
    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // Kiểm tra
    return accounts.find(account => account.username === username);
}

// Hàm tìm tài khoản trong localStorage
function findAccount(numberphoneOrUsername, password) {
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];
    
    // Kiểm tra cả user và admin
    return accounts.concat(adminAccounts).find(account =>
        (account.numberphone === numberphoneOrUsername || account.username === numberphoneOrUsername) &&
        account.password === password
    );
}

document.querySelectorAll('.logout').forEach(logoutbtn => {
    logoutbtn.addEventListener('click', function () {
        logout();
    })
})

function hideUserSelection() {
    document.querySelectorAll('.user--selection').forEach(selection => {
        selection.classList.add('hidden');
    })
}

// Hàm đăng xuất tài khoản
function logout() {
    userlogin = undefined;
    localStorage.removeItem('userlogin');
    localStorage.removeItem('cart');
    localStorage.setItem('isLoggedIn', 'false');
    updateUser();
    // hideAdmin();
    hideLogin();
    hideNameUser();
    hideUserSelection();
    showUser();
    if (document.getElementById('dangnhap-form')) document.getElementById('dangnhap-form').reset();
    if (document.getElementById('dangky-form')) document.getElementById('dangky-form').reset();
    if (document.getElementById('personal-form')) document.getElementById('personal-form').reset();
    if (document.getElementById('payment-form')) document.getElementById('payment-form').reset();
    if (document.getElementById('city-dropdown')) document.getElementById('city-dropdown').parentElement.classList.remove('valid');
    if (document.getElementById('city-dropdown')) document.getElementById('city-dropdown').parentElement.classList.remove('invalid');
    if (document.getElementById('district-dropdown')) document.getElementById('district-dropdown').parentElement.classList.remove('valid');
    if (document.getElementById('district-dropdown')) document.getElementById('district-dropdown').parentElement.classList.remove('invalid');
    if (document.getElementById('ward-dropdown')) document.getElementById('ward-dropdown').parentElement.classList.remove('valid');
    if (document.getElementById('ward-dropdown')) document.getElementById('ward-dropdown').parentElement.classList.remove('invalid');
    if (document.getElementById('city-selected')) document.getElementById('city-selected').textContent = "Chọn tỉnh / thành";
    if (document.getElementById('district-selected')) document.getElementById('district-selected').textContent = "Chọn quận / huyện";
    if (document.getElementById('ward-selected')) document.getElementById('ward-selected').textContent = "Chọn phường / xã";
    document.querySelectorAll('.payment-input').forEach(inp => inp.classList.remove('valid'));
    document.querySelectorAll('.payment-input').forEach(inp => inp.classList.remove('invalid'));
    loadCart();
    displayOrders();
    numberphoneOrUsername.textContent = '';
    password.textContent = '';
    showAlert("Bạn đã đăng xuất thành công.");
}
// ----------------------------------------------------------------------------------------------------------------------//

//Hàm ấn icon user
function hideUser() {
    iconUser.style.display = 'none';
}
// Hàm hiện icon user
function showUser() {
    iconUser.style.display = 'block';
}

// ham an name user
function hideNameUser() {
    nameUser.style.display = 'none';
}
//ham hien name user
function showNameUser() {
    nameUser.style.display = 'block';
}

nameUser.addEventListener('click', function (e) {
    userSelection[0].classList.toggle('hidden');
});

const logoutButton = document.getElementById('logout--button');
if (logoutButton) logoutButton.style.display = 'none';
//ham an nut logout
function hideLogoutButton() {
    logoutButton.style.display = 'none';
}
//ham hien nut logout
function showLogoutButton() {
    logoutButton.style.display = 'none';
}

// Hàm hiển thị cửa sổ Login
function showLogin() {
    loginContainer.style.display = 'block';
}
// Hàm ẩn Login
function hideLogin() {
    loginContainer.style.display = 'none';
}

// // Hiển thị 
// function showAdmin() {
//     adminContainer.style.display = 'block';
// }
// // Ẩn nút chuyển tới trang Admin
// function hideAdmin() {
//     adminContainer.style.display = 'none';
// }

const userSelection = document.getElementsByClassName('user--selection');

//mở trang đăng nhập
openSignIn.addEventListener('click', (e) => {
    if (userlogin == undefined)
        showLogin();
    else {
        // show thông tin để chọn
        userSelection[1].classList.toggle('hidden');
    }
});
// Chuyển sang form đăng kí
goToSignUp.addEventListener('click', (e) => {
    e.preventDefault();
    signInContainer.style.display = 'none';
    signUpContainer.style.display = 'flex';
});
// Trở về form đăng nhập từ form đăng kí
signUpBackToSignIn.addEventListener('click', (e) => {
    e.preventDefault();
    signUpContainer.style.display = 'none';
    signInContainer.style.display = 'flex';
});
// Đóng form login
closeFormLogin.addEventListener('click', (e) => {
    e.preventDefault();
    hideLogin();
});

// -------------------------------------------------------------------------------------//

// kiểm tra sdt 
function isValidPhoneNumber(phoneNumber) {
    phoneNumber = phoneNumber.trim();
    const phoneRegex = /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])\d{7}$/;

    return phoneRegex.test(phoneNumber);
}

// Kiểm tra đăng kí tài khoản
signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const numberphone = signUpForm.querySelector("input[placeholder='Số điện thoại']");
    const num = numberphone.value.trim();
    if (!isValidPhoneNumber(num)) {
        showAlert("Số điện thoại không hợp lệ !");
        numberphone.focus();
        return;
    }

    const username = signUpForm.querySelector("input[placeholder='Tên tài khoản']");
    const name = username.value.trim();
    if (name.length < 6 || name.length > 10) {
        showAlert("Tên tài khoản phải từ 6 đến 10 ký tự.");
        username.focus();
        return;
    }

    if (checkAccount(username)) {
        showAlert("Tài khoản đã tồn tại");
        username.focus();
        return;
    }

    const passwordDK = signUpForm.querySelector("input[placeholder='Mật khẩu']").value;
    if (passwordDK.length < 6 || passwordDK.length > 20) {
        showAlert("Mật khẩu phải từ 6 đến 20 ký tự.");
        passwordDK.focus();
        return;
    }

    const confirmPassword = signUpForm.querySelector("input[placeholder='Nhập lại mật khẩu']").value;
    if (passwordDK !== confirmPassword) {
        showAlert("Mật khẩu nhập lại không khớp.");
        confirmPassword.focus();
        return;
    }

    saveAccount(name, num, passwordDK);
    showAlert("Đăng kí thành công! Bạn có thể đăng nhập bằng tài khoản mới.");
    signUpContainer.style.display = 'none';
    signInContainer.style.display = 'flex';
});


// Kiểm tra đăng nhập
signInForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const numberphoneOrUsername = signInForm.querySelector("input[placeholder='Số điện thoại hoặc Tên tài khoản']").value;
    const password = signInForm.querySelector("input[placeholder='Mật khẩu']").value;

    const adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || [];

    // Kiểm tra tài khoản admin
    let account = adminAccounts.find(admin => admin.username === numberphoneOrUsername && admin.password === password);
    if (account) {
        showAlert("Đăng nhập thành công với tài khoản admin!");
        hideLogin();
        hideUser();
        // showAdmin();
        nameUser.textContent = numberphoneOrUsername;
        userlogin = account;
        showNameUser();
        localStorage.setItem('userlogin', JSON.stringify(userlogin));
        localStorage.setItem('isLoggedIn', 'true');
        return;
    }

    // Kiểm tra tài khoản người dùng
    account = findAccount(numberphoneOrUsername, password);
    if (account) {
        if (account.status == 0) {
            showAlert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.");
        } else {
            showAlert("Đăng nhập thành công!");
            hideLogin();
            hideUser();
            nameUser.textContent = numberphoneOrUsername;
            showNameUser();
            userlogin = account;
            localStorage.setItem('userlogin', JSON.stringify(userlogin));
            updateUser();
            updatePersonalForm();
            displayOrders();
        }
    } else {
        showAlert("Số điện thoại, tên tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.");
    }
});





function updatePersonalForm() {
    const userInfoArray = JSON.parse(localStorage.getItem('userInfo')) || [];

    let hihi = userInfoArray.find(user => user.username == userlogin.username);
    console.log(hihi);

    // Không tìm thấy
    if (hihi == undefined) return false;

    if (document.getElementById('namePersonal')) document.getElementById('namePersonal').value = hihi.hoten;
    if (document.getElementById('emailPersonal')) document.getElementById('emailPersonal').value = hihi.email;
    if (document.getElementById('phonePersonal')) document.getElementById('phonePersonal').value = hihi.sdt;
    if (document.getElementById('addressPersonal')) document.getElementById('addressPersonal').value = hihi.diachi;
    console.log(document.getElementById('city-selected'));

    if (document.getElementById('city-selected')) {
        document.getElementById('city-selected').innerText = hihi.thanhpho;
        document.getElementById('city-selected').style.color = 'black';
        document.getElementById('city-dropdown').parentElement.classList.add('valid');
    }
    if (document.getElementById('district-selected')) {
        document.getElementById('district-selected').innerText = hihi.quan;
        document.getElementById('district-selected').style.color = 'black';
        document.getElementById('district-dropdown').parentElement.classList.add('valid');
    }
    if (document.getElementById('ward-selected')) {
        document.getElementById('ward-selected').innerText = hihi.phuong;
        document.getElementById('ward-selected').style.color = 'black';
        document.getElementById('ward-dropdown').parentElement.classList.add('valid');
    }

    return true;
}

function closePersonalInfoTable() {
    document.querySelectorAll('.error-input').forEach(error => {
        error.classList.remove('invalid');
    })
    const displayPersonalInfo = document.getElementById("display-personal-info");
    displayPersonalInfo.style.display = 'none';

}

function openPersonalInfoTable() {
    const displayPersonalInfo = document.getElementById("display-personal-info");
    if (updatePersonalForm()) {
        // document.querySelectorAll('.payment-input');
        const hehe = document.querySelectorAll('.payment-input');
        for (let i = 0; i < 4; ++i) {
            hehe[i].classList.add('valid');
        }
    }
    displayPersonalInfo.style.display = 'block';
    displayPersonalInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
}

document.querySelectorAll('.user-information').forEach(element => {
    element.addEventListener('click', openPersonalInfoTable)
});

if (document.getElementById('display-personal-info')) document.getElementById('display-personal-info').addEventListener('submit', function (e) {
    e.preventDefault();
})

if (document.getElementById('personal-form')) document.getElementById('personal-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let flag = true;
    flag &= checkName(document.getElementById('namePersonal'));
    flag &= checkEmail(document.getElementById('emailPersonal'));
    flag &= checkSDT(document.getElementById('phonePersonal'));
    flag &= checkDiaChi(document.getElementById('addressPersonal'));

    const city = citySelected.textContent.trim();
    const district = districtSelected.textContent.trim();
    const ward = wardSelected.textContent.trim();

    if (city === "Chọn tỉnh / thành") {
        flag = false;
        cityDropdown.parentElement.classList.add('invalid');
    }

    if (district === "Chọn quận / huyện") {
        flag = false;
        districtDropdown.parentElement.classList.add('invalid');
    }

    if (ward === "Chọn phường / xã") {
        flag = false;
        wardDropdown.parentElement.classList.add('invalid');
    }

   
    if (flag) {
        console.log(document.getElementById('addressPersonal'));

        const diachi = document.getElementById('addressPersonal').value;
        const userInfoArray = JSON.parse(localStorage.getItem('userInfo')) || [];
        let userInfo = {
            username: userlogin.username,
            hoten: document.getElementById('namePersonal').value,
            email: document.getElementById('emailPersonal').value,
            sdt: document.getElementById('phonePersonal').value,
            diachi: document.getElementById('addressPersonal').value,
            quan: district,
            thanhpho: city,
            phuong: ward
        }
        console.log(userInfo);

        let index = userInfoArray.findIndex(user => user.username == userInfo.username);
        if (index == -1)
            userInfoArray.push(userInfo);
        else
            userInfoArray[index] = userInfo;

        localStorage.setItem('userInfo', JSON.stringify(userInfoArray));
        // user.sothe = true;
        updateUser();
        closePersonalInfoTable();
    }
})



// Lấy phần tử
const changePassBtn = document.querySelector('.changePass');
const changePassForm = document.querySelector('.changePassForm');
const cancelChangePass = document.querySelector('#cancelChangePass');
const changePassFormElement = document.querySelector('#changePassForm');

// Ẩn/hiện form đổi mật khẩu
changePassBtn.addEventListener('click', () => {
    changePassForm.classList.remove('hidden');
}); ``

if (cancelChangePass) cancelChangePass.addEventListener('click', () => {
    if (addEventListener) {
        changePassForm.classList.add('hidden');
    }
});

// Xử lý đổi mật khẩu
if (changePassFormElement) changePassFormElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const currentPassInput = changePassFormElement.querySelector("input[placeholder='Mật khẩu hiện tại']");
    const newPassInput = changePassFormElement.querySelector("input[placeholder='Mật khẩu mới']");
    const confirmNewPassInput = changePassFormElement.querySelector("input[placeholder='Nhập lại mật khẩu mới']");

    const currentPass = currentPassInput.value.trim();
    const newPass = newPassInput.value.trim();
    const confirmNewPass = confirmNewPassInput.value.trim();

    // Kiểm tra đăng nhập
    if (!isLogin || !userlogin) {
        showAlert("Bạn cần đăng nhập để đổi mật khẩu.");
        changePassForm.classList.add('hidden');
        return;
    }

    // Kiểm tra mật khẩu hiện tại
    if (currentPass !== userlogin.password) {
        showAlert("Mật khẩu hiện tại không đúng.");
        currentPassInput.focus();
        return;
    }

    // Kiểm tra mật khẩu mới
    if (newPass.length < 6 || newPass.length > 20) {
        showAlert("Mật khẩu mới phải từ 6 đến 20 ký tự.");
        newPassInput.focus();
        return;
    }

    if (newPass !== confirmNewPass) {
        showAlert("Mật khẩu nhập lại không khớp.");
        confirmNewPassInput.focus();
        return;
    }

    // Cập nhật mật khẩu
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const userIndex = accounts.findIndex(account => account.username === userlogin.username);

    if (userIndex !== -1) {
        accounts[userIndex].password = newPass;
        localStorage.setItem("accounts", JSON.stringify(accounts));
        userlogin.password = newPass; // Cập nhật trong bộ nhớ tạm
        localStorage.setItem("userlogin", JSON.stringify(userlogin));
        showAlert("Đổi mật khẩu thành công!");
        changePassForm.classList.add('hidden');
    } else {
        showAlert("Đã xảy ra lỗi khi đổi mật khẩu.");
    }
});
