// Update width on window resize
var width = window.innerWidth;
$(window).resize(function() {
    width = window.innerWidth;
});

var documentHasScroll = function() {
    return window.innerHeight <= document.body.offsetHeight;
};

// Function to show the search form
function showSearchForm() {
    // Simple fade in with a pop effect
    $('#search').fadeIn(200);
    $('#search form').addClass('pop-in');
    
    // Clear any previous search text and focus the input
    $('#search input.search_input').val('').focus();
    
    $('body').addClass('search-open');
    
    // Prevent scrolling when search is open
    $('body').css('overflow', 'hidden');
    
    // Delay adding the click-outside listener to prevent immediate closure
    // This ensures the current click event finishes propagating before we start listening
    setTimeout(function() {
        // Add event listener to close search when clicking outside
        $(document).on('click.searchClose', function(event) {
            var $search = $('#search form');
            var $searchToggle = $('#searchToggle');
            var $desktopSearchBtn = $('#desktopSearchBtn');
            
            // If click is outside search container and not on search buttons
            if (!$search.is(event.target) && 
                $search.has(event.target).length === 0 && 
                !$searchToggle.is(event.target) && 
                $searchToggle.has(event.target).length === 0 &&
                !$desktopSearchBtn.is(event.target) && 
                $desktopSearchBtn.has(event.target).length === 0 &&
                !$(event.target).closest('.close-search').length) {
                hideSearchForm();
            }
        });
    }, 100);
    
    // Add escape key handler
    $(document).on('keydown.searchEscape', function(e) {
        if (e.key === 'Escape') {
            hideSearchForm();
        }
    });
    
    // Add enter key handler to submit the form
    $('#search input.search_input').on('keydown.searchSubmit', function(e) {
        if (e.key === 'Enter') {
            $('#search form').submit();
        }
    });
}

// Function to hide the search form
function hideSearchForm() {
    // Simple fade out
    $('#search form').removeClass('pop-in');
    $('#search').fadeOut(200);
    
    $('body').removeClass('search-open');
    
    // Restore scrolling
    $('body').css('overflow', '');
    
    // Remove the document event listeners
    $(document).off('click.searchClose');
    $(document).off('keydown.searchEscape');
    $('#search input.search_input').off('keydown.searchSubmit');
}

