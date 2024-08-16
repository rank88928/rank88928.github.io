import * as get_data from './get_data.js';


// 首頁背景輪播
$(document).ready(function () {
    $('.carousel-index').slick({
        dots: false,
        infinite: true,
        speed: 4000,
        fade: true,
        cssEase: 'linear',
        arrows: false,
        autoplay: true,
        pauseOnFocus: false,
        pauseOnHover: false,
    });

    // 立刻啟動切換圖片
    setTimeout(function () {
        $('.carousel-index').slick('slickGoTo', 1);
    }, 0);

    // 切換時掛載進度條CSS類名 重置動畫效果
    $('.carousel-index').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        slick.$slides.eq(nextSlide).find('img').addClass('distant');

        countdown_animation()
    });

    // 結束後移除CSS類名 
    $('.carousel-index').on('afterChange', function (event, slick, currentSlide) {
        slick.$slides.eq(currentSlide).find('img').removeClass('distant');
    });
});

// 計時條動畫
let countdown = document.querySelector("#countdown");

function countdown_animation() {
    countdown.classList.add("countdown-progress");

    setTimeout(function () {
        countdown.classList.remove("countdown-progress");
    }, 7000);
}


// 簡介RWD輪播
window.addEventListener("load", slick_viewport_response);
window.addEventListener("resize", slick_viewport_response);

function slick_viewport_response() {
    let width = window.innerWidth;

    if (width <= 768) {
        // 如果 Slick 尚未初始化，則初始化
        if (!$('.carousel-box').hasClass('slick-initialized')) {
            $('.carousel-box').slick({
                dots: true,
                infinite: true,
                speed: 500,
                fade: true,
                cssEase: 'linear',
                arrows: false,
                adaptiveHeight: false,
            });
        }
    } else {
        // 如果 Slick 已經初始化，並且寬度超過 768px，則銷毀 Slick
        if ($('.carousel-box').hasClass('slick-initialized')) {
            $('.carousel-box').slick('unslick');
        }
    }
}



// 懸停卡片 放大產品圖片成為容器背景圖
let product_content = document.querySelector(".product-content");

product_content.addEventListener("mouseover", function (event) {
    let img;
    let target = event.target;
    let element = target.closest('li');// 找到指向目的最近的li

    if (element) {
        img = element.querySelector('img');
        specify_background_image(img)
    } else {
        product_content.style.backgroundImage = `url(/img/bk2.JPG)`
    }
});

function specify_background_image(img) {
    let url = new URL(img.src);
    product_content.style.backgroundImage = `url(${url.pathname})`;
}



// 渲染商品目錄

//推薦商品目錄
async function render_html_index_card() {
    let sorted_data = await select_recommendations_id();
    let card_content = document.querySelector('#card_content');
    let buffer_html = '';
    sorted_data.forEach(function (data, index) {
        buffer_html += index_card_html(data);
    });
    card_content.innerHTML = buffer_html;
    console.log(card_content)
}
render_html_index_card();






//推薦商品-篩選排序
async function select_recommendations_id() {

    let recommend_id = [9, 10, 12, 6, 5, 7, 8, 4];//推薦順序
    let data = await get_data.get_product_information();//取得全部商品資料

    let recommend_list = data.filter(itme => recommend_id.includes(itme.id))//篩選
    let sorted_data_id = recommend_list.sort((a, b) => recommend_id.indexOf(a.id) - recommend_id.indexOf(b.id)); // 重新排序
    return sorted_data_id;
}
// 共同結構
function index_card_html(data) {
    let html =
        `<li class="wow animate-fade-in-left" data-wow-delay='0.3s'>
            <div class="product-card">
                <div class="img">
                    <img src="/img/product/${data.url}.jpg" alt="">
                    <span><i class="fa-solid fa-heart"></i></span>
                </div>
                <div class="txt">
                    <h3>${data.name}</h3>
                    <p>${data.description}</p>
                    <div class="price">
                        <span>NT$:${data.price}</span>
                        <a href="" class="shopping-i-btn-1"><i class="fa-solid fa-cart-shopping icon "></i></a>
                    </div>
                </div>
            </div>
        </li>`
    return html
}



// 問答手風琴
let accordion_item = document.querySelectorAll(".accordion-item");
let question = document.querySelectorAll(".question");
let question_i = document.querySelectorAll(".question i");
let answer = document.querySelectorAll(".answer");

if (accordion_item) {
    accordion_item.forEach(function (question, i) {
        question.addEventListener("click", function () {

            let state = answer[i].classList.contains("an-auto");

            for (let i = 0; i < answer.length; i++) {
                answer[i].classList.remove("an-auto");
                question_i[i].classList.remove("down-rotate");
            };
            // 每次只顯示一個 如果要個別打開收合 只需留下面toggle判斷狀態 不需要if

            if (!state) {
                answer[i].classList.toggle("an-auto");
                question_i[i].classList.toggle("down-rotate");
            }
            // 一開始沒有顯示才新增標籤
        });
    });
};

