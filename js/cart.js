const payment = document.getElementById('payment-method');
const payment_popup = document.getElementById('payment-method-popup');
let icon_active = null;
let user = null;
let totalQuantity = 0;
let totalPrice = 0;

window.onload = function () {
    loadCart();
    updateUser();
}

function updateUser() {
    if (userlogin == undefined) {
        if (document.getElementById('not_payment-info')) document.getElementById('not_payment-info').style.display = 'none';
        if (document.getElementById('payment-info')) document.getElementById('payment-info').style.display = 'none';
        if (document.getElementById('not_login')) document.getElementById('not_login').style.display = 'block';
        return;
    }

    if (document.getElementById('not_login')) document.getElementById('not_login').style.display = 'none';
    const accountsInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
    let user = accountsInfo.find(acc => acc.username == userlogin.username);
    if (user == undefined) {
        if (document.getElementById('not_payment-info')) document.getElementById('not_payment-info').style.display = 'block';
        return;
    }
    updatePersonalInfo(user);
    if (document.getElementById('not_payment-info')) document.getElementById('not_payment-info').style.display = 'none';
    if (document.getElementById('payment-info')) document.getElementById('payment-info').style.display = 'block';
}

function updatePersonalInfo(user) {
    console.log(user);

    let s = `
            <p>Họ và tên: ${user.username}</p>
            <p>Địa chỉ: ${user.diachi} ${user.phuong} ${user.quan} ${user.thanhpho}</p>
            <p>SĐT: ${user.sdt}</p>`
    if (document.getElementById('info')) document.getElementById('info').innerHTML = s;
}

function updateQuantity() {
    if (totalQuantity != 0) {
        if (totalQuantity > 9) totalQuantity = '9+'
        document.getElementById('item-quantity').style.display = 'block';
        document.getElementById('item-quantity').innerText = totalQuantity;
    }
    else
        document.getElementById('item-quantity').style.display = 'none';
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cart);
    const container = document.getElementById('cart-container');
    const productArray = JSON.parse(localStorage.getItem('productList')) || [];

    let s = '';

    if (cart.length > 0 && container) {
        s = `<tr>
                            <th></th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Tổng</th>
                            <th></th>
                        </tr>`;
        cart.forEach(item => {
            let imgsrc, ten, gia;
            for (let i = 0; i < productArray.length; i++) {
                if (item.id == productArray[i].productid) {
                    imgsrc = productArray[i].img;
                    ten = productArray[i].name;
                    gia = productArray[i].price;
                    break;
                }
            }
            gia = gia.toLocaleString('vi-VN');
            s += `<tr class="cart-item">
                            <td style="display: none;">${item.id}</td>
                            <td><img src="${imgsrc}" alt="" style="height: 55px;"></td>
                            <td>
                                ${ten}
                            </td>
                            <td>
                                <span class="item-price">
                                    ${gia}
                                </span>
                                <span> VNĐ</span>
                            </td>
                            <td>
                                <div id="chinhsoluong">
                                    <button style="color: gray;" class="decrease">
                                        -
                                    </button>
                                    <p class="quantity">${item.quantity}</p>
                                    <button class="increase">
                                        +
                                    </button>
                                </div>
                            </td>
                            <td>
                                <p class="item-total">
                                </p>
                            </td>
                            <td>
                                <div class="xoa">
                                    <i class="fa-solid fa-xmark"></i>
                                </div>
                            </td>
                        </tr>`
        });
    }
    if (container)
        container.innerHTML = s;
    updateCart();
    EventListener();
    checkEmptyCart();
}

function checknumber(inp) {
    inp.value = inp.value.replace(/[^0-9]/g, '');

    if (inp.value.trim().length != inp.maxLength) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        inp.parentElement.querySelector('.error-input').classList.remove('invalid');
        return true;
    }
}

function checkSDT(inp) {
    inp.value = inp.value.replace(/[^0-9]/g, '');

    const regex = /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])\d{7}$/;

    if (!regex.test(inp.value)) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.focus();
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        return false; // Sai định dạng
    }

    inp.parentElement.classList.remove('invalid');
    inp.parentElement.classList.add('valid');
    inp.parentElement.querySelector('.error-input').classList.remove('invalid');
    return true; // Ngày tháng hợp lệ
}

