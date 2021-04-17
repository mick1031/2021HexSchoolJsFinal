// 預設 JS，請同學不要修改此處
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if (menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    } else {
        menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}

let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors: {
            "Louvre 雙人床架": "#DACBFF",
            "Antony 雙人床架": "#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});

let orders = [];
let data = [];
let products = [];

let header = {
    headers: {
        'Authorization': 'a1tPq1tvk2cOZoiEofFfvE6TC4D2'
    }
}

function init() {
    let url = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/mick1031/orders";
    axios.get(url, header).then(response => {
        orders = response.data.orders
        renderOrders();

    });
}

function renderOrders() {
    let html = "";
    orders.forEach(function (item) {
        html += templateOrders(item);
    })
    document.querySelector(".orderPage-table tbody").innerHTML = html;
}

function templateOrders(item) {
    let productStr = "";
    item.products.forEach(function (product) {
        productStr += `<p>${product.title}</p>`;
    })

    let statusStr = "";
    let createDateStr = "";

    return `
        <tr>
            <td>${item.id}</td>
            <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
                ${productStr}
            </td>
            <td>2021/03/08</td>
            <td class="orderStatus">
                <a href="#">未處理</a>
            </td>
            <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
        </tr>
`;
}

init()

let url = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/mick1031/orders";
axios.get(url, header).then(response => {
    data = response.data.orders

    data.forEach(function (item) {
        products = [...products, ...item.products]
    })

    console.log(products)
});
