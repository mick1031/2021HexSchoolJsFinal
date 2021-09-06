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

let orders = [];
let products = [];

let header = {
    headers: {
        'Authorization': 'a1tPq1tvk2cOZoiEofFfvE6TC4D2'
    }
}

function init() {

    renderView();

    document.querySelector(".discardAllBtn").addEventListener("click", function (event) {
        let url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/mick1031/orders";

        axios.delete(url, header).then(response => {
            renderView();
        });
    })

    document.querySelector(".orderPage-table tbody").addEventListener("click", function (event) {
        event.preventDefault();

        let style = event.target.getAttribute("class");

        if (style == "js-changeStatus") {
            changeStatus(event.target);
        }

        if (style == "delSingleOrder-Btn") {
            delSingleOrder(event.target);
        }

    })

}

function changeStatus(target) {
    let status = !(target.getAttribute("data-status") == "true");
    let id = target.getAttribute("data-id");
    let url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/mick1031/orders";
    let obj = {
        data: {
            "id": id,
            "paid": status
        }
    };
    axios.put(url, obj, header).then(response => {
        renderView();
    });
}

function delSingleOrder(target) {
    let id = target.getAttribute("data-id");
    let url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/mick1031/orders/" + id;
    axios.delete(url, header).then(response => {
        renderView();
    });
}

function renderView() {
    let url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/mick1031/orders";
    axios.get(url, header).then(response => {
        orders = response.data.orders
        setProducts();

        renderOrders();
        renderPieChart();
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

    let statusStr = '未處裡';
    if (item.paid) {
        statusStr = '已處裡';
    }

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
                <a href="#" class="js-changeStatus" data-id="${item.id}" data-status="${item.paid}" >${statusStr}</a>
            </td>
            <td>
                <input type="button" class="delSingleOrder-Btn" data-id="${item.id}" value="刪除">
            </td>
        </tr>
`;
}

function setProducts() {
    products = [];
    orders.forEach(function (item) {
        products = products.concat(item.products);
    })
}

function renderPieChart() {

    let category = {};
    products.forEach(function (item) {
        if (category[item.category] == undefined) {
            category[item.category] = 0;
        }
        category[item.category] += item.quantity * item.price;
    })

    let keys = Object.keys(category);
    let drawData = [];

    keys.forEach(function (item) {
        drawData.push([item, category[item]]);
    })

    c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: drawData
        },
    });

}

init()
