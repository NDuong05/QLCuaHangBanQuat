function formatDate(date) {
    let fm = new Date(date);
    if (isNaN(fm.getTime())) {
        return "N/A";
    }
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
}

function showOrder(arr) {
    let orderHtml = "";
    if (arr.length == 0) {
        orderHtml = `<td colspan="6">Không có dữ liệu</td>`
    } else {
        arr.forEach((item) => {
            let status = ""
            if (item.trangthai === false) {
                status = `<span class="status-no-complete">Chưa xử lý</span>`;
            } else if (item.trangthai === true) {
                status = `<span class="status-complete">Đã xử lý</span>`;
            } else if (item.trangthai === 1) {
                status = `<span class="status-complete-delivery">Đã giao</span>`
            } else {
                status = `<span class="status-complete-delivery">Đã hủy</span>`
            }

            let date = formatDate(item.date);
            orderHtml += `
            <tr>
            <td>${item.id}</td>
            <td>${item.user.username}</td>
            <td>${date}</td>
            <td>${vnd(item.total)}</td>                               
            <td>${status}</td>
           <td class="control">
            <button class="btn-detail" id="" onclick="detailOrder('${item.id}')"><i class="fa-solid fa-eye"></i> Chi tiết</button>
            </td>
            </tr>      
            `;
        });
    }
    document.getElementById("showOrder").innerHTML = orderHtml;
}

let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
window.onload = showOrder(orders);

function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("hoadon") ?
        JSON.parse(localStorage.getItem("hoadon")) : [];
    let ctDon = [];
    orderDetails.forEach((order) => {
        if (order.id == madon) {
            ctDon.push(...order.items);
        }
    });
    return ctDon;
}

function calculateEndDate(startDate, daysToAdd) {
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysToAdd);
    return endDate;
}