if (document.getElementById('find_wrap')) document.getElementById('find_wrap').addEventListener('mousedown', function (event) {
    var find = document.getElementById("find");
    var find_wrap = document.getElementById("find_wrap");

    if (!find.contains(event.target)) {
        find.classList.remove('show');
        find_wrap.classList.add('hide');
        setTimeout(() => {
            find_wrap.classList.remove('hide');
            find_wrap.style.display = 'none';
        }, 400);

    }
});

function DinhDangSoThe(inputElement) {
    let value = inputElement.value.replace(/[^0-9]/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join('-') || '';
    inputElement.value = formattedValue;

    if (inputElement.value.trim().length != 19) {
        inputElement.parentElement.classList.add('invalid');
        inputElement.parentElement.classList.remove('valid');
        inputElement.parentElement.querySelector('.error-input').classList.add('invalid');
        inputElement.focus();
        return false;
    } else {
        inputElement.parentElement.classList.remove('invalid');
        inputElement.parentElement.classList.add('valid');
        inputElement.parentElement.querySelector('.error-input').classList.remove('invalid');
        return true;
    }
}

function DinhDangNgay(inp) {
    let value = inp.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    inp.value = value;

    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    if (!regex.test(inp.value)) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    }

    const [month, year] = inp.value.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year == currentYear && month < currentMonth)) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    }
    inp.parentElement.classList.remove('invalid');
    inp.parentElement.classList.add('valid');
    inp.parentElement.querySelector('.error-input').classList.remove('invalid');
    return true;
}

function MoPopUpThanhtoan(icon) {
    if (icon_active) {
        icon_active.classList.remove('active');
    }
    icon_active = icon;
    icon_active.classList.add('active');

    if (icon_active.classList.contains('fa-money-bill-1-wave')) return;

    payment_popup.classList.add('show');
    payment.classList.add('show');
    payment.style.display = 'block';
}

function DongPopUpThanhtoan() {
    if (userlogin.sothe == undefined) {
        document.querySelectorAll('.error-input').forEach(error => error.classList.remove('invalid'));
        document.querySelectorAll('.payment-icon').forEach(icon => icon.classList.remove('active'));
    }
    payment_popup.classList.remove('show');
    payment.classList.remove('show');
    setTimeout(() => {
        payment.style.display = 'none';
    }, 500);
}

if (payment) payment.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        DongPopUpThanhtoan();
    }
});

document.getElementById('input-information').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkEmailkhuyenmai();
    }
})

if (payment) payment.addEventListener('click', function (event) {
    if (!payment_popup.contains(event.target)) {
        DongPopUpThanhtoan();
    }
});

if (document.getElementById('bar_wrap')) document.getElementById('bar_wrap').addEventListener('mousedown', function (event) {
    let bar = document.getElementById("bar");
    let bar_wrap = document.getElementById("bar_wrap");
    if (!bar.contains(event.target)) {
        bar_wrap.classList.add('hide');
        bar.classList.remove('show');
        setTimeout(() => {
            bar_wrap.classList.remove('hide');
            bar_wrap.style.display = 'none';
        }, 400);
    }
});

function checkInput(inp) {
    let val = inp.value;
    if (val.trim() == '') {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        inp.parentElement.querySelector('.error-input').classList.remove('invalid');
        return true;
    }
}

function checkEmail(inp) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(inp.value)) {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        inp.parentElement.querySelector('.error-input').classList.remove('invalid');
        return true;
    } else {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    }
}

function checkEmail2(inp) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(inp.value)) return true;
    return false;
}

function checkEmailkhuyenmai() {
    if (checkEmail2(document.getElementById('email-info'))) {
        displayToast('Đã gửi thông tin khuyến mãi qua Email');
        console.log('true');
        document.getElementById('email-info').value = '';
    } else {
        displayToast('Địa chỉ Email không hợp lệ');
        console.log('false');
    }
}

function checkName(inp) {
    let value = inp.value.replace(/[0-9]/g, '');
    inp.value = value;
    if (value.trim() == '') {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        inp.parentElement.querySelector('.error-input').classList.remove('invalid');
        return true;
    }
}

