var app = new Vue({
    el: '#main',
    data: {
        heightPromoSection: 0
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
        initEvents(){

            window.addEventListener('scroll', this.fixedHeader);

            const aboutLink = document.querySelectorAll('.link-about');
            const menuLink = document.querySelectorAll('.link-menu');
            const deliveryLink = document.querySelectorAll('.link-delivery');
            const contactsLink = document.querySelectorAll('.link-contacts');
            const orderLink = document.querySelector('.link-order');

            window.addEventListener('resize', () => {
                this.getHeightPromoSection()
            })

            aboutLink.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    const section = document.querySelector('.why');
                    this.scrollInSection(section)
                })
            })

            menuLink.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    const section = document.querySelector('.menu');
                    this.scrollInSection(section)
                })
            })

            deliveryLink.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    const section = document.querySelector('.delivery');
                    this.scrollInSection(section)
                })
            })

            contactsLink.forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();
                    const section = document.querySelector('.footer');
                    this.scrollInSection(section)
                })
            })

            orderLink.addEventListener('click', (event) => {
                event.preventDefault();
                const section = document.querySelector('.order');
                this.scrollInSection(section)
            })
        },
        getCoords(elem) {
            let box = elem.getBoundingClientRect();
            return box.top + pageYOffset;
        },
        scrollInSection(section){
            const top = this.getCoords(section);
            window.scrollTo({
                top: top - 120,
                behavior: 'smooth'
            });
        }
    },
    mounted(){
        this.initEvents();
        this.getHeightPromoSection();
    }

})