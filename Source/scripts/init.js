window.onload = () => {

    var app = new Vue({
        el: '#main',
        data: {
            heightPromoSection: 0,
            categoriesMenu: [],
            sectionMenu: [],
            productsBlocks: [],
            currentProductsBlock: [],
            sectionMenuTitle: 'Наше меню',
            numberInCart: 0,
            currentOrder: [],
            listProduct: [],
            amountOrder: 0,
            catalogItems: [],
            name: '',
            phone: '',
            address: '',
            message: '',
            sumOrder: '',
            errors: false,
            nameError: false,
            phoneError: false,
            addressError: false,
            orderError: false,
            orderErrorText: '',
            check1: true,
            check2: false
        },
        methods: {
            getHeightPromoSection(){
                const promoSection = document.querySelector('.promo');
                this.heightPromoSection = promoSection.clientHeight;
            },
            fixedHeader(){
                const header = document.querySelector('.header');

                if (window.pageYOffset > this.heightPromoSection - 200){
                    header.classList.add('header--fixed');
                }else {
                    if(header.classList.contains('header--fixed')){
                        header.classList.remove('header--fixed');
                    }
                }
            },
            initEventsClick(arr, section){
                if(arr.length > 1){
                    arr.forEach(item => {
                        item.addEventListener('click', (event) => {
                            event.preventDefault();
                            if(document.querySelector('body').classList.contains('menu-active')){
                                document.querySelector('body').classList.remove('menu-active')
                            }
                            this.scrollInSection(section)
                        })
                    })
                }else {
                    arr[0].addEventListener('click', (event) => {
                        event.preventDefault();
                        if(document.querySelector('body').classList.contains('menu-active')){
                            document.querySelector('body').classList.remove('menu-active')
                        }
                        this.scrollInSection(section)
                    })
                }

            },
            initEventsScroll(){

                const aboutLink = document.querySelectorAll('.link-about');
                const sectionWhy = document.querySelector('.why');
                this.initEventsClick(aboutLink, sectionWhy);

                const menuLink = document.querySelectorAll('.link-menu');
                const sectionMenu = document.querySelector('.menu');
                this.initEventsClick(menuLink, sectionMenu);

                const deliveryLink = document.querySelectorAll('.link-delivery');
                const sectionDelivery = document.querySelector('.delivery');
                this.initEventsClick(deliveryLink, sectionDelivery);

                const contactsLink = document.querySelectorAll('.link-contacts');
                const sectionFooter = document.querySelector('.footer');
                this.initEventsClick(contactsLink, sectionFooter);

                const orderLink = document.querySelectorAll('.link-order');
                const sectionOrder = document.querySelector('.order');
                this.initEventsClick(orderLink, sectionOrder);
            },
            getCoords(elem) {
                let box = elem.getBoundingClientRect();
                return box.top + pageYOffset;
            },
            scrollInSection(section){
                const top = this.getCoords(section);
                window.scrollTo({
                    top: top - 100, // height fixed header
                    behavior: 'smooth'
                });
            },
            toggleAdaptiveMenu(){
                document.querySelector('body').classList.toggle('menu-active');
            },
            openProducts(event){
                const title = event.target.textContent;
                let currentCategory = event.target.parentElement;
                if(!currentCategory.hasAttribute('data-id')){
                    currentCategory = currentCategory.parentElement;
                }
                const currentCategoryId = currentCategory.getAttribute('data-id');
                this.currentProductsBlock = this.productsBlocks.filter(item => {
                    if(item.getAttribute('data-id') === currentCategoryId){
                        return item;
                    }
                })
                if(this.currentProductsBlock.length){
                    this.sectionMenuTitle = title;
                    this.categoriesMenu.style.display = 'none';
                    this.currentProductsBlock[0].style.height = 'auto';
                    const initSlider = this.currentProductsBlock[0].querySelector('.slick-initialized');
                    if(initSlider){
                        this.currentProductsBlock[0].classList.add('catalog-block--active')
                    }
                    if(window.innerWidth < 1615){
                        this.currentProductsBlock[0].classList.add('catalog-block--active')
                    }
                    this.sectionMenu.classList.add('menu--active');
                    this.scrollInSection(this.sectionMenu);
                }
            },
            closeProductsBlock(){
                this.sectionMenuTitle = 'Наше меню';
                this.categoriesMenu.style.display = 'flex';
                this.currentProductsBlock[0].style.height = '0';

                if(this.currentProductsBlock[0].classList.contains('catalog-block--active')){
                    this.currentProductsBlock[0].classList.remove('catalog-block--active')
                }

                this.sectionMenu.classList.remove('menu--active');
            },
            addProductToCart(event){
                this.numberInCart++;
                const item = this.getCatalogItem(event.target);
                const id = item.getAttribute('data-id')
                const repeat = this.currentOrder.find(item => item.id === id);
                if(typeof repeat !== 'undefined'){
                    item.classList.add('catalog-item--add');
                    repeat.number++;
                    repeat.price = this.checkPrice(id, repeat.number);
                }else {
                    item.classList.add('catalog-item--add');
                    const title = item.querySelector('h6').textContent;
                    let price = item.querySelector('.catalog-item__price').textContent;
                    price = Number(price.split(' ')[0]);
                    const number = 1;
                    const orderItem = {id, title, price, number};
                    this.currentOrder.push(orderItem);
                    const copyItem = JSON.parse(JSON.stringify(orderItem));
                    this.listProduct.push(copyItem);
                    this.catalogItems.forEach(item => {
                        const idItem = item.getAttribute('data-id');
                        if(idItem === id){
                            item.classList.add('catalog-item--add');
                        }
                    })
                }
                this.ordering();
            },
            getCatalogItem(target){
                if(!target.hasAttribute('data-id')){
                    target = target.parentElement;
                    return this.getCatalogItem(target);
                }else {
                    return target;
                }
            },
            ordering(){
                this.amountOrder = this.currentOrder.reduce((sum, item) => sum + item.price, 0);
            },
            increaseNumberProductInOrder(id){
                const product = this.currentOrder.find(item => item.id === id);
                product.number++;
                this.numberInCart++;
                product.price = this.checkPrice(id, product.number);
                this.ordering();
            },
            reduceNumberProductInOrder(id){
                const product = this.currentOrder.find(item => item.id === id);
                product.number--;
                this.numberInCart--;
                product.price = this.checkPrice(id, product.number);
                if(product.number === 0){
                    this.catalogItems.forEach(item => {
                        const id = item.getAttribute('data-id');
                        if(id === product.id){
                            item.classList.remove('catalog-item--add');
                        }
                    })
                    this.currentOrder = this.currentOrder.filter(item => item.id !== id);
                }
                this.ordering();
            },
            checkPrice(id, number){
                const product = this.listProduct.find(item => item.id === id);
                return product.price * number;
            },
            submitForm: function (event) {

                const form = this.searchForm(event.target);

                form.className = 'form';
                this.nameError = false;
                this.phoneError = false;
                this.addressError = false;
                this.orderError = false;
                this.errors = false;

                if (!this.currentOrder.length) {
                    this.orderErrorText = `В заказе отсутствует товар.`;
                    this.errors = true;
                    this.orderError = true;
                }

                if (this.name === '') {
                    this.nameError = true;
                    this.errors = true;
                    form.classList.add('form--error_name');
                }
                if (this.address === '') {
                    this.addressError = true;
                    this.errors = true;
                    form.classList.add('form--error_address');
                }
                if (this.phone === '') {
                    this.phoneError = true;
                    this.errors = true;
                    form.classList.add('form--error_phone');
                }

                if(this.amountOrder < 1500 && !this.orderError){
                    this.errors = true;
                    const sum = 1500 - this.amountOrder;
                    this.orderErrorText = `Заказ должен быть от 1500 рублей. Не хватает ${sum} рублей.`;
                    this.orderError = true;
                }

                if (!this.errors) {

                    this.currentOrder.forEach(item => {
                        delete item['id']
                    })

                   /*let order = this.currentOrder.map(item => {
                        return `Наименование: ${item.title} - Стоимость: ${item.price} рублей - Кол-во: ${item.number} шт.`;
                    })*/

                    let formData = new FormData(form);

                    formData.append('message', JSON.stringify(this.currentOrder));
                    formData.append('sum', String(this.amountOrder));


                    if (this.check1) {
                        formData.append('payment', 'Наличными');
                    } else {
                        formData.append('payment', 'Переводом на банковскую карту');
                    }

                    fetch('/send.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then((res) => {
                            if (res.ok) {
                                location.assign("/thanks.html");
                            } else {
                                console.log('Заказ не отправился!');
                            }
                        })
                }
            },
            searchForm(target){
                if(target.hasAttribute('action')){
                    return target;
                }else {
                    target = target.parentElement;
                    return this.searchForm(target);
                }
            },
            checkCheckbox(){
                this.check1 = !this.check1;
                this.check2 = !this.check2;
            }
        },
        mounted(){

            this.initEventsScroll();

            this.getHeightPromoSection();

           /* window.addEventListener('resize', () => {
                this.getHeightPromoSection()
            })*/

            //window.addEventListener('scroll', this.fixedHeader);

            this.categoriesMenu = document.querySelector('.menu-block');
            this.sectionMenu = document.querySelector('.menu');
            this.productsBlocks = this.sectionMenu.querySelectorAll('.catalog-block');
            this.productsBlocks = [...this.productsBlocks];

            this.catalogItems = document.querySelectorAll('.catalog-item');
        },
    })

    try {
        // Slider Best Products
        var bestProductSlider = document.querySelector('.best-slider');

        var initBestSlider = function initBestSlider(flag, section) {
            if (flag) {
                var parent = section.parentElement;
                var arrowNext = parent.querySelector('.arrow-next');
                var arrowPrev = parent.querySelector('.arrow-prev');
                $(section).slick({
                    dots: true,
                    infinite: false,
                    arrows: true,
                    nextArrow: $(arrowNext),
                    prevArrow: $(arrowPrev),
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [{
                        breakpoint: 1615,
                        settings: {
                            slidesToShow: 3
                        }
                    }, {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2
                        }
                    }, {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 1
                        }
                    }]
                });
            } else {
                $(section).slick('unslick');
            }
        };

        if (bestProductSlider.children.length > 4) {
            bestProductSlider.classList.add('best-slider--slider');
            bestProductSlider && initBestSlider(true, bestProductSlider);
        }

        if (window.innerWidth < 1615) {
            bestProductSlider && initBestSlider(true, bestProductSlider);
            bestProductSlider.classList.add('best-slider--active');
        }

        window.addEventListener('resize', function () {
            if (window.innerWidth < 1615) {
                if (!bestProductSlider.classList.contains('slick-initialized')) {
                    bestProductSlider.classList.add('best-slider--active');
                    bestProductSlider && initBestSlider(true, bestProductSlider);
                }
            } else {
                if (bestProductSlider.classList.contains('slick-initialized') && !bestProductSlider.classList.contains('best-slider--slider')) {
                    bestProductSlider.classList.remove('best-slider--active');
                    bestProductSlider && initBestSlider(false, bestProductSlider);
                }
            }
        });
    } catch (e) {
        console.log(e + 'best slider');
    }

    try {
        // Slider Promotion Products
        var promotionProductSlider = document.querySelector('.promotion-slider');

        var initPromotionSlider = function initPromotionSlider(flag, section) {
            if (flag) {
                var parent = section.parentElement;
                var arrowNext = parent.querySelector('.arrow-next');
                var arrowPrev = parent.querySelector('.arrow-prev');
                $(section).slick({
                    dots: true,
                    infinite: false,
                    arrows: true,
                    nextArrow: $(arrowNext),
                    prevArrow: $(arrowPrev),
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [{
                        breakpoint: 1615,
                        settings: {
                            slidesToShow: 3
                        }
                    }, {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2
                        }
                    }, {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 1
                        }
                    }]
                });
            } else {
                $(section).slick('unslick');
            }
        };

        if (promotionProductSlider.children.length > 4) {
            promotionProductSlider.classList.add('promotion-slider--slider');
            promotionProductSlider && initPromotionSlider(true, promotionProductSlider);
        }

        if (window.innerWidth < 1615) {
            promotionProductSlider && initPromotionSlider(true, promotionProductSlider);
            promotionProductSlider.classList.add('promotion-slider--active');
        }

        window.addEventListener('resize', function () {
            if (window.innerWidth < 1615) {
                if (!promotionProductSlider.classList.contains('slick-initialized')) {
                    promotionProductSlider.classList.add('promotion-slider--active');
                    promotionProductSlider && initPromotionSlider(true, promotionProductSlider);
                }
            } else {
                if (promotionProductSlider.classList.contains('slick-initialized') && !promotionProductSlider.classList.contains('promotion-slider--slider')) {
                    promotionProductSlider.classList.remove('promotion-slider--active');
                    promotionProductSlider && initPromotionSlider(false, promotionProductSlider);
                }
            }
        });
    } catch (e) {
        console.log(e + 'promotion slider');
    }

    try {
        //Slider Products
        var productsSliders = document.querySelectorAll('.product-slider');

        var initProductsSlider = function initProductsSlider(flag, section) {
            if (flag) {
                var parent = section.parentElement;
                var arrowNext = parent.querySelector('.arrow-next');
                var arrowPrev = parent.querySelector('.arrow-prev');
                $(section).slick({
                    dots: true,
                    infinite: false,
                    arrows: true,
                    nextArrow: $(arrowNext),
                    prevArrow: $(arrowPrev),
                    speed: 300,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    responsive: [{
                        breakpoint: 1615,
                        settings: {
                            slidesToShow: 3
                        }
                    }, {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2
                        }
                    }, {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 1
                        }
                    }]
                });
            } else {
                $(section).slick('unslick');
            }
        };

        if (window.innerWidth >= 1615) {
            productsSliders.forEach(function (slider) {
                if (slider.children.length > 4) {
                    slider.parentElement.classList.add('catalog-block--slider');
                    initProductsSlider(true, slider);
                }
            });
        }

        if (window.innerWidth < 1615) {
            productsSliders && productsSliders.forEach(function (slider) {
                initProductsSlider(true, slider);
            });
        }

        window.addEventListener('resize', function () {
            if (window.innerWidth < 1615) {
                productsSliders.forEach(function (slider) {
                    if (!slider.classList.contains('slick-initialized')) {
                        initProductsSlider(true, slider);
                    }
                });
            } else {
                productsSliders.forEach(function (slider) {
                    var parent = slider.parentElement;

                    if (slider.classList.contains('slick-initialized') && !parent.classList.contains('catalog-block--slider')) {
                        initProductsSlider(false, slider);
                    }
                });
            }
        });
        /*productsSliders.forEach(slider => {
            console.log(slider.children)
            if(slider.children.length > 4){
                slider.classList.add('slider--active');
                initProductsSlider(true , slider)
            }
        })*/
    } catch (e) {
        console.log(e + 'products sliders');
    }


}