function checkDiaChi(inp) {
    const diachiRegex = /^\d+(\/\d+)*\s+([\p{L}\s]+)$/u;
    if (!diachiRegex.test(inp.value)) {
        inp.parentElement.classList.add('invalid');
        inp.parentElement.classList.remove('valid');
        inp.parentElement.querySelector('.error-input').classList.add('invalid');
        inp.focus();
        return false;
    } else {
        inp.parentElement.classList.remove('invalid');
        inp.parentElement.classList.add('valid');
        inp.parentElement.querySelector('.error-input').classList.remove('invalid');
        return true;
    }
}

if (document.getElementById('payment-form')) document.getElementById('payment-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let flag = true;
    flag &= checkName(document.getElementById('firstname'));
    flag &= checkName(document.getElementById('lastname'));
    flag &= checkEmail(document.getElementById('email'));
    flag &= checkDiaChi(document.getElementById('diachi'));
    flag &= DinhDangSoThe(document.getElementById('sothe'));
    flag &= checknumber(document.getElementById('ccv'));
    flag &= DinhDangNgay(document.getElementById('hanthe'));
    flag &= checknumber(document.getElementById('zipcode'));
    if (flag) {
        icon_active.classList.add('active');
        userlogin.sothe = true;
        DongPopUpThanhtoan();
    }
})

function moPopUpNhapdiachi() {
    document.getElementById('nhapdiachi_wrap').classList.add('show');
    document.getElementById('nhapdiachi-form').classList.add('show');
    document.getElementById('nhapdiachi_wrap').style.display = 'block';

    const accountsInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
    let user = accountsInfo.find(acc => acc.username == userlogin.username);
    document.getElementById('diachicuaban').innerText = user.diachi;

    if (document.getElementById('city-selected-cuaban')) {
        document.getElementById('city-selected-cuaban').textContent = user.thanhpho;
        document.getElementById('city-dropdown-cuaban').parentElement.classList.add('valid');
    }
    if (document.getElementById('district-selected-cuaban')) {
        document.getElementById('district-selected-cuaban').textContent = user.quan;
        document.getElementById('district-dropdown-cuaban').parentElement.classList.add('valid');
    }
    if (document.getElementById('ward-selected-cuaban')) {
        document.getElementById('ward-selected-cuaban').textContent = user.phuong;
        document.getElementById('ward-dropdown-cuaban').parentElement.classList.add('valid');
    }
}

function dongPopUpNhapdiachi() {
    document.getElementById('nhapdiachi_wrap').classList.remove('show');
    document.getElementById('nhapdiachi-form').classList.remove('show');
    setTimeout(() => {
        document.getElementById('nhapdiachi_wrap').style.display = 'none';
    }, 500);
}

const nhapdiachiform = document.getElementById('nhapdiachi-form');
if (nhapdiachiform) nhapdiachiform.addEventListener('click', (e) => {
    const closebtn = document.getElementById('diachi-btn');

    const diachi1 = document.getElementById('diachicuaban');
    const diachi2 = document.getElementById('diachinhap');

    const diachi1_btn = document.getElementById('diachicuaban-btn');
    const diachi2_btn = document.getElementById('diachinhap-btn');
    const accountsInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
    let user = accountsInfo.find(acc => acc.username == userlogin.username);
    if (closebtn.contains(e.target)) {
        dongPopUpNhapdiachi();
    } else if (diachi1_btn.contains(e.target)) {
        dongPopUpNhapdiachi();
        HienXacNhanDonHang({ diachi: diachi1.innerText, phuong: user.phuong, quan: user.quan, thanhpho: user.thanhpho });
    } else if (diachi2_btn.contains(e.target)) {
        let flag = true;
        flag &= checkDiaChiKhac();
        flag &= checkDiaChi(diachi2);
        if (flag) {
            if (checkDiaChiKhac()) {
                dongPopUpNhapdiachi();
                HienXacNhanDonHang({ diachi: diachi2.value, phuong: wardSelected2.textContent.trim(), quan: districtSelected2.textContent.trim(), thanhpho: citySelected2.textContent.trim() })
            }
        }
    }
});