$(document).ready(function() {
    // $("nav").removeClass("no-transition");
	/* MENU */
	$('.navbar-nav').attr('id', 'menu');

    // // Initialize partner layout wrapping for larger screens
    // if(width >= 1024 && $('#partners .key_0').length){
    //     // First column: items 0, 2, 4, 6, etc. (even numbers)
    //     $('#partners .key_0, #partners .key_2, #partners .key_4, #partners .key_6, #partners .key_8, #partners .key_10, #partners .key_12, #partners .key_14, #partners .key_16, #partners .key_18').wrapAll('<div class="col-md-6 col-xs-12" />');
        
    //     // Second column: items 1, 3, 5, 7, etc. (odd numbers)
    //     $('#partners .key_1, #partners .key_3, #partners .key_5, #partners .key_7, #partners .key_9, #partners .key_11, #partners .key_13, #partners .key_15, #partners .key_17, #partners .key_19').wrapAll('<div class="col-md-6 col-xs-12" />');
    // }
    
    // Initialize hamburger menu dropdown functionality
    initHamburgerMenuDropdowns();
    
    // Search button functionality
    $('#searchToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSearchForm();
    });

    // Prevent clicks on bottom elements from closing the menu
    $('.navbar-bottom-elements').on('click', function(e) {
        e.stopPropagation();
    });

    // Handle dropdown menu items
    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle');
            $(this).on('click', function(e) {
                e.preventDefault();
                $(this).siblings('.dropdown-menu').toggleClass('show');
            });
        }
    });

    $("nav").removeClass("no-transition");

    // Responsive Menu System
    // Handles both desktop (hover-based) and mobile (hamburger) menus
    var isDesktop = window.matchMedia('(min-width: 992px)').matches;

    // Mobile Hamburger Menu Toggle
    $('#desktopMenuToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Open the menu
        $('#headerNavbarNav').addClass('show').css({
            'right': '0',
            'opacity': '1',
            'visibility': 'visible'
        });

        // Hide the toggle button
        $(this).hide();

        $('body').addClass('menu-open');
    });

    // Close mobile menu button
    $('#closeMenuBtn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Close the menu
        $('#headerNavbarNav').removeClass('show').css({
            'right': '-300px',
            'opacity': '0',
            'visibility': 'hidden'
        });

        // Show the toggle button again
        $('#desktopMenuToggle').show();

        $('body').removeClass('menu-open');
    });

    // Close mobile menu when clicking outside
    $(document).click(function(event) {
        var $navbarNav = $('#headerNavbarNav');
        var $desktopToggle = $('#desktopMenuToggle');
        var $closeBtn = $('#closeMenuBtn');

        // Only for mobile menu (hamburger)
        if ($navbarNav.hasClass('show') &&
            !$navbarNav.is(event.target) &&
            $navbarNav.has(event.target).length === 0 &&
            !$desktopToggle.is(event.target) &&
            $desktopToggle.has(event.target).length === 0 &&
            !$closeBtn.is(event.target) &&
            $closeBtn.has(event.target).length === 0) {

            $navbarNav.removeClass('show').css({
                'right': '-300px',
                'opacity': '0',
                'visibility': 'hidden'
            });

            // Show the toggle button again
            $('#desktopMenuToggle').show();

            $('body').removeClass('menu-open');
        }
    });

    // Prevent clicks on the mobile menu from closing it
    $('#headerNavbarNav').on('click', function(e) {
        e.stopPropagation();
    });

    // Mobile menu dropdown handling (click-based, accordion style)
    $('.navbar-nav .nav-item.dropdown > a').on('click', function(e) {
        // Only for mobile menu
        if (window.innerWidth < 992) {
            e.preventDefault();
            var $dropdownMenu = $(this).siblings('.dropdown-menu');
            var $parentItem = $(this).parent();

            if ($dropdownMenu.hasClass('show')) {
                $dropdownMenu.removeClass('show');
                $parentItem.removeClass('active');
            } else {
                // Close all other open dropdowns first (accordion behavior)
                $('.navbar-nav .dropdown-menu.show').removeClass('show');
                $('.navbar-nav .nav-item.dropdown.active').removeClass('active');
                $dropdownMenu.addClass('show');
                $parentItem.addClass('active');
            }
        }
    });

    // Desktop Search Button
    $('#desktopSearchBtn').on('click', function(e) {
        e.preventDefault();
        showSearchForm();
    });

    // Handle window resize - close mobile menu if switching to desktop
    $(window).on('resize', function() {
        var nowDesktop = window.matchMedia('(min-width: 992px)').matches;

        // If switched from mobile to desktop, close mobile menu
        if (!isDesktop && nowDesktop) {
            $('#headerNavbarNav').removeClass('show').css({
                'right': '-300px',
                'opacity': '0',
                'visibility': 'hidden'
            });
            $('#desktopMenuToggle').show();
            $('body').removeClass('menu-open');
        }

        isDesktop = nowDesktop;
    });

    $('.work_packages .accordion-content, .messages .accordion-toggle').each(function( index, value ) {
        $(value).find('a').attr( "onclick", "window.open(this.href, '_blank');" )
    });

    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    $("nav").removeClass("no-transition");

    if (window.location.hash) {
        var link = window.location.hash;
        var anchorId = link.substr(link.indexOf("#") + 1);
        if($("#"+anchorId).offset()){
            $('html, body').animate({
                scrollTop: $("#"+anchorId).offset().top - 150
            }, 500);
        }else{
            $('.accordion-border').each(function(){
                var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                var toggler = $(this).find(".accordion-toggle");
                if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                    $('html, body').animate({
                        scrollTop: toggler.parent().offset().top - 150
                    }, 500);
                    toggler.trigger( "click" );
                }
            });
        }
    }

    $('.dropdown a').click(function(event) {

        if (location.href.indexOf("#") != -1) {
            var link = $(this).attr('href');
            var anchorId = link.substr(link.indexOf("#") + 1);
            if($("#"+anchorId).length>0){
                $('html, body').animate({
                    scrollTop: $("#"+anchorId).offset().top - 150
                }, 500);
            }else{
                // event.preventDefault();
                $("g[title='"+anchorId.toUpperCase()+"']").addClass('active_path');

                $('.accordion-border').each(function(){
                    var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                    var toggler = $(this).find(".accordion-toggle");
                    if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                        $('html, body').animate({
                            scrollTop: toggler.parent().offset().top - 150
                        }, 500);
                        toggler.trigger( "click" );
                        event.preventDefault();
                    }
                });
            }
        }
    });

    // onHashChange();
	// $(window).on("hashchange", function() {
	// 	onHashChange();
	// });

	$('.nav.nav-pills').removeAttr('id');


    // if(width > 1024){
    //     $('.partners_list .key_0, .partners_list .key_2, .partners_list .key_4, .partners_list .key_6, .partners_list .key_8, .partners_list .key_10, .partners_list .key_12, .partners_list .key_14, .partners_list .key_16, .partners_list .key_18').wrapAll('<div class="col-md-6 col-xs-12"></div>');
    //     $('.partners_list .key_1, .partners_list .key_3, .partners_list .key_5, .partners_list .key_7, .partners_list .key_9, .partners_list .key_11, .partners_list .key_13, .partners_list .key_15, .partners_list .key_17, .partners_list .key_19').wrapAll('<div class="col-md-6 col-xs-12"></div>');
    // }


    // if($('#slick').length){
    //     $('#slick').slick({
    //         autoplay: true,
    //         autoplaySpeed: 4000,
    //         draggable: true,
    //         pauseOnHover: true,
    //         infinite: true,
    //         dots: false,
    //         arrows: true,
    //         speed: 1000,

    //         mobileFirst: true,
    
    //         // Default settings for mobile
    //         slidesToShow: 1,
    //         slidesToScroll: 1,
    //         variableWidth: true,
            
    //         responsive: [
    //             {
    //                 breakpoint: 992, // Large devices
    //                 settings: {
    //                     slidesToShow: 1,
    //                     slidesToScroll: 1,
    //                     variableWidth: true
    //                 }
    //             },
    //             {
    //                 breakpoint: 1200, // Extra large devices
    //                 settings: {
    //                     slidesToShow: 4,
    //                     slidesToScroll: 1,
    //                     variableWidth: true
    //                 }
    //             }
    //         ]
    //     });
        
    //     // Add initial state check for carousel buttons
    //     setTimeout(function() {
    //         // Custom arrow handlers for consortium carousel
    //         $(".trigger_prev_consortium").off('click').on('click', function(e) {
    //             e.preventDefault();
    //             $('#slick').slick('slickPrev');
    //         });
            
    //         $(".trigger_next_consortium").off('click').on('click', function(e) {
    //             e.preventDefault();
    //             $('#slick').slick('slickNext');
    //         });
            
    //         // Handle button state based on slide position
    //         var slick = $('#slick').slick('getSlick');
            
    //         $('#slick').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    //             // Toggle button visibility based on slide position
    //             if (nextSlide === 0) {
    //                 $('.trigger_prev_consortium').css('opacity', '0.5');
    //             } else {
    //                 $('.trigger_prev_consortium').css('opacity', '1');
    //             }
                
    //             if (nextSlide >= slick.slideCount - slick.options.slidesToShow) {
    //                 $('.trigger_next_consortium').css('opacity', '0.5');
    //             } else {
    //                 $('.trigger_next_consortium').css('opacity', '1');
    //             }
    //         });
            
    //         // Initialize button states
    //         if (slick.currentSlide === 0) {
    //             $('.trigger_prev_consortium').css('opacity', '0.5');
    //         }
            
    //         if (slick.currentSlide >= slick.slideCount - slick.options.slidesToShow) {
    //             $('.trigger_next_consortium').css('opacity', '0.5');
    //         }
    //     }, 100);
    // }

    // if($('.news-carousel').length) {
    //     /* News highlights carousel **/
    //     var $newsCarousel = $('.news-carousel');
        
    //     $newsCarousel.slick({
    //         autoplay: false,
    //         // autoplaySpeed: 2000,
    //         draggable: true,
    //         // pauseOnHover: true,
    //         centerMode: false,
    //         variableWidth: true,
    //         infinite: false,  // Change to false to prevent infinite scrolling
    //         slidesToShow: 3,  // Show 3 full items
    //         speed: 1000,
    //         slidesToScroll: 1,
    //         arrows: true, // Enable arrows but they will be hidden with CSS
    //         dots: false,
    //         responsive: [
    //             {
    //                 breakpoint: 768,
    //                 settings: {
    //                     arrows: false,
    //                     dots: true,
    //                     // centerMode: true,
    //                     // centerPadding: '2%',
    //                     slidesToShow: 1
    //                 }
    //             }
    //         ]
    //     });

    //     // Ensure carousel is fully initialized
    //     setTimeout(function() {
    //         // Custom arrow click handlers
    //         $(".trigger_prev, .trigger_prev_arrow").click(function(e) {
    //             e.preventDefault();
    //             $newsCarousel.slick('slickPrev');
    //             return false;
    //         });
            
    //         $(".trigger_next, .trigger_next_arrow").click(function(e) {
    //             e.preventDefault();
    //             $newsCarousel.slick('slickNext');
    //             return false;
    //         });
            
    //         // Initialize button states
    //         $('.trigger_prev, .trigger_prev_arrow').css('opacity', '0.5');
    //     }, 100);
        
    //     // Limit the width of the slick track to prevent excessive scrolling
    //     $newsCarousel.on('init', function(event, slick){
    //         // Add class to first visible slide
    //         $(slick.$slides[0]).addClass('first-visible-slide');
    //     });
        
    //     $newsCarousel.on('afterChange', function(event, slick, currentSlide){
    //         $('.slick-slide').removeClass('first-visible-slide');
    //         $(slick.$slides[currentSlide]).addClass('first-visible-slide');
    //     });
        
    //     // Ensure navigation works correctly with our constrained carousel
    //     $newsCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    //         // If we're at the last possible slide, prevent further navigation
    //         if (nextSlide >= slick.slideCount - 3) {
    //             // Disable next button visually
    //             $('.trigger_next, .trigger_next_arrow').css('opacity', '0.5');
    //         } else {
    //             // Enable next button
    //             $('.trigger_next, .trigger_next_arrow').css('opacity', '1');
    //         }
            
    //         // If we're at the first slide, disable previous button
    //         if (nextSlide === 0) {
    //             $('.trigger_prev, .trigger_prev_arrow').css('opacity', '0.5');
    //         } else {
    //             $('.trigger_prev, .trigger_prev_arrow').css('opacity', '1');
    //         }
    //     });
    // }
    
});

