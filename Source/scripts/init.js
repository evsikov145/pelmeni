window.onload = () => {

    var app = new Vue({
        el: '#main',
        data: {
            heightPromoSection: 0,
            categoriesMenu: [],
            sectionMenu: [],
            productsBlocks: [],
            currentProductsBlock: [],
            sectionMenuTitle: 'Наше меню'
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
                    top: top - 120, // height fixed header
                    behavior: 'smooth'
                });
            },
            toggleAdaptiveMenu(){
                document.querySelector('body').classList.toggle('menu-active');
            },
            openProducts(event){
                const title = event.target.textContent;
                const currentCategory = event.target.parentElement;
                const currentCategoryId = currentCategory.getAttribute('data-id');
                this.currentProductsBlock = this.productsBlocks.filter(item => {
                    if(item.getAttribute('data-id') === currentCategoryId){
                        return item;
                    }
                })
                if(this.currentProductsBlock.length){
                    this.sectionMenuTitle = title;
                    this.categoriesMenu.style.display = 'none';
                    this.currentProductsBlock[0].style.display = 'flex';
                    this.sectionMenu.classList.add('menu--active');
                    this.scrollInSection(this.sectionMenu);
                }
            },
            closeProductsBlock(){
                this.sectionMenuTitle = 'Наше меню';
                this.categoriesMenu.style.display = 'flex';
                this.currentProductsBlock[0].style.display = 'none';
                this.sectionMenu.classList.remove('menu--active');
            }
        },
        mounted(){

            this.initEventsScroll();

            this.getHeightPromoSection();

            window.addEventListener('resize', () => {
                this.getHeightPromoSection()
            })

            window.addEventListener('scroll', this.fixedHeader);

            this.categoriesMenu = document.querySelector('.menu-block');
            this.sectionMenu = document.querySelector('.menu');
            this.productsBlocks = document.querySelectorAll('.product-slider');
            this.productsBlocks = [...this.productsBlocks];
        }
    })

// Slider Best Products
    const bestProductSlider = document.querySelector('.best-slider');
    const initBestSlider = (flag, section) => {
        if(flag){
            const parent = section.parentElement;
            const arrowNext = parent.querySelector('.arrow-next');
            const arrowPrev = parent.querySelector('.arrow-prev');
            $(section).slick({
                dots: true,
                infinite: true,
                arrows: true,
                nextArrow: $(arrowNext),
                prevArrow: $(arrowPrev),
                speed: 300,
                slidesToShow: 3,
                slidesToScroll: 1,
                responsive: [
                    {
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 800,
                        settings: {
                            slidesToShow: 1
                        }
                    }
                ]
            })
        }else {
            $(section).slick('unslick')
        }

    }

    if(window.innerWidth < 1615){
        bestProductSlider && initBestSlider(true ,bestProductSlider)
    }

    window.addEventListener('resize', () => {
        if(window.innerWidth < 1615){
            if(!bestProductSlider.classList.contains('slick-initialized')){
                bestProductSlider && initBestSlider(true, bestProductSlider)
            }
        }else {
            if(bestProductSlider.classList.contains('slick-initialized')){
                bestProductSlider && initBestSlider(false, bestProductSlider)
            }
        }
    })

}