function loadBill() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const container = document.getElementById('hoadon-container-2');
    let s = '';
    const productArray = JSON.parse(localStorage.getItem('productList'));
    if (cart && container) {
        s = `<tr>
                            <th></th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Tổng</th>
                        </tr>`;
        cart.forEach(item => {
            let imgsrc, ten, gia;
            for (let i = 0; i < productArray.length; i++) {
                if (item.id == productArray[i].productid) {
                    imgsrc = productArray[i].img;
                    ten = productArray[i].name;
                    gia = productArray[i].price;
                    break;
                }
            }
            gia = gia.toLocaleString('vi-VN');
            const price = gia.split('.').join('');
            const quantity = parseInt(item.quantity);
            let subtotal = price * quantity;
            subtotal = subtotal.toLocaleString('vi-VN');
            s += `<tr>
                            <td style="display: none;">${item.id}</td>
                            <td><img src="${imgsrc}" alt="" style="height: 55px;"></td>
                            <td style="width: 36%;">
                                ${ten}
                            </td>
                            <td style="width: 20%">
                                <span class="item-price">
                                    ${gia}
                                </span>
                                <span> VNĐ</span>
                            </td>
                            <td>
                                <p class="quantity" style="text-align: center;">${quantity}</p>
                            </td>
                            <td style="width: 20%";>
                                <p class="item-total">${subtotal} VNĐ
                                </p>
                            </td>
                        </tr>`
        });
    }
    if (container) container.innerHTML = s;
}

function updateXacNhanDonHang(diachi) {
    const info = document.getElementById('hoadon-info');
    const accountsInfo = JSON.parse(localStorage.getItem('userInfo')) || [];
    let info_user = accountsInfo.find(account => account.username == userlogin.username)
    let tamtinh = parseFloat(document.getElementById('total-price').innerText.split('.').join(''));
    let tong = parseFloat(tamtinh) + 12000;
    tong = tong.toLocaleString('vi-VN');
    tamtinh = tamtinh.toLocaleString('vi-VN');
    let payment = "";

    if (icon_active.classList.contains('fa-money-bill-1-wave')) payment = 'Tiền mặt'
    else payment = 'Chuyển khoản';
    const diachigiaohang = diachi.diachi + ' ' + diachi.phuong + ' ' + diachi.quan + ' ' + diachi.thanhpho;

    info.querySelector('.ten').innerText = `${info_user.hoten}`
    info.querySelector('.diachi').innerText = `${diachigiaohang}`
    info.querySelector('.sdt').innerText = `${info_user.sdt}`
    info.querySelector('.tamtinh').innerText = `${tamtinh} VNĐ`
    info.querySelector('.tienship').innerText = `12.000 VNĐ`
    info.querySelector('.tong').innerText = `${tong} VNĐ`
    info.querySelector('.method').innerText = `${payment}`

    document.getElementById('xacnhandonhang-btn').addEventListener('click', () => {
        LuuHoaDon(diachi);
        displayToast('Bạn đã đặt hàng thành công');
    })
}

function HienXacNhanDonHang(diachi) {
    document.getElementById('hoadon').classList.add('show');
    document.getElementById('hoadon-container').classList.add('show');
    document.getElementById('hoadon').style.display = 'block';
    updateXacNhanDonHang(diachi);
    loadBill();
}

function DongXacNhanDonHang() {
    document.getElementById('hoadon').classList.remove('show');
    document.getElementById('hoadon-container').classList.remove('show');
    setTimeout(() => {
        document.getElementById('hoadon').style.display = 'none';
    }, 500);
}

if (document.getElementById('xacnhandonhang-btn')) document.getElementById('xacnhandonhang-btn').addEventListener('click', function () {
    DongXacNhanDonHang();
})

function ThanhToan() {
    if (totalQuantity == 0) return displayToast('Giỏ hàng của bạn đang trống');
    if (!icon_active) return displayToast('Bạn phải chọn phương thức thanh toán trước');

    // Kiểm tra số lượng tồn kho trước khi thanh toán
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('productList')) || [];
    
    for (let item of cart) {
        const product = products.find(p => p.productid == item.id);
        if (!product) {
            displayToast(`Sản phẩm với ID ${item.id} không tồn tại!`);
            return;
        }
        if (product.quantity < item.quantity) {
            displayToast(`Số lượng sản phẩm "${product.name}" không đủ! Tồn kho: ${product.quantity}, bạn đặt: ${item.quantity}`);
            return;
        }
    }

    moPopUpNhapdiachi();
}

