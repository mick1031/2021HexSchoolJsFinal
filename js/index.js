
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

            document.querySelector(".products").innerHTML = html;

            document.querySelectorAll(".add-cart").forEach(function (item) {
                item.addEventListener("click", addProductToCart)
            })
        })
}

function templateProduct(item) {
    return `
        <div>
            <img src="${item.images}" alt="">
            <div class="add-cart" data-id="${item.id}">加入購物車</div>
            <div>
                <div>${item.title}</div>
                <div>${item.origin_price}</div>
                <div>${item.price}</div>
            </div>
        </div>
    `
}

function getCarts() {
    axios.get("https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/carts")
        .then(function (response) {
            let list = response.data.carts;
            let html = "";
            list.forEach(function (item) {
                html += templateCarts(item);
            })

            document.querySelector(".carts-table tbody").innerHTML = html;


            document.querySelectorAll(".del-carts").forEach(function (item) {
                item.addEventListener("click", delCart)
            })
        })
}

function templateCarts(item) {
    return `
        <tr>
            <td>
                <img src="${item.product.images}">
                ${item.product.title}
            </td>
            <td>${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>${item.product.price * item.quantity}</td>
            <td> 
                <button class="del-carts" data-id="${item.id}">del</button> 
            </td>
        </tr>
    `
}

getProducts();
getCarts();

document.querySelector(".del-all-carts").addEventListener("click", function () {
    axios.delete("https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/mick1031/carts")
    .then(function(response) {
        getCarts();
    });
})

