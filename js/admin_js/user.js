
function switchShowUser() {
    const customer_table = document.getElementById('table-customer');
    const admin_table = document.getElementById('table-admin');

    if (customer_table.style.display === 'none' || customer_table.style.display === '') {
        customer_table.style.display = 'block';
        admin_table.style.display = 'none';
    } else {
        customer_table.style.display = 'none';
        admin_table.style.display = 'block';
    }
}
function showAdminArr(arr) {
    let adminHtml = "";
    if (arr.length == 0) {
        adminHtml = `<tr><td colspan="5">Không có dữ liệu</td></tr>`; 
    } else {
        arr.forEach((admin, index) => {
            let tinhtrang = admin.status == 0 
                ? `<span class="status-no-complete">Bị khóa</span>` 
                : `<span class="status-complete">Hoạt động</span>`;
            adminHtml += ` <tr>
                <td>${index + 1}</td>
                <td>${admin.username}</td>
                <td>${admin.numberphone}</td>
                <td>${tinhtrang}</td>
                <td class="control control-table">
                    <button class="btn-edit" id="edit-account" onclick='editAdminAccount("${admin.numberphone}")' >
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete" id="delete-account" onclick="deleteAdminAccount(${admin.numberphone})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('show-admin').innerHTML = adminHtml;
}




let addAccount = document.getElementById('signup-button');
let updateAccount = document.getElementById("btn-update-account");


function openCreateAccount() {
    document.querySelector(".signup").classList.add("open");
    document.querySelector(".vaiTro").style.display="flex";
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "block";
    });
}

function signUpFormReset() {
    document.getElementById('name-account').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('password').value = "";
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}


window.onload = function () {
    showUser();
};


function showUserArr(arr) {
    let accountHtml = '';
    if (arr.length == 0) {
        accountHtml = `<td colspan="5">Không có dữ liệu</td>`;
    } else {
        arr.forEach((account, index) => {
            let tinhtrang = account.status == 0 ? `<span class="status-no-complete">Bị khóa</span>` : `<span class="status-complete">Hoạt động</span>`;
            accountHtml += ` <tr>
                <td>${index + 1}</td>
                <td>${account.username}</td>
                <td>${account.numberphone}</td>
                <td>${tinhtrang}</td>
                <td class="control control-table">
                    <button class="btn-edit" id="edit-account" onclick='editCustomerAccount("${account.numberphone}")' ><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" id="delete-account" onclick="deleteAcount('${account.numberphone}')"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('show-user').innerHTML = accountHtml;
}

function showUser() {
    let selectStatus = document.getElementById('tinh-trang-user').value; 
    let searchInput = document.getElementById('form-search-user').value.trim();
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : []; 
    let Adminaccounts = localStorage.getItem("adminAccounts") ? JSON.parse(localStorage.getItem("adminAccounts")) : []; 

    let result; 
    let resultAdmin;
    if (selectStatus === "2") { 
        result = accounts; 
        resultAdmin = Adminaccounts;
    } else if (selectStatus === "1") { 
        result = accounts.filter(item => item.status === 1);
        resultAdmin = Adminaccounts.filter(item => item.status === 1);
    } else if (selectStatus === "0") {
        result = accounts.filter(item => item.status === 0); 
        resultAdmin = Adminaccounts.filter(item => item.status === 0);;
    }

    if (searchInput) {
        result = result.filter(item => item.username.toUpperCase().includes(searchInput.toUpperCase())); 
        resultAdmin = resultAdmin.filter(item => item.username.toUpperCase().includes(searchInput.toUpperCase()));
    }

    showUserArr(result);
    showAdminArr(resultAdmin);
   
    
}
document.addEventListener('DOMContentLoaded', function () {
    showUser();
});



addAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let usernameUser = document.getElementById('name-account').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
    let role = document.querySelector('input[name="vaiTro"]:checked')?.value; 
    let statusUser = 1; 
    
    let formMessageName = document.querySelector('.form-message-name');
    let formMessagePhone = document.querySelector('.form-message-phone');
    let formMessagePassword = document.querySelector('.form-message-password');
    let formMessageRole = document.querySelector('.form-message-vaiTro');
    document.getElementById("updateAdminAccount").style.display="none";
    document.querySelector('.vaiTro').style.display = "flex";

    if (!usernameUser) {
        formMessageName.innerHTML = 'Vui lòng nhập tên tài khoản';
    } else {
        formMessageName.innerHTML = '';
    }

    if (!role) {
        formMessageRole.innerHTML = 'Vui lòng chọn vai trò';
    } else {
        formMessageRole.innerHTML = '';
    }

    let phonePattern = /^0\d{9}$/;
    if (!phoneUser) {
        formMessagePhone.innerHTML = 'Vui lòng nhập số điện thoại';
    } else if (!phonePattern.test(phoneUser)) {
        formMessagePhone.innerHTML = 'Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.';
    } else {
        formMessagePhone.innerHTML = '';
    }

    if (!passwordUser) {
        formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu';
    } else {
        formMessagePassword.innerHTML = '';
    }


    if (usernameUser && passwordUser && role && phoneUser && phonePattern.test(phoneUser)) {
        let user = {
            username: usernameUser,
            password: passwordUser,
            status: statusUser,
            role: role,
            numberphone: phoneUser
        };

        let adminAccounts = localStorage.getItem('adminAccounts') ? JSON.parse(localStorage.getItem('adminAccounts')) : [];
        let customerAccounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];

      
        let isDuplicate = [...adminAccounts, ...customerAccounts].some(account => 
            account.username === user.username || account.numberphone === user.numberphone
        );

        if (!isDuplicate) {
    
            if (role === 'customer') {
                customerAccounts.push(user);
                localStorage.setItem('accounts', JSON.stringify(customerAccounts));
            } else {
                adminAccounts.push(user);
                localStorage.setItem('adminAccounts', JSON.stringify(adminAccounts));
                showUser();
            }

            document.getElementById("updateCustomerAccount").style.display = "none";
            document.getElementById("updateAdminAccount").style.display = "none";
            document.querySelector(".signup").classList.remove("open");
            showUser();
            signUpFormReset();

            toast({ title: 'Thành công', message: 'Tài khoản đã được thêm thành công!', type: 'success', duration: 3000 });
        } else {
            toast({ title: 'Lỗi', message: 'Tên tài khoản hoặc số điện thoại đã tồn tại trong hệ thống!', type: 'error', duration: 3000 });
        }
    } else {
        toast({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin!', type: 'error', duration: 3000 });
    }
});

function editCustomerAccount(phone) {
    document.querySelector(".signup").classList.add("open");
    document.querySelector(".modal-container-title.add-account-e").style.display = "none";
    document.querySelector(".modal-container-title.edit-account-e").style.display = "block";
    document.querySelector('.vaiTro').style.display = "none";

    document.getElementById("signup-button").style.display = "none";
    document.getElementById("updateCustomerAccount").style.display = "block";
    document.getElementById("updateAdminAccount").style.display = "none";

    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let index = accounts.findIndex(item => item.numberphone === phone);

    if (index !== -1) {
     
        window.currentCustomerIndex = index;

        let account = accounts[index];
        document.getElementById("name-account").value = account.username;
        document.getElementById("phone").value = account.numberphone;
        document.getElementById("password").value = account.password;
        document.getElementById("user-status").checked = account.status === 1;
        if (account.role === "admin") {
            document.getElementById("admin").checked = true;
        } else {
            document.getElementById("customer").checked = true;
        }
    } else {
        console.error("Không tìm thấy tài khoản khách hàng!");
    }
    

}
function signUpFormReset() {
    document.getElementById('name-account').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('password').value = "";
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}


function editAdminAccount(phone) {
    document.querySelector(".signup").classList.add("open");

    
    document.querySelector(".modal-container-title.add-account-e").style.display = "none";
    document.querySelector(".modal-container-title.edit-account-e").style.display = "block";
    document.querySelector('.vaiTro').style.display = "none";

   
    document.getElementById("signup-button").style.display = "none";

    document.getElementById("updateCustomerAccount").style.display = "none";

    
    document.getElementById("updateAdminAccount").style.display = "block";

    let admins = JSON.parse(localStorage.getItem("adminAccounts")) || [];
    let index = admins.findIndex(item => item.numberphone === phone);

    if (index !== -1) {
     
        window.currentAdminIndex = index;

        let admin = admins[index];
        document.getElementById("name-account").value = admin.username;
        document.getElementById("phone").value = admin.numberphone;
        document.getElementById("password").value = admin.password;
        document.getElementById("user-status").checked = admin.status === 1;
        

        if (admin.role === "admin") {
            document.getElementById("admin").checked = true;
        } else {
            document.getElementById("customer").checked = true;
        }
    } else {
        console.error("Không tìm thấy tài khoản admin!");
    }
    
}

updateCustomerAccount.addEventListener("click", (e) => {
    e.preventDefault();


    let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    let admins = JSON.parse(localStorage.getItem("adminAccounts")) || [];


    let allAccounts = [...accounts, ...admins];


    let username = document.getElementById("name-account").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value;
    let status = document.getElementById("user-status").checked ? 1 : 0;

    let phonePattern = /^0\d{9}$/;

   
    let isDuplicate = allAccounts.some((account, index) => {
        return (
            index !== window.currentCustomerIndex && 
            (account.username === username || account.numberphone === phone)
        );
    });

    if (isDuplicate) {
        toast({
            title: 'Lỗi',
            message: 'Tên tài khoản hoặc số điện thoại đã tồn tại trong hệ thống!',
            type: 'error',
            duration: 3000,
        });
        return;
    }

    
    if (username && phone && phonePattern.test(phone) && password) {
  
        accounts[window.currentCustomerIndex].username = username;
        accounts[window.currentCustomerIndex].numberphone = phone;
        accounts[window.currentCustomerIndex].password = password;
        accounts[window.currentCustomerIndex].status = status;

        localStorage.setItem("accounts", JSON.stringify(accounts));
        showUser();
        toast({
            title: 'Thành công',
            message: 'Thông tin khách hàng đã được cập nhật thành công!',
            type: 'success',
            duration: 3000,
        });

        document.querySelector(".signup").classList.remove("open");
        signUpFormReset();
        resetModal();

        toast({
            title: 'Lỗi',
            message: 'Không thể lưu thay đổi. Vui lòng kiểm tra lại thông tin!',
            type: 'error',
            duration: 3000,
        });
    }
});

updateAdminAccount.addEventListener("click", (e) => {
    e.preventDefault();

    let admins = JSON.parse(localStorage.getItem("adminAccounts")) || [];
    let customers = JSON.parse(localStorage.getItem("accounts")) || [];

    let allAccounts = [...admins, ...customers];

    let username = document.getElementById("name-account").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let password = document.getElementById("password").value;
    let status = document.getElementById("user-status").checked ? 1 : 0;

    let phonePattern = /^0\d{9}$/;


    let isDuplicate = allAccounts.some((account, index) => {
        return (
            (account.username === username || account.numberphone === phone) &&
            !(index === window.currentAdminIndex && admins.includes(account))
        );
    });

    if (isDuplicate) {
        toast({
            title: 'Lỗi',
            message: 'Tên tài khoản hoặc số điện thoại đã tồn tại trong hệ thống!',
            type: 'error',
            duration: 3000,
        });
        return;
    }

    if (!username || !phone || !phonePattern.test(phone) || !password) {
        toast({
            title: 'Lỗi',
            message: 'Không thể lưu thay đổi. Vui lòng kiểm tra lại thông tin!',
            type: 'error',
            duration: 3000,
        });
        return;
    }

  

    admins[window.currentAdminIndex].username = username;
    admins[window.currentAdminIndex].numberphone = phone;
    admins[window.currentAdminIndex].password = password;
    admins[window.currentAdminIndex].status = status;

    localStorage.setItem("adminAccounts", JSON.stringify(admins));
    showUser();

    toast({
        title: 'Thành công',
        message: 'Thông tin quản trị viên đã được cập nhật thành công!',
        type: 'success',
        duration: 3000,
    });

    document.querySelector(".signup").classList.remove("open");
    signUpFormReset();
    resetModal();
});


function resetModal() {
    document.getElementById("name-account").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("password").value = "";
    document.getElementById("user-status").checked = false;

 
    document.getElementById("addAccount").style.display = "block";
    document.getElementById("updateCustomerAccount").style.display = "none";
    document.getElementById("updateAdminAccount").style.display = "none";
}


function deleteAdminAccount(phone) {
    let adminAccounts = JSON.parse(localStorage.getItem('adminAccounts')) || []; 

    let isAdmin = adminAccounts.some(item => item.numberphone == phone);
    if (isAdmin) {
        if (confirm("Bạn có chắc muốn xóa tài khoản quản trị viên này?")) {
            let index = adminAccounts.findIndex(item => item.numberphone == phone);
            if (index !== -1) {
                adminAccounts.splice(index, 1); 
                localStorage.setItem("adminAccounts", JSON.stringify(adminAccounts)); 
               showUser();
                alert("Tài khoản quản trị viên đã được xóa thành công!");
            }
        }
    } else {
        alert("Không tìm thấy tài khoản quản trị viên cần xóa!");
    }
    showUser(); 
}
function deleteAcount(phone) {
    let Accounts = JSON.parse(localStorage.getItem('accounts')) || []; 

    phone = phone.toString(); 

    let isCustomer = Accounts.some(item => item.numberphone == phone); 
    if (isCustomer) {
        if (confirm("Bạn có chắc muốn xóa tài khoản khách hàng này?")) {
            let index = Accounts.findIndex(item => item.numberphone == phone);
            if (index !== -1) {
                Accounts.splice(index, 1); 
                localStorage.setItem("accounts", JSON.stringify(Accounts)); 
                showUser(); 
                alert("Tài khoản khách hàng đã được xóa thành công!");
            }
        }
    } else {
        alert("Không tìm thấy khách hàng cần xóa!");
    }
}


















































































