function TaoMaHD() {
    let hoadon = JSON.parse(localStorage.getItem('hoadon')) || [];
    return 'HD' + hoadon.length;
}

function LuuHoaDon(diachi) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = JSON.parse(localStorage.getItem('productList')) || [];

    let payment = "";
    if (icon_active.classList.contains('fa-money-bill-1-wave')) payment = 'Tiền mặt';
    else payment = 'Chuyển khoản';

    const info = document.getElementById('hoadon-info');
    const diachigiaohang = info.querySelector('.diachi').innerText;

    const HoaDon = {
        id: TaoMaHD(),
        user: userlogin,
        date: new Date().toISOString().split('T')[0],
        items: cart,
        total: totalPrice,
        payment_method: payment,
        trangthai: false,
        diachi: diachigiaohang,
        objdiachi: diachi
    };

    // Trừ số lượng sản phẩm trong kho
    cart.forEach(item => {
        const productIndex = products.findIndex(p => p.productid == item.id);
        if (productIndex !== -1) {
            products[productIndex].quantity -= item.quantity;
        }
    });

    // Cập nhật lại productList trong localStorage
    localStorage.setItem('productList', JSON.stringify(products));

    let hoadon = JSON.parse(localStorage.getItem('hoadon')) || [];
    hoadon.push(HoaDon);
    localStorage.setItem('hoadon', JSON.stringify(hoadon));
    localStorage.removeItem('cart');

    document.querySelectorAll('.payment-icon').forEach(icon => icon.classList.remove('active'));
    loadCart();
}

function displayToast(msg) {
    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    const toastmsg = document.getElementById('toast-msg');
    toastmsg.innerText = msg;
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2900);
}

function EventListener() {
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function () {
            const quantityElement = this.previousElementSibling;
            let currentQuantity = parseInt(quantityElement.textContent);
            quantityElement.textContent = currentQuantity + 1;
            updateCart();
        });
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function () {
            const quantityElement = this.nextElementSibling;
            let currentQuantity = parseInt(quantityElement.textContent);
            if (currentQuantity > 1) {
                quantityElement.textContent = currentQuantity - 1;
                updateCart();
            }
        });
    });

    document.querySelectorAll('.xoa').forEach(btn => {
        btn.addEventListener('click', function () {
            const parentElement = this.parentElement.parentElement;
            const maSanPham = parentElement.firstElementChild.textContent;
            parentElement.remove();
            removeFromCart(maSanPham);
            updateCart();
        })
    });
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    checkEmptyCart();
}

function saveCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    let cart = [];

    cartItems.forEach(item => {
        const id = item.firstElementChild.textContent;
        const quantity = item.querySelector('.quantity').textContent;
        cart.push({ id, quantity });
    });

    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    totalPrice = 0;
    totalQuantity = 0;

    cartItems.forEach(item => {
        const quantityElement = item.querySelector('.quantity');
        const price = item.querySelector('.item-price').innerText.split('.').join('');
        const quantity = parseInt(quantityElement.textContent);
        const subtotal = price * quantity;

        item.querySelector('.item-total').textContent = subtotal.toLocaleString('vi-VN') + ' VNĐ';

        totalPrice += subtotal;
        totalQuantity += quantity;
    });

    if (document.getElementById('total-price'))
        document.getElementById('total-price').textContent = totalPrice.toLocaleString('vi-VN') + ' VNĐ';

    saveCart();
    updateQuantity();
}

function checkEmptyCart() {
    if (totalQuantity == 0) {
        if (document.getElementById('empty-cart')) {
            document.getElementById('empty-cart').style.display = 'block';
            document.getElementsByClassName('container')[0].style.display = 'none';
        }
    } else {
        if (document.getElementById('empty-cart')) {
            document.getElementById('empty-cart').style.display = 'none';
            document.getElementsByClassName('container')[0].style.display = 'block';
        }
    }
}

function hien(y) {
    var element = document.getElementById(y);
    console.log(element);
    if (element) {
        if (y === 'find_wrap') {
            element.style.display = 'block';
            element.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById('find').classList.add('show');
        } else if (y === 'bar_wrap') {
            element.style.display = 'block';
            element.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById('bar').classList.add('show');
        }
    }
}

