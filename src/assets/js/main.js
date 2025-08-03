window.initializeAllUI = function() {

    // preloader
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
    document.body.style.position = 'static';

    // HEADER NAV IN MOBILE
    if (document.querySelector(".ul-header-nav")) {
        const ulSidebar = document.querySelector(".ul-sidebar");
        const ulSidebarOpener = document.querySelector(".ul-header-sidebar-opener");
        const ulSidebarCloser = document.querySelector(".ul-sidebar-closer");
        const ulMobileMenuContent = document.querySelector(".to-go-to-sidebar-in-mobile");
        const ulHeaderNavMobileWrapper = document.querySelector(".ul-sidebar-header-nav-wrapper");
        const ulHeaderNavOgWrapper = document.querySelector(".ul-header-nav-wrapper");

        function updateMenuPosition() {
            if (window.innerWidth < 992) {
                ulHeaderNavMobileWrapper.appendChild(ulMobileMenuContent);
            }

            if (window.innerWidth >= 992) {
                ulHeaderNavOgWrapper.appendChild(ulMobileMenuContent);
            }
        }

        updateMenuPosition();

        window.addEventListener("resize", () => {
            updateMenuPosition();
        });

        ulSidebarOpener.addEventListener("click", () => {
            ulSidebar.classList.add("active");
        });

        ulSidebarCloser.addEventListener("click", () => {
            ulSidebar.classList.remove("active");
        });


        // menu dropdown/submenu in mobile
        const ulHeaderNavMobile = document.querySelector(".ul-header-nav");
        const ulHeaderNavMobileItems = ulHeaderNavMobile.querySelectorAll(".has-sub-menu");
        ulHeaderNavMobileItems.forEach((item) => {
            if (window.innerWidth < 992) {
                item.addEventListener("click", () => {
                    item.classList.toggle("active");
                });
            }
        });
    }

    // header search in mobile start
    const ulHeaderSearchOpener = document.querySelector(".ul-header-search-opener");
    const ulHeaderSearchCloser = document.querySelector(".ul-search-closer");
    if (ulHeaderSearchOpener) {
        ulHeaderSearchOpener.addEventListener("click", () => {
            document.querySelector(".ul-search-form-wrapper").classList.add("active");
        });
    }

    if (ulHeaderSearchCloser) {
        ulHeaderSearchCloser.addEventListener("click", () => {
            document.querySelector(".ul-search-form-wrapper").classList.remove("active");
        });
    }
    // header search in mobile end

    // sticky header
    const ulHeader = document.querySelector(".to-be-sticky");
    if (ulHeader) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                ulHeader.classList.add("sticky");
            } else {
                ulHeader.classList.remove("sticky");
            }
        });
    }

    // wow js - animation on scroll
    new WOW({}).init();


    // Banner slider
    if (document.querySelector(".ul-banner-slider")) {
        const bannerSlider = new Splide('.ul-banner-slider', {
            perPage: 1,
            pagination: false,
            arrows: false,
            type: 'loop',
            // autoplay: true,
            interval: 3500
        }).mount();
    }
    // // banner image slider
    // const bannerImgSlider = new Splide('.ul-banner-img-slider', {
    //     perPage: 4,
    //     pagination: false,
    //     arrows: false,
    //     type: 'loop',
    //     autoplay: true,
    //     interval: 3500,
    //     perMove: 4,
    // }).mount();

    // bannerSlider.sync(bannerImgSlider);
    // // main.mount();
    // // thumbnails.mount();


    // Ticker slider
    if (document.querySelector(".ul-ticker-slider")) {
        new Splide('.ul-ticker-slider', {
            type: 'loop',
            // perPage: "auto",
            perPage: 10,
            pagination: false,
            arrows: false,
            type: 'loop',
        }).mount(window.splide.Extensions);
    }

    // Service Slider
    new Swiper('.ul-services-slider', {
        slidesPerView: 4.8,
        spaceBetween: 27,
        centeredSlides: true,
        loop: true,
        autoplay: true,
        navigation: {
            prevEl: ".ul-services-slider-nav .prev",
            nextEl: ".ul-services-slider-nav .next"
        },
        breakpoints: {
            0: { slidesPerView: 1.3, spaceBetween: 15, },
            480: { slidesPerView: 1.8, spaceBetween: 15, },
            576: { slidesPerView: 2, spaceBetween: 15, },
            768: { slidesPerView: 2.8, spaceBetween: 15, },
            992: { slidesPerView: 3.5, spaceBetween: 15, },
            1200: { slidesPerView: 4, spaceBetween: 20, },
            1400: {
                slidesPerView: 4.8,
                spaceBetween: 27,
            }
        }
    });

    // case study slider
    new Swiper(".ul-case-study-slider", {
        slidesPerView: 3,
        loop: true,
        autoplay: true,
        watchSlidesProgress: true,
        spaceBetween: 27,
        navigation: {
            prevEl: ".ul-case-study-slider-prev",
            nextEl: ".ul-case-study-slider-next"
        },
        breakpoints: {
            0: { slidesPerView: 1, },
            576: { slidesPerView: 1.5, centeredSlides: true },
            768: { slidesPerView: 2, centeredSlides: false },
            992: { slidesPerView: 2.7, centeredSlides: true },
            1200: { slidesPerView: 3, centeredSlides: true },
        }
    })


    // Reviews slider






    // TESTIMONIAL SLIDER
    new Swiper(".ul-inner-testimonial-slider", {
        slidesPerView: 2,
        spaceBetween: 27,
        loop: true,
        autoplay: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            }
        }
    });

    // project details img slider
    new Swiper(".ul-project-details-img-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        navigation: {
            prevEl: ".ul-project-details-slider-nav .prev",
            nextEl: ".ul-project-details-slider-nav .next",
        }
    });


    // scroll spy about section
    if (document.querySelector(".ul-about-content-nav")) {
        scrollSpy('.ul-about-content-nav', {
            sectionClass: '.ul-about-content-tab',
            menuActiveTarget: 'a',
            offset: -420,
            // smooth scroll
            smoothScroll: true,
            smoothScrollBehavior: function (element) {
                element.scrollIntoView({ behavior: 'smooth' }) // default behavior
            }
        });

    }

    // index-2 clients slider
    new Swiper(".ul-clients-2-slider", {
        slidesPerView: 5,
        spaceBetween: 20,
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            992: {
                slidesPerView: 5,
            }
        }
    });

    // how it works ss slider
    new Swiper(".ul-how-it-works-img-slider", {
        slidesPerView: 3.75,
        spaceBetween: 17,
        loop: true,
        autoplay: true,
        breakpoints: {
            0: {
                slidesPerView: 2
            },
            480: {
                slidesPerView: 3
            },
            768: {
                slidesPerView: 2.05,
            },
            992: {
                slidesPerView: 2.65,
            },
            1200: {
                slidesPerView: 3.05,
            },
            1400: {
                slidesPerView: 3.15,
            },
            1600: {
                slidesPerView: 3.75,
            }
        }
    });

    // index-2 Testimonial slider
    new Swiper(".ul-reviews-2-slider", {
        slidesPerView: 3,
        spaceBetween: 30,
        watchSlidesProgress: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 130,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    })

    // index-3 banner customer slider
    new Swiper(".ul-banner-3-cutomers-slider ", {
        slidesPerView: 5,
        loop: true,
        autoplay: true,
        breakpoints: {
            0: {
                slidesPerView: 2
            },
            576: {
                slidesPerView: 3
            },
            768: {
                slidesPerView: 4
            },
            992: {
                slidesPerView: 5
            },
            1200: {
                slidesPerView: 4
            },
            1400: {
                slidesPerView: 5
            }
        }
    });








































    // text animation
    function textAnimate(sliderElement) {
        const textsToAnimate = sliderElement.querySelectorAll(".anim-txt");
        const options = {
            root: null,
            rootMargin: '0px 0px -5% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animate = new SplitType(entry.target, { types: 'lines, words,chars' });
                    // gsap.from(animate.chars, {
                    //     opacity: 0,
                    //     x: "100%",
                    //     ease: "power3.out",
                    //     duration: 3,
                    //     // stagger: { amount: 1.2 }
                    //     stagger: 0.02,
                    // });

                    gsap.set(animate.chars, {
                        x: 60,
                        autoAlpha: 0,
                        opacity: 0,
                    });

                    gsap.to(animate.chars, {
                        x: 0,
                        autoAlpha: 1,
                        duration: 1.0,
                        ease: 'power3.out',
                        stagger: 0.04,
                        mask: animate.lines,

                        // scrollTrigger: {
                        //     trigger: elem,
                        //     start: 'top center',
                        //     end: 'bottom center',
                        //     toggleActions: 'play none none none',
                        //     // markers: true,
                        // }
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        textsToAnimate.forEach(textToAnimate => {
            observer.observe(textToAnimate);
        });
    }

    textAnimate(document);


    // HOMEPAGE IMAGE SLIDER
    new Swiper(".ul-banner-img-slider", {
        slidesPerView: 1,
        spaceBetween: 200,
        loop: true,
        effect: "fade",
        autoplay: true,
        pagination: { el: "#ul-banner-img-slider-pagination", clickable: true }
    })

    // HOMEPAGE 1 AUCTIONS SLIDER
    new Swiper(".ul-auctions-swiper", {
        slidesPerView: 2,
        spaceBetween: 24,
        loop: true,
        watchSlidesProgress: true,
        autoplay: true,
        navigation: {
            prevEl: ".ul-auction-swiper-nav .prev",
            nextEl: ".ul-auction-swiper-nav .next"
        },
        pagination: {
            el: ".ul-auctions-swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 1.5,
                centeredSlides: true,
            },
            992: {
                slidesPerView: 2,
                centeredSlides: false,
            }
        }
    });

    // partners SLider
    new Swiper(".ul-partners-slider", {
        slidesPerView: 9,
        spaceBetween: "37",
        loop: true,
        autoplay: true,
        breakpoints: {
            0: {
                slidesPerView: 4,
            },
            480: {
                slidesPerView: 5,
            },
            576: {
                slidesPerView: 6,
            },
            768: {
                slidesPerView: 7,
            },
            992: {
                slidesPerView: 9,
            }
        }
    });

    // active auctions tab nav slider
    new Swiper(".ul-active-auctions-tab-navs", {
        slidesPerView: 4,
        navigation: {
            prevEl: ".ul-active-auctions-tab-navs-arrows .prev",
            nextEl: ".ul-active-auctions-tab-navs-arrows .next",
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            }
        }
    });


    // testimonial slider
    new Swiper(".ul-testimonial-slider", {
        slidesPerView: 3.2,
        spaceBetween: 24,
        loop: true,
        autoplay: true,
        pagination: {
            el: ".ul-testimonial-slider-pagination"
        },
        breakpoints: {
            0: {
                spaceBetween: 18,
                slidesPerView: 1,
            },
            480: {
                spaceBetween: 18,
                slidesPerView: 1.6,
            },
            576: {
                spaceBetween: 18,
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2.5,
                spaceBetween: 18,
            },
            992: {
                spaceBetween: 18,
            }
        }
    });

    // footer image animation
    const cards = document.querySelectorAll(".rotated-card");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.4) {
                entry.target.classList.add("in-view");
            }
            //  else {
            //     entry.target.classList.remove("in-view");
            // }
        });
    }, {
        threshold: [0, 0.4, 1]
    });

    cards.forEach(card => {
        observer.observe(card);
    });


    // INDEX-2 JS
    // INDEX-2 AUCTIONS SLIDER
    new Swiper(".ul-2-auctions-swiper", {
        slidesPerView: 3,
        spaceBetween: 24,
        loop: true,
        watchSlidesProgress: true,
        autoplay: true,
        navigation: {
            prevEl: ".ul-2-auction-swiper-nav .prev",
            nextEl: ".ul-2-auction-swiper-nav .next"
        },
        pagination: {
            el: ".ul-2-auctions-swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            480: {
                slidesPerView: 1.3,
                centeredSlides: true,
                spaceBetween: 15,
            },
            576: {
                slidesPerView: 1.6,
                centeredSlides: true,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    })

    // auctions page sort slim select
    // if (document.querySelector("#ul-inner-auctions-sort")) {
    //     new SlimSelect({
    //         select: '#ul-inner-auctions-sort',
    //         settings: {
    //             showSearch: false,
    //             contentLocation: document.querySelector('.ul-inner-auctions-sort')
    //         }
    //     })
    // };


    // Auction Details image slider
    const auctionDetailsImgThumbSlider = new Swiper(".ul-auction-details-thumb-slider", {
        slidesPerView: 3,
        spaceBetween: 24,
        loop: true,
        watchSlidesProgress: true,
        autoplay: true,

        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            576: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            1400: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1600: {
                slidesPerView: 3,
                spaceBetween: 24,
            }
        }
    });


    new Swiper(".ul-auction-details-img-slider", {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        slideToClickedSlide: true,
        thumbs: {
            swiper: auctionDetailsImgThumbSlider,
        },
    });


     const tabGroups = document.querySelectorAll(".tab-group"); // Wrapper for each tab group

    tabGroups.forEach(group => {
        const tabButtons = group.querySelectorAll(".tab-nav");
        const tabs = group.querySelectorAll(".ul-tab");


        tabButtons.forEach(button => {
            button.addEventListener("click", () => {
                const tabId = button.getAttribute("data-tab");

                // Activate the correct tab
                tabs.forEach(tab => {
                    console.log(tabId == tab);
                    if (tab.id === tabId) {
                        tab.classList.add("active");
                    } else {
                        tab.classList.remove("active");
                    }
                });

                // Manage active class for buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove("active");
                });
                button.classList.add("active");
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  window.initializeAllUI();
});

