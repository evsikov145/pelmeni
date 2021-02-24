"use strict";

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}

window.onload = function () {
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
      check2: false,
      promoError: false,
      promoErrorTitle: '',
      datePicker: {},
      date: '',
      time: '',
      dateError: false
    },
    methods: {
      getHeightPromoSection: function getHeightPromoSection() {
        var promoSection = document.querySelector('.promo');
        this.heightPromoSection = promoSection.clientHeight;
      },
      fixedHeader: function fixedHeader() {
        var header = document.querySelector('.header');

        if (window.pageYOffset > this.heightPromoSection - 200) {
          header.classList.add('header--fixed');
        } else {
          if (header.classList.contains('header--fixed')) {
            header.classList.remove('header--fixed');
          }
        }
      },
      initEventsClick: function initEventsClick(arr, section) {
        var _this = this;

        if (arr.length > 1) {
          arr.forEach(function (item) {
            item.addEventListener('click', function (event) {
              event.preventDefault();

              if (document.querySelector('body').classList.contains('menu-active')) {
                document.querySelector('body').classList.remove('menu-active');
              }

              _this.scrollInSection(section);
            });
          });
        } else {
          arr[0].addEventListener('click', function (event) {
            event.preventDefault();

            if (document.querySelector('body').classList.contains('menu-active')) {
              document.querySelector('body').classList.remove('menu-active');
            }

            _this.scrollInSection(section);
          });
        }
      },
      initEventsScroll: function initEventsScroll() {
        var aboutLink = document.querySelectorAll('.link-about');
        var sectionWhy = document.querySelector('.why');
        this.initEventsClick(aboutLink, sectionWhy);
        var menuLink = document.querySelectorAll('.link-menu');
        var sectionMenu = document.querySelector('.menu');
        this.initEventsClick(menuLink, sectionMenu);
        var deliveryLink = document.querySelectorAll('.link-delivery');
        var sectionDelivery = document.querySelector('.delivery');
        this.initEventsClick(deliveryLink, sectionDelivery);
        var contactsLink = document.querySelectorAll('.link-contacts');
        var sectionFooter = document.querySelector('.footer');
        this.initEventsClick(contactsLink, sectionFooter);
        var orderLink = document.querySelectorAll('.link-order');
        var sectionOrder = document.querySelector('.order');
        this.initEventsClick(orderLink, sectionOrder);
      },
      getCoords: function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        return box.top + pageYOffset;
      },
      scrollInSection: function scrollInSection(section) {
        var top = this.getCoords(section);
        window.scrollTo({
          top: top - 100,
          // height fixed header
          behavior: 'smooth'
        });
      },
      toggleAdaptiveMenu: function toggleAdaptiveMenu() {
        document.querySelector('body').classList.toggle('menu-active');
      },
      openProducts: function openProducts(event) {
        var title = event.target.textContent;
        var currentCategory = event.target.parentElement;

        if (!currentCategory.hasAttribute('data-id')) {
          currentCategory = currentCategory.parentElement;
        }

        var currentCategoryId = currentCategory.getAttribute('data-id');
        this.currentProductsBlock = this.productsBlocks.filter(function (item) {
          if (item.getAttribute('data-id') === currentCategoryId) {
            return item;
          }
        });

        if (this.currentProductsBlock.length) {
          this.sectionMenuTitle = title;
          this.categoriesMenu.style.display = 'none';
          this.currentProductsBlock[0].style.height = 'auto';
          var initSlider = this.currentProductsBlock[0].querySelector('.slick-initialized');

          if (initSlider) {
            this.currentProductsBlock[0].classList.add('catalog-block--active');
          }

          if (window.innerWidth < 1615) {
            this.currentProductsBlock[0].classList.add('catalog-block--active');
          }

          this.sectionMenu.classList.add('menu--active');
          this.scrollInSection(this.sectionMenu);
        }
      },
      closeProductsBlock: function closeProductsBlock() {
        this.sectionMenuTitle = 'Наше меню';
        this.categoriesMenu.style.display = 'flex';
        this.currentProductsBlock[0].style.height = '0';

        if (this.currentProductsBlock[0].classList.contains('catalog-block--active')) {
          this.currentProductsBlock[0].classList.remove('catalog-block--active');
        }

        this.sectionMenu.classList.remove('menu--active');
      },
      addProductToCart: function addProductToCart(event) {
        this.numberInCart++;
        var item = this.getCatalogItem(event.target);
        var id = item.getAttribute('data-id');

        if (id === '25') {
          this.promoError = true;
          this.promoErrorTitle = item.querySelector('h6').textContent;
        }

        var repeat = this.currentOrder.find(function (item) {
          return item.id === id;
        });

        if (typeof repeat !== 'undefined') {
          item.classList.add('catalog-item--add');
          repeat.number++;
          repeat.price = this.checkPrice(id, repeat.number);
        } else {
          item.classList.add('catalog-item--add');
          var title = item.querySelector('h6').textContent;
          var price = item.querySelector('.catalog-item__price').textContent;
          price = Number(price.split(' ')[0]);
          var number = 1;
          var orderItem = {
            id: id,
            title: title,
            price: price,
            number: number
          };
          this.currentOrder.push(orderItem);
          var copyItem = JSON.parse(JSON.stringify(orderItem));
          this.listProduct.push(copyItem);
          this.catalogItems.forEach(function (item) {
            var idItem = item.getAttribute('data-id');

            if (idItem === id) {
              item.classList.add('catalog-item--add');
            }
          });
        }

        this.ordering();
      },
      getCatalogItem: function getCatalogItem(target) {
        if (!target.hasAttribute('data-id')) {
          target = target.parentElement;
          return this.getCatalogItem(target);
        } else {
          return target;
        }
      },
      ordering: function ordering() {
        this.amountOrder = this.currentOrder.reduce(function (sum, item) {
          return sum + item.price;
        }, 0);
      },
      increaseNumberProductInOrder: function increaseNumberProductInOrder(id) {
        var product = this.currentOrder.find(function (item) {
          return item.id === id;
        });
        product.number++;
        this.numberInCart++;
        product.price = this.checkPrice(id, product.number);
        this.ordering();
      },
      reduceNumberProductInOrder: function reduceNumberProductInOrder(id) {
        var product = this.currentOrder.find(function (item) {
          return item.id === id;
        });
        product.number--;
        this.numberInCart--;
        product.price = this.checkPrice(id, product.number);

        if (product.number === 0) {
          this.catalogItems.forEach(function (item) {
            var id = item.getAttribute('data-id');

            if (id === product.id) {
              item.classList.remove('catalog-item--add');
            }
          });
          this.currentOrder = this.currentOrder.filter(function (item) {
            return item.id !== id;
          });
        }

        this.ordering();
      },
      checkPrice: function checkPrice(id, number) {
        var product = this.listProduct.find(function (item) {
          return item.id === id;
        });
        return product.price * number;
      },
      submitForm: function submitForm(event) {
        var form = this.searchForm(event.target);
        form.className = 'form';
        this.nameError = false;
        this.phoneError = false;
        this.addressError = false;
        this.orderError = false;
        this.dateError = false;
        this.errors = false;

        if (!this.currentOrder.length) {
          this.orderErrorText = "\u0412 \u0437\u0430\u043A\u0430\u0437\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0442\u043E\u0432\u0430\u0440.";
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

        if (this.amountOrder < 1500 && !this.orderError) {
          this.errors = true;
          var sum = 1500 - this.amountOrder;
          this.orderErrorText = "\u0417\u0430\u043A\u0430\u0437 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 1500 \u0440\u0443\u0431\u043B\u0435\u0439. \u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 ".concat(sum, " \u0440\u0443\u0431\u043B\u0435\u0439.");
          this.orderError = true;
        }

        var promoItem = this.currentOrder.find(function (item) {
          return item.id === '25';
        });

        if (promoItem) {
          var _sum = this.amountOrder - promoItem.price;

          if (_sum >= 1500) {
            this.promoError = false;
          } else {
            _sum = 1500 - this.amountOrder + promoItem.price;
            this.errors = true;
            this.orderErrorText = "\u0417\u0430\u043A\u0430\u0437 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 1500 \u0440\u0443\u0431\u043B\u0435\u0439. \u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 ".concat(_sum, " \u0440\u0443\u0431\u043B\u0435\u0439.");
            this.orderError = true;
          }
        } else {
          this.promoError = false;
        }

        this.date = $('#datepicker').val();

        if (!this.time) {
          this.errors = true;
          this.dateError = true;
        }

        if (!this.errors) {
          this.currentOrder.forEach(function (item) {
            delete item['id'];
          });
          var formData = new FormData(form);
          formData.append('message', JSON.stringify(this.currentOrder));
          formData.append('sum', String(this.amountOrder));
          formData.append('date', String(this.date));
          formData.append('time', String(this.time));

          if (this.check1) {
            formData.append('payment', 'Наличными');
          } else {
            formData.append('payment', 'Переводом на банковскую карту');
          }

          fetch('/send.php', {
            method: 'POST',
            body: formData
          }).then(function (res) {
            if (res.ok) {
              location.assign("/thanks.html");
            } else {
              console.log('Заказ не отправился!');
            }
          });
        }
      },
      searchForm: function searchForm(target) {
        if (target.hasAttribute('action')) {
          return target;
        } else {
          target = target.parentElement;
          return this.searchForm(target);
        }
      },
      checkCheckbox: function checkCheckbox() {
        this.check1 = !this.check1;
        this.check2 = !this.check2;
      },
      initDatePicker: function initDatePicker() {
        var _this3 = this;

        var date = new Date();
        var dateDelivery;
        var disabledDays = [0];

        if (date.getHours() >= 21) {
          dateDelivery = date;
          var currentDate = dateDelivery.getDate();
          var currentDay = dateDelivery.getDay();

          if (currentDay === 5) {
            dateDelivery.setDate(currentDate + 3);
          } else {
            dateDelivery.setDate(currentDate + 2);
          }
        } else {
          dateDelivery = date;

          var _currentDate = dateDelivery.getDate();

          var _currentDay = dateDelivery.getDay();

          if (_currentDay === 6) {
            dateDelivery.setDate(_currentDate + 2);
          } else {
            dateDelivery.setDate(++_currentDate);
          }
        }

        this.datePicker = $('#datepicker').datepicker({
          minDate: dateDelivery,
          weekends: [0],
          autoClose: true,
          onRenderCell: function onRenderCell(date, cellType) {
            if (cellType == 'day') {
              var day = date.getDay(),
                  isDisabled = disabledDays.indexOf(day) != -1;
              return {
                disabled: isDisabled
              };
            }
          }
        }).data('datepicker');
        var glass = document.querySelector('.glass');
        glass.addEventListener('click', function () {
          _this3.datePicker.show();
        });
        this.datePicker.selectDate(dateDelivery);
      },
      updateTimeDelivery: function updateTimeDelivery(e) {
        this.time = e.target.textContent;
        $('.form-time__item').removeClass('form-time__item--active');
        e.target.classList.add('form-time__item--active');
      }
    },
    mounted: function mounted() {
      var _this2 = this;

      this.initEventsScroll();
      this.initDatePicker();
      this.getHeightPromoSection();
      window.addEventListener('resize', function () {
        _this2.getHeightPromoSection();
      });
      window.addEventListener('scroll', this.fixedHeader);
      this.categoriesMenu = document.querySelector('.menu-block');
      this.sectionMenu = document.querySelector('.menu');
      this.productsBlocks = this.sectionMenu.querySelectorAll('.catalog-block');
      this.productsBlocks = _toConsumableArray(this.productsBlocks);
      this.catalogItems = document.querySelectorAll('.catalog-item');
    }
  });

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
};