function exit() {
    var x = document.getElementById("find_wrap");
    document.getElementById('find').classList.remove('show');
    setTimeout(() => {
        x.style.display = "none";
    }, 500);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        let find_wrap = document.getElementById('find_wrap');
        let bar_wrap = document.getElementById('bar_wrap');

        if (find_wrap) {
            document.getElementById('find').classList.remove('show');
            find_wrap.classList.add('hide');
            setTimeout(() => {
                find_wrap.style.display = 'none';
                find_wrap.classList.remove('hide');
            }, 400);
        }
        if (bar_wrap) {
            document.getElementById('bar').classList.remove('show');
            bar_wrap.classList.add('hide');
            setTimeout(() => {
                bar_wrap.style.display = 'none';
                bar_wrap.classList.remove('hide');
            }, 400);
        }
    }
});

var brandArray = [
    {
        brandid: 'Panasonic',
        brandintro: '<br>- Thương hiệu Nhật Bản.<br>- Thành lập năm 1918.<br>- Panasonic nổi tiếng với các sản phẩm tủ lạnh, máy lạnh, tivi và các thiết bị gia dụng như lò vi sóng, quạt, máy xay sinh tố,...<br>- Các sản phẩm Panasonic nổi tiếng với độ bền cao, tiết kiệm điện, mẫu mã đẹp.'
    },
    {
        brandid: 'Asia',
        brandintro: '<br>- Thương hiệu Việt Nam.<br>- Thành lập 1990.<br>- Được vinh danh nằm trong top 20 "Nhãn hiệu hàng đầu Việt Nam - Sản phẩm vàng, Dịch vụ vàng Việt Nam năm 2017".<br>- Được biết đến các sản phẩm quạt điện, quạt sưởi chất lượng, giá thành phù hợp với đại đa số người tiêu dùng Việt.'
    },
    {
        brandid: 'Senko',
        brandintro: '<br>- Thương hiệu Việt Nam.<br>- Thành lập năm 1998.<br>- Với sứ mệnh "Làm mát cho cuộc sống" quạt điện SENKO đáp ứng mọi nhu cầu của khách hàng và là sự lựa chọn hoàn hảo của mọi nhà về quạt bàn, quạt treo, quạt lửng, quạt đứng, quạt trần,...<br>- Chất lượng cao, mẫu mã đẹp, tiết kiệm năng lượng là những tiêu chí cốt lõi trong mỗi sản phẩm của quạt điện Senko.'
    },
    {
        brandid: 'Kangaroo',
        brandintro: '<br>- Thương hiệu Việt Nam.<br>- Thành lập 2003. Các sản phẩm Kangaroo hướng đến phục vụ sức khỏe và tiện nghi cuộc sống như máy lọc nước, hàng gia dụng - nhà bếp và các thiết bị điện tiêu dùng khác.<br>- "Không đối đầu mà luôn đi trước đón đầu" là tiêu chí trong hoạt động sản xuất và kinh doanh của Kangaroo.'
    },
];

const cityDropdown = document.getElementById('city-dropdown');
const districtDropdown = document.getElementById('district-dropdown');
const wardDropdown = document.getElementById('ward-dropdown');

const cityMenu = document.getElementById('city-menu');
const districtMenu = document.getElementById('district-menu');
const wardMenu = document.getElementById('ward-menu');

const citySelected = document.getElementById('city-selected');
const districtSelected = document.getElementById('district-selected');
const wardSelected = document.getElementById('ward-selected');

function toggleMenu(menu) {
    menu.classList.toggle('menu-open');
    if (menu.style.display == 'block') {
        menu.classList.remove('menu-open');
        setTimeout(() => {
            menu.style.display = 'none';
        }, 300);
    } else menu.style.display = 'block';
}

function closeAllMenus(exceptMenu) {
    [wardMenu, districtMenu, cityMenu, wardMenu2, districtMenu2, cityMenu2].forEach(menu => {
        if (menu !== exceptMenu) {
            menu.classList.remove('menu-open');
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
            menu.parentElement.parentElement.parentElement.classList.remove('valid');
            menu.parentElement.querySelector('.caret').classList.remove('caret-rotate');
        }
    });
}

