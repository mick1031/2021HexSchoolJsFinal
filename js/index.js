let carts = [];

function addProductToCart(event) {
    const id = event.target.getAttribute("data-id");
    let cartId = "";
    let quantity = 1;

    carts.forEach(function (item) {
        if (item.product.id == id) {
            cartId = item.id;
            quantity = item.quantity;
        }
    })

    if (cartId == "") {
        const url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/carts";
        const data = {
            data: {
                "productId": id,
                "quantity": 1
            }
        };
        axios.post(url, data)
            .then(function (response) {
                renderCarts();
            })
    } else {
        const url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/carts";
        const data = {
            data: {
                "id": cartId,
                "quantity": quantity + 1
            }
        };
        axios.patch(url, data)
            .then(function (response) {
                renderCarts();
            })
    }

}

function delCart(event) {
    event.preventDefault();

    let url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/carts/" + event.target.getAttribute("data-id");

    axios.delete(url)
        .then(function (response) {
            renderCarts();
        })
}

function renderProducts() {

    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/products")
        .then(function (response) {
            const products = response.data.products;
            const category = document.querySelector(".productSelect").value;
            let list =  [];

            if(category != "全部"){
                products.forEach(function(item) {
                    if(category == item.category){
                        list.push(item);
                    }
                })
            } else {
                list = products;
            }

            let html = "";
            list.forEach(function (item) {
                html += templateProduct(item);
            })

            document.querySelector(".productWrap").innerHTML = html;
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

function renderCarts() {
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/carts")
        .then(function (response) {
            carts = response.data.carts;
            const cartsData = response.data;
            let html = "";
            let total = 0;
            carts.forEach(function (item) {
                total += parseInt(item.product.price * item.quantity);
                html += templateCarts(item);
            })

            document.querySelector(".shoppingCart-table tbody").innerHTML = html;

            document.querySelector(".shoppingCart-table tfoot").innerHTML = lastCartTr(cartsData);

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

function lastCartTr(cartsData) {
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
            <td>NT$${cartsData.finalTotal}</td>
        </tr>
    `
}

function setEventDiscardAllBtn() {
    document.querySelector(".discardAllBtn").addEventListener("click", function () {
        axios.delete("https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/carts")
            .then(function (response) {
                renderCarts();
            });
    })
}

function init() {
    renderProducts();
    renderCarts();

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
        let url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/mick1031/orders";
        let data = {
            data: { user }
        };
        axios.post(url, data)
            .then(function (response) {
                document.getElementById("customerName").value = "";
                document.getElementById("customerPhone").value = "";
                document.getElementById("customerEmail").value = "";
                document.getElementById("customerAddress").value = "";
                document.getElementById("tradeWay").value = "ATM";
                renderCarts();
            });

    })

    document.querySelector(".shoppingCart-table").addEventListener("click", function (event) {
        event.preventDefault();

        if (event.target.classList.contains("del-carts")) {
            delCart(event);
        }

    })

    document.querySelector(".productWrap").addEventListener("click", function (event) {
        event.preventDefault();
        if (event.target.classList.contains("add-cart")) {
            addProductToCart(event);
        }
    })

    document.querySelector(".productSelect").addEventListener("change", renderProducts);

}

init();