// function type(i, t, ie, oe) {
//     input = document.getElementById(ie).innerHTML;
//     document.getElementById(oe).innerHTML += input.charAt(i);
//     setTimeout(function(){
//         ((i < input.length - 1) ? type(i+1, t, ie, oe) : false);
//     }, t);
// }

function redirectAndRefresh(url){
	$(".tabs a").each(function() {
		this.href = window.location.hash;
	});
	window.open(url, '_blank');
	location.reload();
}

function isBreakpointLarge() {
    return window.innerWidth <= 991;
}

function scrollDown(){
	var element = $('#layout-content');
	$("html, body").animate({ scrollTop: element.offset().top - 190 }, 500);
}


function hideMe(elem){
    $(elem).parent().hide();
}


function getScreenSize() {
    var myHeight = 0;
    var myWidth = 0;
    if (window.innerWidth && window.innerHeight) {
        // Netscape & Mozilla
        myHeight = window.innerHeight;
        myWidth = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        // IE > 6
        myHeight = document.documentElement.clientHeight;
        myWidth = document.documentElement.clientWidth;
    } else if (document.body.offsetWidth && document.body.offsetHeight) {
        // IE = 6
        myHeight = document.body.offsetHeight;
        myWidth = document.body.offsetWidth;
    } else if (document.body.clientWidth && document.body.clientHeight) {
        // IE < 6
        myHeight = document.body.clientHeight;
        myWidth = document.body.clientWidth;
    }

    return {'width': myWidth, 'height': myHeight};
}