const data = {
    TPHCM: {
        "Quận 1": ["Phường Tân Định", "Phường Bến Nghé", "Phường Đa Kao"],
        "Quận 3": ["Phường Võ Thị Sáu", "Phường 9", "Phường 11"]
    },
    HN: {
        "Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Buồm", "Phường Hàng Đào"],
        "Đống Đa": ["Phường Láng Hạ", "Phường Ô Chợ Dừa", "Phường Văn Miếu"]
    }
};

if (cityDropdown) cityDropdown.addEventListener('click', () => {
    toggleMenu(cityMenu);
    cityDropdown.querySelector('.caret').classList.toggle('caret-rotate');
    closeAllMenus(cityMenu);
});

if (districtDropdown) districtDropdown.addEventListener('click', () => {
    toggleMenu(districtMenu);
    closeAllMenus(districtMenu);
    districtDropdown.querySelector('.caret').classList.toggle('caret-rotate');
});

if (wardDropdown) wardDropdown.addEventListener('click', () => {
    toggleMenu(wardMenu);
    closeAllMenus(wardMenu);
    wardDropdown.querySelector('.caret').classList.toggle('caret-rotate');
});

if (cityMenu) cityMenu.addEventListener('click', (event) => {
    const city = event.target.getAttribute('data-city');

    if (city) {
        citySelected.textContent = event.target.textContent;
        citySelected.style.color = "#000";

        cityDropdown.parentElement.classList.add('valid');
        cityDropdown.parentElement.classList.remove('invalid');

        districtDropdown.parentElement.classList.remove('valid');

        wardDropdown.parentElement.classList.remove('valid');

        districtMenu.innerHTML = '';
        wardMenu.innerHTML = '';
        districtSelected.textContent = "Chọn quận / huyện";
        wardSelected.textContent = "Chọn phường / xã";
        districtSelected.style.color = "#6c6c6c";
        wardSelected.style.color = "#6c6c6c";
        toggleMenu(districtMenu);
        closeAllMenus(districtMenu);
        Object.keys(data[city]).forEach(district => {
            const li = document.createElement('li');
            li.textContent = district;
            li.addEventListener('click', () => {
                toggleMenu(wardMenu);
                closeAllMenus(wardMenu);
                districtSelected.textContent = district;
                districtSelected.style.color = "#000";

                districtDropdown.parentElement.classList.add('valid');
                districtDropdown.parentElement.classList.remove('invalid');

                wardDropdown.parentElement.classList.remove('valid');

                wardMenu.innerHTML = '';
                wardSelected.textContent = "Chọn phường / xã";
                wardSelected.style.color = "#6c6c6c";
                data[city][district].forEach(ward => {
                    const wardLi = document.createElement('li');
                    wardLi.textContent = ward;
                    wardLi.addEventListener('click', () => {
                        wardDropdown.parentElement.classList.add('valid');
                        wardDropdown.parentElement.classList.remove('invalid');
                        wardSelected.textContent = ward;
                        wardSelected.style.color = "#000";
                        closeAllMenus(null);
                    });
                    wardMenu.appendChild(wardLi);
                });
            });
            districtMenu.appendChild(li);
        });

        cityMenu.style.display = 'none';
    }
});

function getDropdownData() {
    const city = citySelected.textContent.trim();
    const district = districtSelected.textContent.trim();
    const ward = wardSelected.textContent.trim();

    if (city === "Hãy chọn một thành phố" || district === "Hãy chọn một quận" || ward === "Hãy chọn một phường") {
        return;
    }

    console.log({
        city: city,
        district: district,
        ward: ward
    });

    return
}

document.addEventListener('mousedown', function (event) {
    const nameUser = document.getElementById('user--name');
    const hihi = document.getElementsByClassName('user--selection')[0];
    if (!nameUser.contains(event.target) && !hihi.contains(event.target)) {
        document.getElementsByClassName('user--selection')[0].classList.add('hidden');
    }
});

const cityDropdown2 = document.getElementById('city-dropdown-2');
const districtDropdown2 = document.getElementById('district-dropdown-2');
const wardDropdown2 = document.getElementById('ward-dropdown-2');

const cityMenu2 = document.getElementById('city-menu-2');
const districtMenu2 = document.getElementById('district-menu-2');
const wardMenu2 = document.getElementById('ward-menu-2');

