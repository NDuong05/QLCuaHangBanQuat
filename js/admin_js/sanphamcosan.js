const productImages = [
    "\\hinhanh\\quatdien\\10001193-quat-treo-panasonic-f-409m-xam.jpg",
    "\\hinhanh\\quatdien\\ASIAA16021.jpg",
    "\\hinhanh\\quatdien\\AsiaVY377.png",
    "\\hinhanh\\quatdien\\AsiaVY377.png",
    "\\hinhanh\\quatdien\\AsiaVY377.png",
    "\\hinhanh\\quatdien\\ls163003-9269.jpg",
    "\\hinhanh\\quatdien\\Quat-dung-hen-gio-Senko-DH1600-Xam-350x350.jpg",
    "\\hinhanh\\quatdien\\Quat-dung-hen-gio-Senko-DH1600-Xam-350x350.jpg",
    "\\hinhanh\\quatdien\\Quat-dung-hen-gio-Senko-DH1600-Xam-350x350.jpg",
    "\\hinhanh\\quatdien\\Quat-dung-kangaroo-kg725-768x768.jpg",
    "\\hinhanh\\quatdien\\quat-dung-panasonic-f-307kh-xanh-10000487-01.jpg",
    "\\hinhanh\\quatdien\\quat-dung-panasonic-f-307kh-xanh-10000487-01.jpg",
    "\\hinhanh\\quatdien\\quat-dung-panasonic-f-307kh-xanh-10000487-01.jpg"
];

let productList = JSON.parse(localStorage.getItem("productList")) || [];

const baseProduct = {
    brandid: "Asia",
    category: "quattreotuong",
    madein: "Việt Nam",
    power: "45W",
    size: "Ngang 47 cm - Cao 69 cm - Sâu 36.5 cm - Nặng 3.5 kg",
    status: 1,
    year: "2022"
};

const prices = [400000, 450000, 500000];

function getRandomPrice() {
    const randomIndex = Math.floor(Math.random() * prices.length);
    return prices[randomIndex];
}

if (productList.length === 0) {
    productImages.forEach((image, index) => {
        const newProduct = {
            ...baseProduct,
            img: image,
            productid: Math.floor(Math.random() * 20000) + 1,
            name: `Quạt Treo Asia-VY377-${index + 1}`,
            price: getRandomPrice(),
            quantity: Math.floor(Math.random() * 20) + 1 // Thêm số lượng ngẫu nhiên từ 1 đến 20
        };

        productList.push(newProduct);
    });

    localStorage.setItem("productList", JSON.stringify(productList));
}

const customerAccounts = [
    {
        numberphone: "0912345678",
        password: "12345678",
        role: "customer",
        status: 1,
        username: "quanghoang"
    },
    {
        numberphone: "0312345678",
        password: "12345678",
        role: "customer",
        status: 1,
        username: "nguyenduong"
    },
    {
        numberphone: "0918765432",
        password: "12345678",
        role: "customer",
        status: 1,
        username: "trongnghia"
    },
    {
        numberphone: "0312345679",
        password: "12345678",
        role: "customer",
        status: 1,
        username: "hoangson"
    },
    {
        numberphone: "0912345679",
        password: "12345678",
        role: "customer",
        status: 1,
        username: "hoanglong"
    },
    {
        numberphone: "0312345680",
        password: "12345678",
        role: "customer",
        status: 1,
        username: "khainguyen"
    }
];

const adminAccounts = [
    {
        numberphone: "0987654321",
        password: "admin",
        role: "admin",
        status: 1,
        username: "admin"
    },
    {
        numberphone: "0312345681",
        password: "admin",
        role: "admin",
        status: 1,
        username: "admin1"
    }
];

let accounts = JSON.parse(localStorage.getItem("accounts"));
let adminAccountsInLocal = JSON.parse(localStorage.getItem("adminAccounts"));

if (!accounts || accounts.length === 0) {
    accounts = [...customerAccounts];
    localStorage.setItem("accounts", JSON.stringify(accounts));
}

if (!adminAccountsInLocal || adminAccountsInLocal.length === 0) {
    adminAccountsInLocal = [...adminAccounts];
    localStorage.setItem("adminAccounts", JSON.stringify(adminAccountsInLocal));
}