/**
 * Initialize accordion functionality
 * This ensures accordions work properly even when they're in hidden tabs
 */
function initAccordion() {
    $('.work_packages .accordion-toggle, .mission .accordion-toggle').off('click');
    
    $('.work_packages .accordion-toggle, .mission .accordion-toggle').on('click', function () {
        if ($(this).next(".accordion-content").is(':visible')) {
            $(this).next(".accordion-content").hide();
            $(this).children().find(".plusminus").text('+');
            $(this).children(".plusminus").html('<span class="plus"></span>');
            $(this).children(".green_bullet").removeClass('toggled');
        } else {
            $(this).next(".accordion-content").show();
            $(this).children().find(".plusminus").text('-');
            $(this).children(".plusminus").html('<span class="minus"></span>');
            $(this).children(".green_bullet").addClass('toggled');
        }
    });
}

// /**
//  * Initialize work packages toggle functionality
//  * This ensures the read more/less buttons work properly in the work packages section
//  */
// function initWorkPackagesToggle() {
//     $('.read-more-wp').off('click');
    
//     $('.read-more-wp').on('click', function() {
//         toggleWorkPackage(this);
//     });
// }

// /**
//  * Toggle work package content visibility
//  * @param {HTMLElement} element - The clicked "Read more" button
//  */
// function toggleWorkPackage(element) {
//     var $button = $(element);
//     var $workPackageBox = $button.closest('.work-package-box');
//     var $content = $workPackageBox.find('.wp-content');
    
//     if ($content.is(':visible')) {
//         $button.removeClass('arrow-up');
//         $content.hide();
//         $button.text('Read more');
//     } else {
//         $button.addClass('arrow-up');
//         $content.show();
//         $button.text('Read less');
//     }
// }

