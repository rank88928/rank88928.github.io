// 購物車操作

import * as shoppimg from "./shopping.js"

// 取得最新本地選購紀錄
function get_shopping_storage() {
    return JSON.parse(localStorage.getItem('shopping_storage')) || [];
}

// 商品是否存在於資料表
function database_check_product_id(id) {
    return shoppimg.data_product.find(function (data) {
        return id === data.id;
    });
}
// 商品是否存在選購紀錄
function shopping_record_check(data, id) {
    return data.find(function (data) {
        return id === data.id;
    });
}
//檢查購物列表是否已有商品
function shopping_list_check(data_local, id) {

    let item = data_local.find(function (data) {
        return id === data.id
    })

    if (!item) {
        // 不在購物紀錄中 去資料庫找商品是否存在
        item = database_check_product_id(id);
        if (item) {
            data_local.push(item);
        } else {
            console.log("商品id不存在");
        }
    }
    return item
}

// 修改訂購數
function shopping_update_order_quantity(id, num) {
    let state = "未找到id";
    let data_local = get_shopping_storage();

    // console.log(data_local);

    let item = shopping_list_check(data_local, id);

    // console.log("原始值")
    // console.log(item)
    if (item) {
        if (0 < num && num <= item.quantity) {

            item.order += num;
            item.quantity -= num;

            localStorage.setItem('shopping_storage', JSON.stringify(data_local));
            state = "修改成功";
        } else {
            state = "修改失敗";
        }
    }
    return state
    // 報錯的條件可以具體 目前數量為0不能買時 直接跳"未找到id" 可以細化
};

// 清空訂購數
function shopping_clear_specific_order(id) {
    let state = "未找到id";
    let data_local = get_shopping_storage()

    let item = shopping_record_check(data_local, id);


    if (item) {
        item.quantity += item.order;
        item.order = 0
        data_local = data_local.filter(function (data) {
            return data.id !== id;
        })
        localStorage.setItem('shopping_storage', JSON.stringify(data_local));
        state = "移除成功";
    }
    console.log(item)
    return state
}



// 輔助函數
// 取得索引 檢查點擊中的元素在父元素當中有'同類名'的兄弟元素序列
function check_index(Class_name, click) {
    let elements = document.querySelectorAll(Class_name);
    return Array.from(elements).indexOf(click);
}

// 按鈕組件

// 減少選擇數量
function reduce_quantity(quantity) {
    let number = parseInt(quantity.value);
    if (number > 0) {
        quantity.value = number - 1;
    }
}
// 增加選擇數量
function increase_quantity(quantity) {
    let number = parseInt(quantity.value);
    quantity.value = number + 1;
}

// 修改訂購數量按鈕功能
function revise_order_quantity(id, quantity, name) {
    let num = parseInt(quantity.value);
    let state;
    let txt;

    if (0 < num) {
        // 之後要配合修改為檢查數字合法性
        state = shopping_update_order_quantity(id, num)
    }
    if (state === "修改成功") {
        txt = name + num + '份';

    } else if (state === "修改失敗") {
        txt = "剩餘不足或選擇數量異常";
    }
    prompt_message(state, txt);
}
// 耦合嚴重

// 清除單筆訂購資料按鈕功能
function clear_order_quantity(i) {

    let state;
    let data_local = get_shopping_storage()
    let id = data_local[i].id

    if (id) {
        state = shopping_clear_specific_order(id);
    }

    prompt_message(state);
}





// 提示訊息
function prompt_message(state, txt = "") {
    let box = document.querySelector('.status-box');
    let point;

    if (state === "修改成功") {
        point = '<i class="fa-solid fa-circle-check"></i>新增成功';
    } else if (state === "修改失敗") {
        point = '<i class="fa-solid fa-circle-xmark"></i>新增失敗';
    } else if (state === "移除成功") {
        point = '<i class="fa-solid fa-circle-check"></i>移除成功';
    } else {
        point = '<i class="fa-solid fa-circle-xmark"></i>異常錯誤';
    }


    let item =
        `<div class ="status">
            <div>${point}</div>
            <p>${txt}</p>
        </div>`
    box.insertAdjacentHTML('beforeend', item);

    setTimeout(() => {
        let item = document.querySelector('.status');
        item.remove();
    }, 3000);
}



export {
    get_shopping_storage,
    shopping_update_order_quantity,
    shopping_clear_specific_order,
    reduce_quantity,
    increase_quantity,
    revise_order_quantity,
    clear_order_quantity,
    check_index
};