function detailOrder(id) {
    document.querySelector(".modal.detail-order").classList.add("open");
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    let order = orders.find((item) => item.id == id);
    let ctDon = getOrderDetails(id);

    let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;
    ctDon.forEach((item) => {
        let detaiSP = products.find(product => product.productid == item.id);
        if (detaiSP) {
            spHtml += `<div class="order-product">
                <div class="order-product-left">
                    <img src="${detaiSP.img}" alt="">
                    <div class="order-product-info">
                        <h4>${detaiSP.name}</h4>
                        <p class="order-product-quantity">SL: ${item.quantity}</p>
                    </div>
                </div>
                <div class="order-product-right">
                    <div class="order-product-price">
                        <span class="order-product-current-price">${vnd(item.quantity * detaiSP.price)}</span>
                    </div>                         
                </div>
            </div>`;
        }
    });
    spHtml += `</div></div>`;

    spHtml += `<div class="modal-detail-right">
        <ul class="detail-order-group">
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-calendar-days"></i> Ngày đặt hàng</span>
                <span class="detail-order-item-right">${formatDate(order.date)}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-user"></i> Người nhận</span>
                <span class="detail-order-item-right">${order.user.username}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-phone"></i> Số điện thoại</span>
                <span class="detail-order-item-right">${order.user.numberphone}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-coins"></i> Hình thức</span>
                <span class="detail-order-item-right">${order.payment_method}</span>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fa-solid fa-clock"></i> Thời gian giao</span>
                <p class="detail-order-item-b">${(order.date === "" ? "" : (formatDate(order.date) + " - ")) + formatDate(calculateEndDate(order.date, 3))}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fa-solid fa-location-dot"></i> Địa chỉ nhận</span>
                <p class="detail-order-item-b">${order.diachi}</p>
            </li>
        </ul>
    </div>`;

    document.querySelector(".modal-detail-order").innerHTML = spHtml;

    let classDetailBtn, textDetailBtn;
    let showCancelBtn = true;
    let showStatusBtn = true;

    if (order.trangthai === false) {
        classDetailBtn = "btn-chuaxuly";
        textDetailBtn = "Chưa xử lý";
    } else if (order.trangthai === true) {
        classDetailBtn = "btn-daxuly";
        textDetailBtn = "Đã xử lý";
    } else if (order.trangthai === 1) {
        classDetailBtn = "btn-dagiao";
        textDetailBtn = "Đã giao";
        showCancelBtn = false;
    } else {
        classDetailBtn = "btn-dahuy";
        textDetailBtn = "Đã hủy";
        showCancelBtn = false;
    }

    document.querySelector(".modal-detail-bottom").innerHTML = `
        <div class="modal-detail-bottom-left">
            <div class="price-total">
                <span class="thanhtien">Thành tiền</span>
                <span class="price">${vnd(order.total)}</span>
            </div>
        </div>
        <div class="modal-detail-bottom-right">
            ${showCancelBtn ? `<button class="modal-detail-btn btn-cancel" onclick="cancelOrder('${order.id}', this)">${order.trangthai === 3 ? 'Đã hủy' : 'Hủy đơn hàng'}</button>` : ''}
            ${showStatusBtn ? `<button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus('${order.id}', this)">${textDetailBtn}</button>` : ''}
        </div>`;
}

function changeStatus(id, el) {
    let orders = JSON.parse(localStorage.getItem("hoadon"));
    let order = orders.find((item) => item.id == id);

    if (order.trangthai === false) {
        order.trangthai = true;
        el.classList.remove("btn-chuaxuly");
        el.classList.add("btn-daxuly");
        el.innerHTML = "Đã xử lý";
    } else if (order.trangthai === true) {
        order.trangthai = 1;
        el.classList.remove("btn-daxuly");
        el.classList.add("btn-dagiao");
        el.innerHTML = "Đã giao";
    }

    localStorage.setItem("hoadon", JSON.stringify(orders));
    findOrder(orders);
    detailOrder(id);
}

function cancelOrder(id, el) {
    let orders = JSON.parse(localStorage.getItem("hoadon"));
    let products = JSON.parse(localStorage.getItem("productList")) || [];
    let order = orders.find((item) => item.id == id);

    if (order.trangthai !== 3) {
        order.trangthai = 3;
        el.innerHTML = "Đã hủy";
        el.classList.add("btn-dahuy");

        // Hoàn lại số lượng sản phẩm vào kho
        order.items.forEach(item => {
            const productIndex = products.findIndex(p => p.productid == item.id);
            if (productIndex !== -1) {
                products[productIndex].quantity += parseInt(item.quantity);
            }
        });

        // Cập nhật lại productList trong localStorage
        localStorage.setItem("productList", JSON.stringify(products));
    }

    localStorage.setItem("hoadon", JSON.stringify(orders));
    findOrder(orders);
}

function findOrder() {
    let tinhTrang = document.getElementById("tinh-trang").value;
    let ct = document.getElementById("form-search-order").value;
    let timeStart = document.getElementById("time-start").value;
    let timeEnd = document.getElementById("time-end").value;
    let selectedQuan = document.getElementById("quan").value;

    if (timeEnd < timeStart && timeEnd !== "" && timeStart !== "") {
        alert("Lựa chọn thời gian sai!");
        return;
    }

    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];

    let result = tinhTrang === "2" ? orders : orders.filter((item) => String(item.trangthai) === tinhTrang);

    if (selectedQuan !== "Chọn Quận") {
        result = result.filter((item) => item.objdiachi && item.objdiachi.quan === selectedQuan);
    }

    result = ct === "" ? result : result.filter((item) =>
        item.user.username.toLowerCase().includes(ct.toLowerCase()) || item.id.toString().toLowerCase().includes(ct.toLowerCase())
    );

    if (timeStart !== "" && timeEnd === "") {
        result = result.filter((item) => new Date(item.date) >= new Date(timeStart).setHours(0, 0, 0));
    } else if (timeStart === "" && timeEnd !== "") {
        result = result.filter((item) => new Date(item.date) <= new Date(timeEnd).setHours(23, 59, 59));
    } else if (timeStart !== "" && timeEnd !== "") {
        result = result.filter((item) =>
            new Date(item.date) >= new Date(timeStart).setHours(0, 0, 0) &&
            new Date(item.date) <= new Date(timeEnd).setHours(23, 59, 59)
        );
    }

    showOrder(result);
}

function cancelSearchOrder() {
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    document.getElementById("tinh-trang").value = 2;
    document.getElementById("form-search-order").value = "";
    document.getElementById("time-start").value = "";
    document.getElementById("time-end").value = "";
    showOrder(orders);
}