const citySelected2 = document.getElementById('city-selected-2');
const districtSelected2 = document.getElementById('district-selected-2');
const wardSelected2 = document.getElementById('ward-selected-2');

if (cityDropdown2) cityDropdown2.addEventListener('click', () => {
    toggleMenu(cityMenu2);
    cityDropdown2.querySelector('.caret').classList.toggle('caret-rotate');
    closeAllMenus(cityMenu2);
});

if (districtDropdown2) districtDropdown2.addEventListener('click', () => {
    toggleMenu(districtMenu2);
    closeAllMenus(districtMenu2);
    districtDropdown2.querySelector('.caret').classList.toggle('caret-rotate');
});

if (wardDropdown2) wardDropdown2.addEventListener('click', () => {
    toggleMenu(wardMenu2);
    closeAllMenus(wardMenu2);
    wardDropdown2.querySelector('.caret').classList.toggle('caret-rotate');
});

if (cityMenu2) cityMenu2.addEventListener('click', (event) => {
    const city = event.target.getAttribute('data-city');

    if (city) {
        citySelected2.textContent = event.target.textContent;
        citySelected2.style.color = "#000";

        cityDropdown2.parentElement.classList.add('valid');
        cityDropdown2.parentElement.classList.remove('invalid');

        districtDropdown2.parentElement.classList.remove('valid');

        wardDropdown2.parentElement.classList.remove('valid');

        districtMenu2.innerHTML = '';
        wardMenu2.innerHTML = '';
        districtSelected2.textContent = "Chọn quận / huyện";
        wardSelected2.textContent = "Chọn phường / xã";
        districtSelected2.style.color = "#6c6c6c";
        wardSelected2.style.color = "#6c6c6c";
        toggleMenu(districtMenu2);
        closeAllMenus(districtMenu2);
        Object.keys(data[city]).forEach(district => {
            const li = document.createElement('li');
            li.textContent = district;
            li.addEventListener('click', () => {
                toggleMenu(wardMenu2);
                closeAllMenus(wardMenu2);
                districtSelected2.textContent = district;
                districtSelected2.style.color = "#000";

                districtDropdown2.parentElement.classList.add('valid');
                districtDropdown2.parentElement.classList.remove('invalid');

                wardDropdown2.parentElement.classList.remove('valid');

                wardMenu2.innerHTML = '';
                wardSelected2.textContent = "Chọn phường / xã";
                wardSelected2.style.color = "#6c6c6c";
                data[city][district].forEach(ward => {
                    const wardLi = document.createElement('li');
                    wardLi.textContent = ward;
                    wardLi.addEventListener('click', () => {
                        wardDropdown2.parentElement.classList.add('valid');
                        wardDropdown2.parentElement.classList.remove('invalid');
                        wardSelected2.textContent = ward;
                        wardSelected2.style.color = "#000";
                        closeAllMenus(null);
                    });
                    wardMenu2.appendChild(wardLi);
                });
            });
            districtMenu2.appendChild(li);
        });

        cityMenu2.style.display = 'none';
    }
});

function buyProduct(productId) {
    const productList = JSON.parse(localStorage.getItem('productList')) || [];
    const product = productList.find(p => p.productid === productId);

    if (!product) {
        alert('Sản phẩm không tồn tại!');
        return;
    }

    if (product.quantity <= 0) {
        alert('Sản phẩm đã hết hàng!');
        return;
    }

    product.quantity -= 1;
    localStorage.setItem('productList', JSON.stringify(productList));

    document.getElementById(`quantity-${productId}`).innerText = product.quantity;

    alert('Mua sản phẩm thành công!');
}

function checkDiaChiKhac() {
    let flag = true;
    const city = citySelected2.innerText.trim();
    const district = districtSelected2.innerText.trim();
    const ward = wardSelected2.innerText.trim();

    if (city === "Chọn tỉnh / thành") {
        flag = false;
        cityDropdown2.parentElement.classList.add('invalid');
    }

    if (district === "Chọn quận / huyện") {
        flag = false;
        districtDropdown2.parentElement.classList.add('invalid');
    }

    if (ward === "Chọn phường / xã") {
        flag = false;
        wardDropdown2.parentElement.classList.add('invalid');
    }
    if (flag) return true;
    return false;
}