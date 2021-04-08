
let header = {
    headers: {
        'Authorization': 'a1tPq1tvk2cOZoiEofFfvE6TC4D2'
    }
}

function addProductToCart() {

    let url = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/carts";
    let data = {
        data: {
            "productId": this.getAttribute("data-id"),
            "quantity": 1
        }
    };
    axios.post(url, data)
        .then(function (response) {
            getCarts();
        })
}

function delCart() {
    let url = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/carts/" + this.getAttribute("data-id");

    axios.delete(url)
        .then(function (response) {
            getCarts();
        })
}

function getProducts() {
    axios.get("https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/products")
        .then(function (response) {
            let list = response.data.products;
            let html = "";
            list.forEach(function (item) {
                html += templateProduct(item);
            })

            document.querySelector(".productWrap").innerHTML = html;

            document.querySelectorAll(".add-cart").forEach(function (item) {
                item.addEventListener("click", addProductToCart)
            })
        })
}

function templateProduct(item) {
    return `
        <li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="">
            <a href="#" class="add-cart" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>
    `
}

function getCarts() {
    axios.get("https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/carts")
        .then(function (response) {
            let list = response.data.carts;
            let html = "";
            let total = 0;
            list.forEach(function (item) {
                total += parseInt(item.product.price * item.quantity);
                html += templateCarts(item);
            })

            document.querySelector(".shoppingCart-table tbody").innerHTML = html;

            document.querySelector(".shoppingCart-table tfoot").innerHTML = lastCartTr(total);

            document.querySelectorAll(".del-carts").forEach(function (item) {
                item.addEventListener("click", delCart)
            })

            setEventDiscardAllBtn();
        })
}

function templateCarts(item) {
    return `
        <tr>
            <td>
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons del-carts" data-id="${item.id}">
                    clear
                </a>
            </td>
        </tr>
    `
}

function lastCartTr(total) {
    return `
        <tr>
            <td>
                <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
                <p>總金額</p>
            </td>
            <td>NT$${total}</td>
        </tr>
    `
}

function setEventDiscardAllBtn() {
    document.querySelector(".discardAllBtn").addEventListener("click", function () {
        axios.delete("https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/carts")
            .then(function (response) {
                getCarts();
            });
    })
}

getProducts();
getCarts();


document.querySelector(".orderInfo-btn").addEventListener("click", function () {

    let name = document.getElementById("customerName").value;
    let tel = document.getElementById("customerPhone").value;
    let email = document.getElementById("customerEmail").value;
    let address = document.getElementById("customerAddress").value;
    let payment = document.getElementById("tradeWay").value;

    let user = {
        name,
        tel,
        email,
        address,
        payment
    };

    // save order
    let url = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/orders";
    let data = {
        data: { user }
    };
    axios.post(url, data)
        .then(function (response) {
            getCarts();
        });

})