/**
 * Initialize news category tabs functionality
 * Handles smooth navigation between news categories
 */
function initNewsCategoryTabs() {
    // Only initialize if we're on the news page and tabs exist
    if (!$('.news-category-tabs').length) {
        return;
    }
    
    // Handle tab click events
    $('.news-category-tabs .tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        $('.news-category-tabs .tab-link').removeClass('active');
        
        // Add active class to clicked tab
        $(this).addClass('active');
        
        // Get the category ID from data attribute
        var categoryId = $(this).data('category');
        
        // Build the URL
        var url = '/news';
        if (categoryId !== 'all') {
            url += '?categoryId=' + categoryId;
        }
        
        // Navigate to the URL (this will reload the page with filtered content)
        window.location.href = url;
    });
    
    // Update active state based on current URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var currentCategoryId = urlParams.get('categoryId') || 'all';
    
    // Set the correct active tab based on URL
    $('.news-category-tabs .tab-link').removeClass('active');
    $('.news-category-tabs .tab-link[data-category="' + currentCategoryId + '"]').addClass('active');
}

/**
 * Initialize hamburger menu dropdown functionality
 * Handles dropdown menu toggles, auto-expand, and menu state management
 */
function initHamburgerMenuDropdowns() {
    // Auto-expand dropdowns that contain the current active page
    function autoExpandActiveDropdowns() {
        var activeSubItems = $('#headerNavbarNav .dropdown-menu .nav-item.active');
        
        activeSubItems.each(function() {
            // Find the parent dropdown
            var parentDropdown = $(this).closest('.nav-item.dropdown');
            if (parentDropdown.length) {
                var dropdownMenu = parentDropdown.find('.dropdown-menu');
                
                // Expand the parent dropdown
                parentDropdown.addClass('active');
                if (dropdownMenu.length) {
                    dropdownMenu.addClass('show');
                }
            }
        });
    }
    
    // Run auto-expand on page load
    autoExpandActiveDropdowns();
    
    // Handle dropdown menu toggles
    var dropdownItems = $('#headerNavbarNav .nav-item.dropdown > a');
    
    dropdownItems.each(function() {
        $(this).off('click.dropdown').on('click.dropdown', function(e) {
            e.preventDefault();
            
            var parentItem = $(this).parent();
            var dropdownMenu = parentItem.find('.dropdown-menu');
            
            if (dropdownMenu.length) {
                // Toggle active state on parent item
                parentItem.toggleClass('active');
                
                // Toggle show state on dropdown menu
                dropdownMenu.toggleClass('show');
                
                // Optional: Close other open dropdowns (accordion behavior)
                var otherDropdowns = $('#headerNavbarNav .nav-item.dropdown');
                otherDropdowns.each(function() {
                    if (this !== parentItem[0]) {
                        $(this).removeClass('active');
                        var otherMenu = $(this).find('.dropdown-menu');
                        if (otherMenu.length) {
                            otherMenu.removeClass('show');
                        }
                    }
                });
            }
        });
    });
    
    // Close all dropdowns when menu is closed (but preserve auto-expanded state)
    function closeAllDropdowns() {
        var activeDropdowns = $('#headerNavbarNav .nav-item.dropdown.active');
        activeDropdowns.each(function() {
            $(this).removeClass('active');
            var menu = $(this).find('.dropdown-menu');
            if (menu.length) {
                menu.removeClass('show');
            }
        });
    }
    
    function handleMenuToggle() {
        // When menu is opened, auto-expand dropdowns with active items
        setTimeout(function() {
            autoExpandActiveDropdowns();
        }, 100); // Small delay to ensure menu animation completes
    }
    
    var closeMenuBtn = $('#closeMenuBtn');
    if (closeMenuBtn.length) {
        closeMenuBtn.off('click.dropdown').on('click.dropdown', closeAllDropdowns);
    }
    
    // Re-expand dropdowns when menu is opened
    var menuToggleBtn = $('#desktopMenuToggle');
    if (menuToggleBtn.length) {
        menuToggleBtn.off('click.dropdown').on('click.dropdown', handleMenuToggle);
    }
    
    // Close dropdowns when clicking outside
    $(document).off('click.dropdownOutside').on('click.dropdownOutside', function(e) {
        var navbar = $('#headerNavbarNav');
        var menuToggle = $('#desktopMenuToggle');
        
        if (navbar.length && !navbar.is(e.target) && navbar.has(e.target).length === 0 && 
            !menuToggle.is(e.target) && menuToggle.has(e.target).length === 0) {
            closeAllDropdowns();
        }
    });
}