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
    
    // Add event listener to close search when clicking outside
    $(document).on('click.searchClose', function(event) {
        var $search = $('#search form');
        var $searchToggle = $('#searchToggle');
        
        // If click is outside search container and not on search button
        if (!$search.is(event.target) && 
            $search.has(event.target).length === 0 && 
            !$searchToggle.is(event.target) && 
            $searchToggle.has(event.target).length === 0 &&
            !$(event.target).closest('.close-search').length) {
            hideSearchForm();
        }
    });
    
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

// Function to rotate hero images with transition
function rotateHeroImages() {
    const images = $('.image-placeholder img');
    if (images.length < 2) return;
    
    let currentIndex = 0;
    
    // Initially hide all images except the first one
    images.css({
        'opacity': 0,
        'position': 'absolute',
        'top': '50%',
        'left': '50%',
        'transform': 'translate(-50%, -50%)'
    });
    
    $(images[0]).css('opacity', 1);

    setInterval(function() {
        const nextIndex = (currentIndex + 1) % images.length;
        
        // Fade out current image
        $(images[currentIndex]).animate({
            opacity: 0
        }, 500);
        
        // Fade in next image
        $(images[nextIndex]).animate({
            opacity: 1
        }, 500);
        
        currentIndex = nextIndex;
    }, 2000);
}

$(document).ready(function() {
    // $("nav").removeClass("no-transition");
	/* MENU */
	$('.navbar-nav').attr('id', 'menu'); // please don't remove this line
	$( '<div class="calendar-top"></div>' ).insertBefore( "#calendar" );
	$( '<div class="card-profile-top"></div>' ).insertBefore( ".card.profile.card-profile" );
	var divs = $(".card-profiles > div");
	for(var i = 0; i < divs.length; i+=2) {
		divs.slice(i, i+2).wrapAll( '<div class="col-xs" />');
	}

    // Initialize hero image rotation
    rotateHeroImages();

    // Make intro-items clickable
    $('.intro-item').on('click', function() {
        var href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
    });

    // Initialize tab functionality
    initTabs();
    
    // Initialize accordion functionality
    initAccordion();
    
    // Popup replaces inline expansion
    initPartnerContentTruncation();
    // Initialize partners popup open/close
    initPartnersPopup();
    
    // Initialize advisory board popup functionality
    initAdvisoryBoardPopups();

    // Initialize video popup functionality
    initVideoPopup();

    // Initialize partner layout wrapping for larger screens
    if(width >= 1024 && $('#partners .key_0').length){
        // First column: items 0, 2, 4, 6, etc. (even numbers)
        $('#partners .key_0, #partners .key_2, #partners .key_4, #partners .key_6, #partners .key_8, #partners .key_10, #partners .key_12, #partners .key_14, #partners .key_16, #partners .key_18').wrapAll('<div class="col-md-6 col-xs-12" />');
        
        // Second column: items 1, 3, 5, 7, etc. (odd numbers)
        $('#partners .key_1, #partners .key_3, #partners .key_5, #partners .key_7, #partners .key_9, #partners .key_11, #partners .key_13, #partners .key_15, #partners .key_17, #partners .key_19').wrapAll('<div class="col-md-6 col-xs-12" />');
    }
    
    // Initialize news category tabs
    initNewsCategoryTabs();
    
    // Language toggle functionality
    $('.language-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // Initialize hamburger menu dropdown functionality
    initHamburgerMenuDropdowns();
    
    // Initialize footer dropdown functionality
    initFooterDropdowns();
    
    // Initialize project materials name display
    initProjectMaterialsNameDisplay();
    
    // Initialize project materials dropdown functionality
    initProjectMaterialsDropdowns();
    
    // Rename library category tabs with proper capitalization
    renameLibraryCategoryTabs();
    
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

    // Menu toggle functionality
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
    
    // Close menu button functionality
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

    // Close menu when clicking outside
    $(document).click(function(event) {
        var $navbarNav = $('#headerNavbarNav');
        var $desktopToggle = $('#desktopMenuToggle');
        var $closeBtn = $('#closeMenuBtn');
        
        // If navbar is visible and click is outside navbar and toggle buttons
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

    // Prevent clicks on the menu from closing it
    $('#headerNavbarNav').on('click', function(e) {
        e.stopPropagation();
    });

    // Close dropdown menus when parent menu item is clicked again
    $('.nav-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        var $dropdownMenu = $(this).siblings('.dropdown-menu');
        
        if ($dropdownMenu.hasClass('show')) {
            $dropdownMenu.removeClass('show');
        } else {
            // Close all other open dropdowns first
            $('.dropdown-menu.show').removeClass('show');
            $dropdownMenu.addClass('show');
        }
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

    onHashChange();
	$(window).on("hashchange", function() {
		onHashChange();
	});

	$('.nav.nav-pills').removeAttr('id');

	var count = $("h1").text().length;
    
    $('.about .content').attr({
        'data-aos': 'fade-up',
        'data-aos-duration': '800',
        'data-aos-delay': '150',
        'data-aos-easing': 'ease-out',
        'data-aos-anchor-placement': 'top-bottom',
        'data-aos-once': 'false',
        'data-aos-mirror': 'true'
    });
    
	$('.about .about-circle-container').attr({
		'data-aos': 'fade-up',
		'data-aos-duration': '1200',
		'data-aos-easing': 'ease-out-back',
		'data-aos-anchor-placement': 'center-bottom',
		'data-aos-once': 'true',
		'data-aos-offset': '0'
	});


	$('.see_all_partners_link').hide();

    $(".timeline_container.left .blue_line").width(function() {
        return (innerWidth - $('.container').width())/2;
    });


    $('.dorsal').click(function () {
        var link = $(this);
        var parag = link.parent().parent().find('p').first();
        var partner_desc = link.parent().parent().find('.partner_description').first();
        parag.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
                // parag.slideUp(300);
            }

        });
        partner_desc.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
                // parag.slideUp(300);
            }

        });

    });

    $('.library .form-wrapper, .library-items').wrapAll('<div class="container-fluid bg-secondary"><div class="container"></div></div>');
    $('.library .tabs').wrapAll('<div class="container"></div>');
    $('.library_content .row.center-xs.mb-1').wrapAll('<div class="container_relative"></div>');
    
    // Restructure library cards to match Figma design
    restructureLibraryCards();

    if(width > 1024){
        $('.partners_list .key_0, .partners_list .key_2, .partners_list .key_4, .partners_list .key_6, .partners_list .key_8, .partners_list .key_10, .partners_list .key_12, .partners_list .key_14, .partners_list .key_16, .partners_list .key_18').wrapAll('<div class="col-md-6 col-xs-12"></div>');
        $('.partners_list .key_1, .partners_list .key_3, .partners_list .key_5, .partners_list .key_7, .partners_list .key_9, .partners_list .key_11, .partners_list .key_13, .partners_list .key_15, .partners_list .key_17, .partners_list .key_19').wrapAll('<div class="col-md-6 col-xs-12"></div>');
    }


    if($('#slick').length){
        $('#slick').slick({
            autoplay: true,
            autoplaySpeed: 4000,
            draggable: true,
            pauseOnHover: true,
            infinite: true,
            dots: false,
            arrows: true,
            speed: 1000,

            mobileFirst: true,
    
            // Default settings for mobile
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            
            responsive: [
                {
                    breakpoint: 992, // Large devices
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                },
                {
                    breakpoint: 1200, // Extra large devices
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        variableWidth: true
                    }
                }
            ]
        });
        
        // Add initial state check for carousel buttons
        setTimeout(function() {
            // Custom arrow handlers for consortium carousel
            $(".trigger_prev_consortium").off('click').on('click', function(e) {
                e.preventDefault();
                $('#slick').slick('slickPrev');
            });
            
            $(".trigger_next_consortium").off('click').on('click', function(e) {
                e.preventDefault();
                $('#slick').slick('slickNext');
            });
            
            // Handle button state based on slide position
            var slick = $('#slick').slick('getSlick');
            
            $('#slick').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
                // Toggle button visibility based on slide position
                if (nextSlide === 0) {
                    $('.trigger_prev_consortium').css('opacity', '0.5');
                } else {
                    $('.trigger_prev_consortium').css('opacity', '1');
                }
                
                if (nextSlide >= slick.slideCount - slick.options.slidesToShow) {
                    $('.trigger_next_consortium').css('opacity', '0.5');
                } else {
                    $('.trigger_next_consortium').css('opacity', '1');
                }
            });
            
            // Initialize button states
            if (slick.currentSlide === 0) {
                $('.trigger_prev_consortium').css('opacity', '0.5');
            }
            
            if (slick.currentSlide >= slick.slideCount - slick.options.slidesToShow) {
                $('.trigger_next_consortium').css('opacity', '0.5');
            }
        }, 100);
    }

    if($('.news-carousel').length) {
        /* News highlights carousel **/
        var $newsCarousel = $('.news-carousel');
        
        $newsCarousel.slick({
            autoplay: false,
            // autoplaySpeed: 2000,
            draggable: true,
            // pauseOnHover: true,
            centerMode: false,
            variableWidth: true,
            infinite: false,  // Change to false to prevent infinite scrolling
            slidesToShow: 3,  // Show 3 full items
            speed: 1000,
            slidesToScroll: 1,
            arrows: true, // Enable arrows but they will be hidden with CSS
            dots: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        arrows: false,
                        dots: true,
                        // centerMode: true,
                        // centerPadding: '2%',
                        slidesToShow: 1
                    }
                }
            ]
        });

        // Ensure carousel is fully initialized
        setTimeout(function() {
            // Custom arrow click handlers
            $(".trigger_prev, .trigger_prev_arrow").click(function(e) {
                e.preventDefault();
                $newsCarousel.slick('slickPrev');
                return false;
            });
            
            $(".trigger_next, .trigger_next_arrow").click(function(e) {
                e.preventDefault();
                $newsCarousel.slick('slickNext');
                return false;
            });
            
            // Initialize button states
            $('.trigger_prev, .trigger_prev_arrow').css('opacity', '0.5');
        }, 100);
        
        // Limit the width of the slick track to prevent excessive scrolling
        $newsCarousel.on('init', function(event, slick){
            // Add class to first visible slide
            $(slick.$slides[0]).addClass('first-visible-slide');
        });
        
        $newsCarousel.on('afterChange', function(event, slick, currentSlide){
            $('.slick-slide').removeClass('first-visible-slide');
            $(slick.$slides[currentSlide]).addClass('first-visible-slide');
        });
        
        // Ensure navigation works correctly with our constrained carousel
        $newsCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            // If we're at the last possible slide, prevent further navigation
            if (nextSlide >= slick.slideCount - 3) {
                // Disable next button visually
                $('.trigger_next, .trigger_next_arrow').css('opacity', '0.5');
            } else {
                // Enable next button
                $('.trigger_next, .trigger_next_arrow').css('opacity', '1');
            }
            
            // If we're at the first slide, disable previous button
            if (nextSlide === 0) {
                $('.trigger_prev, .trigger_prev_arrow').css('opacity', '0.5');
            } else {
                $('.trigger_prev, .trigger_prev_arrow').css('opacity', '1');
            }
        });
    }
    
    // Read more button that follows cursor for news items only (excluding newsletters)
    if(screen.width > 1024){
        $('.home-news-cover a, .related-news .home-news-cover a').on('mouseenter', function(e) {
            // Show the button immediately at the current mouse position
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            
            $(this).find('.read-more-btn').css({
                display: 'block',
                opacity: 1,
                left: relX + 'px',
                top: relY + 'px'
            });
        }).on('mouseleave', function() {
            // Hide the button immediately
            $(this).find('.read-more-btn').css({
                display: 'none'
            });
        }).on('mousemove', function(e) {
            var parentOffset = $(this).offset();
            var relX = e.pageX - parentOffset.left;
            var relY = e.pageY - parentOffset.top;
            var $btn = $(this).find('.read-more-btn');
            var btnWidth = $btn.outerWidth();
            var btnHeight = $btn.outerHeight();
            var containerWidth = $(this).width();
            var containerHeight = $(this).height();
            
            // Remove all edge classes
            $btn.removeClass('edge-right edge-left edge-top edge-bottom');
            
            // Handle edge cases
            var edgeThreshold = 50; // pixels from edge
            
            // Check if near right edge
            if (relX > containerWidth - edgeThreshold) {
                $btn.addClass('edge-right');
                relX = containerWidth - 20;
            } 
            // Check if near left edge
            else if (relX < edgeThreshold) {
                $btn.addClass('edge-left');
                relX = 20;
            }
            
            // Check if near bottom edge
            if (relY > containerHeight - edgeThreshold) {
                $btn.addClass('edge-bottom');
                relY = containerHeight - 20;
            } 
            // Check if near top edge
            else if (relY < edgeThreshold) {
                $btn.addClass('edge-top');
                relY = 20;
            }
            
            // Position the button immediately for precise cursor replacement
            $btn.css({
                left: relX + 'px',
                top: relY + 'px'
            });
        });
    }
});

function type(i, t, ie, oe) {
    input = document.getElementById(ie).innerHTML;
    document.getElementById(oe).innerHTML += input.charAt(i);
    setTimeout(function(){
        ((i < input.length - 1) ? type(i+1, t, ie, oe) : false);
    }, t);
}

function onHashChange(){
	$("g").removeClass('active_path');
	$(".accordion-content").hide();
	var caseStudiesHashTitle = location.hash;

	if(caseStudiesHashTitle){
		var caseStudiesTitle = caseStudiesHashTitle.substring(1, caseStudiesHashTitle.length);
		
		// Check if the hash corresponds to a tab
		if(['about', 'work-packages', 'partners'].includes(caseStudiesTitle)) {
		    // Trigger tab click
		    $('.tab-link[data-tab="' + caseStudiesTitle + '"]').trigger('click');
		    
		    // If it's the work-packages tab, initialize the toggle functionality
		    if(caseStudiesTitle === 'work-packages') {
		        initWorkPackagesToggle();
		    }
		} else {
		    // Handle other hash values (like case studies)
		    $("g[title='"+caseStudiesTitle.toUpperCase()+"']").addClass('active_path');
		}
	}
}

function encodeURIObject(data){
    return Object.keys(data).map(function (i) {
        return encodeURIComponent(i) + '=' + encodeURIComponent(data[i])
    }).join('&');
}

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

function requestFormLibrary() {
	$('#mylibraryForm').on('click', 'a', function () {
		var $form = $(this).closest('form');
		$form.request();
	})
}

function requestFormPartners() {
	$('#myPartnersForm').on('click', 'a', function () {
		var $form = $(this).closest('form');
		$form.request();
	})
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

function initCircleAnimation(circleBorderSelector, containerSelector) {
    const circleBorder = document.querySelector(circleBorderSelector);
    if (!circleBorder) return;
    
    const imageContainer = document.querySelector(containerSelector);
    if (imageContainer) {
        imageContainer.addEventListener('mouseenter', function() {
            circleBorder.style.animationDirection = 'reverse';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            circleBorder.style.animationDirection = 'normal';
        });
    }
}

/**
 * Handles tab switching without page refreshes
 * This function initializes tab functionality for the about page
 */
function initTabs() {
    // Check if there's already an active tab content
    if ($('.tab-content.active').length === 0) {
        // No active tab found, activate the first tab
        var $activeTabLink = $('.tab-link.active');
        if ($activeTabLink.length > 0) {
            var firstTabId = $activeTabLink.data('tab');
            $('#' + firstTabId).addClass('active');
        }
    }
    
    // Hide all tab content except the active one on page load
    $('.tab-content').not('.active').css({
        'display': 'none',
        'opacity': '0'
    });
    
    // Make sure active tab is visible
    $('.tab-content.active').css({
        'display': 'block',
        'opacity': '1'
    });
    
    // Handle tab click events
    $('.tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Get the tab id from data attribute
        var tabId = $(this).data('tab');
        
        // Remove active class from all tabs and add to clicked tab
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        
        // Hide all tab content immediately
        $('.tab-content').removeClass('active').css({
            'display': 'none',
            'opacity': '1'
        });
        
        // Show the active tab immediately
        $('#' + tabId).css('display', 'block').addClass('active');
        
        // If switching to work-packages tab, make sure accordion functionality is initialized
        if (tabId === 'work-packages') {
            // Reinitialize accordion if needed
            initAccordion();
            // Reinitialize work packages toggle
            initWorkPackagesToggle();
            
            // Re-wrap work package items if needed
            if (width >= 1024 && !$('#work-packages .key_0').parent().hasClass('col-md-4')) {
                // First column: items 0, 3, 6, 9, etc.
                $('#work-packages .key_0, #work-packages .key_3, #work-packages .key_6, #work-packages .key_9, #work-packages .key_12, #work-packages .key_15').wrapAll('<div class="col-md-4 col-xs-12" />');
                
                // Second column: items 1, 4, 7, 10, etc.
                $('#work-packages .key_1, #work-packages .key_4, #work-packages .key_7, #work-packages .key_10, #work-packages .key_13, #work-packages .key_16').wrapAll('<div class="col-md-4 col-xs-12" />');
                
                // Third column: items 2, 5, 8, 11, etc.
                $('#work-packages .key_2, #work-packages .key_5, #work-packages .key_8, #work-packages .key_11, #work-packages .key_14, #work-packages .key_17').wrapAll('<div class="col-md-4 col-xs-12" />');
            }
        }
        
        // If switching to partners tab, initialize content truncation
        if (tabId === 'partners') {
            initPartnerContentTruncation();
        }
        
        // Reinitialize project materials functionality for all tabs
        setTimeout(function() {
            initProjectMaterialsNameDisplay();
            initProjectMaterialsDropdowns();
        }, 100);
        
        if (history.pushState) {
            history.pushState(null, null, '#' + tabId);
        } else {
            location.hash = '#' + tabId;
        }
    });
    
    if (window.location.hash) {
        var tabId = window.location.hash.substring(1);
        $('.tab-link[data-tab="' + tabId + '"]').trigger('click');
    }
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

/**
 * Initialize work packages toggle functionality
 * This ensures the read more/less buttons work properly in the work packages section
 */
function initWorkPackagesToggle() {
    $('.read-more-wp').off('click');
    
    $('.read-more-wp').on('click', function() {
        toggleWorkPackage(this);
    });
}

/**
 * Toggle work package content visibility
 * @param {HTMLElement} element - The clicked "Read more" button
 */
function toggleWorkPackage(element) {
    var $button = $(element);
    var $workPackageBox = $button.closest('.work-package-box');
    var $content = $workPackageBox.find('.wp-content');
    
    if ($content.is(':visible')) {
        $button.removeClass('arrow-up');
        $content.hide();
        $button.text('Read more');
    } else {
        $button.addClass('arrow-up');
        $content.show();
        $button.text('Read less');
    }
}

/**
 * Initialize partner content truncation
 * Truncates partner descriptions to 255 characters without breaking words
 */
function initPartnerContentTruncation() {
    $('.partner-content').each(function() {
        var $partnerContent = $(this);
        var $fullContent = $partnerContent.find('.partner-description-full');
        var $truncatedContent = $partnerContent.find('.partner-description-truncated');
        var $button = $partnerContent.find('.read-more-partner');
        
        var fullText = $fullContent.data('full-content');
        var maxLength = 255;
        
        if (fullText && fullText.length > maxLength) {
            var truncatedText = fullText.substring(0, maxLength);
            var lastSpaceIndex = truncatedText.lastIndexOf(' ');
            if (lastSpaceIndex > 0) {
                truncatedText = truncatedText.substring(0, lastSpaceIndex);
            }
            truncatedText += '...';
            $truncatedContent.html(truncatedText);
            $truncatedContent.show();
            $fullContent.hide();
            $button.show();
        } else {
            $truncatedContent.html(fullText);
            $truncatedContent.show();
            $fullContent.hide();
            $button.hide();
        }
    });

    // Open popup instead of toggling inline content
    $(document).off('click.readMorePartner').on('click.readMorePartner', '.read-more-partner', function(e){
        e.preventDefault();
        e.stopPropagation();
        var id = $(this).closest('.partner-record').data('partner-id');
        var $popup = $('#partner-popup-' + id);
        if($popup.length){
            $('body').addClass('modal-open');
            $popup.addClass('open').attr('aria-hidden','false');
            // Ensure popup internal interactions are initialized when opened via the link
            initPopupReadMore($popup);
        }
    });
}

// Simple popup open/close for partners
function initPartnersPopup(){
    // Add accessibility attributes to partner records
    $('.partner-record').each(function() {
        var $card = $(this);
        var partnerName = $card.find('.col-xs-8').first().text().trim();

        // Make card focusable and add ARIA attributes
        $card.attr({
            'tabindex': '0',
            'role': 'button',
            'aria-label': 'View details for ' + partnerName,
            'aria-expanded': 'false'
        });
    });

    // Open on click of record
    $(document).off('click.partnerOpen').on('click.partnerOpen', '.partner-record', function(e){
        // Avoid opening when clicking links inside
        if($(e.target).closest('a, button, summary, details').length){ return; }
        e.stopPropagation();
        var id = $(this).data('partner-id');
        var $popup = $('#partner-popup-' + id);
        if($popup.length){
            $('body').addClass('modal-open');
            $popup.addClass('open').attr('aria-hidden','false');
            $(this).attr('aria-expanded', 'true');

            // Initialize read more functionality for this popup
            initPopupReadMore($popup);
        }
    });

    // Keyboard support (Enter and Space keys)
    $(document).off('keydown.partnerKeyboard').on('keydown.partnerKeyboard', '.partner-record', function(e){
        // Check for Enter or Space key
        if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    // Close interactions
    $(document).off('click.partnerClose').on('click.partnerClose', '[data-close-popup]', function(e){
        e.preventDefault();
        e.stopPropagation();
        var $popup = $(this).closest('.partner-popup');
        var popupId = $popup.attr('id').replace('partner-popup-', '');

        // Reset aria-expanded on the partner card
        $('.partner-record[data-partner-id="' + popupId + '"]').attr('aria-expanded', 'false');

        $popup.removeClass('open').attr('aria-hidden','true');
        $('body').removeClass('modal-open');
    });

    $(document).off('keydown.partnerEsc').on('keydown.partnerEsc', function(e){
        if(e.key === 'Escape'){
            $('.partner-popup.open [data-close-popup]').first().trigger('click');
        }
    });
}

// Read more functionality for popup content
function initPopupReadMore($popup) {
    // Check each readmore block to see if content actually overflows
    $popup.find('.readmore-block').each(function() {
        var $block = $(this);
        var $content = $block.find('.readmore-content');
        var $toggle = $block.find('.readmore-toggle');

        // Check if content overflows (scrollHeight > clientHeight means content is truncated)
        if ($content[0] && $content[0].scrollHeight > $content[0].clientHeight) {
            // Content overflows - show the read more button
            $toggle.show();
        } else {
            // Content fits within 3 lines - hide the read more button
            $toggle.hide();
        }
    });

    // Handle readmore toggles
    $popup.off('click.readmore').on('click.readmore', '.readmore-toggle', function(e) {
        e.preventDefault();
        var $toggle = $(this);
        var $block = $toggle.closest('.readmore-block');
        var $text = $toggle.find('.readmore-text');

        if ($block.hasClass('expanded')) {
            $block.removeClass('expanded');
            $text.text($toggle.data('collapsed-text') || 'Read more');
        } else {
            $block.addClass('expanded');
            $text.text($toggle.data('expanded-text') || 'Read less');
        }
    });
    
    // Handle member biography toggles
    $popup.off('click.memberBio').on('click.memberBio', '.member-bio-toggle', function(e) {
        e.preventDefault();
        var $toggle = $(this);
        var memberId = $toggle.data('member-id');
        var $bio = $popup.find('#member-bio-' + memberId);
        
        if ($bio.is(':visible')) {
            $bio.slideUp(300);
            $toggle.removeClass('expanded');
        } else {
            // Close other open bios first
            $popup.find('.member-bio:visible').slideUp(300);
            $popup.find('.member-bio-toggle.expanded').removeClass('expanded');
            
            $bio.slideDown(300);
            $toggle.addClass('expanded');
        }
    });
}



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
 * Restructure library cards to match Figma design
 * Reorganizes the card layout and extracts version numbers from titles
 */
function restructureLibraryCards() {
    $('.library-item').each(function() {
        var $card = $(this);
        var $row = $card.find('.row');
        var $contentCol = $row.find('.col-xs-12.col-md-9');
        var $downloadCol = $row.find('.col-xs-12.col-md-3');
        
        // Get elements
        var $typeLabel = $contentCol.find('.library-type-label');
        var $title = $contentCol.find('h3');
        var $body = $contentCol.find('.body');
        var $downloadBtn = $downloadCol.find('.btn');
        
        // Extract version number from title (e.g., "D2.2" from "D2.2 Lorem Ipsum...")
        var titleText = $title.text();
        var versionMatch = titleText.match(/^([A-Z]\d+\.\d+)/);
        var versionNumber = '';
        var cleanTitle = titleText;
        
        if (versionMatch) {
            versionNumber = versionMatch[1].substring(1); // Remove the "D" prefix to get "2.2"
            cleanTitle = titleText; // Keep full title for now
        }
        
        // Get document type from existing label
        var docType = $typeLabel.find('.doc_type').text() || 'Document';
        
        // Clear the row and rebuild structure
        $row.empty();
        
        // Create new structure
        var newStructure = `
            <div class="card-header">
                <div class="card-labels">
                    <span class="card-type-label">${docType}</span>
                    ${versionNumber ? `<span class="card-version-label">${versionNumber}</span>` : ''}
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${cleanTitle}</h3>
                <div class="card-details"></div>
            </div>
            <div class="card-footer">
                <div class="card-download-btn"></div>
            </div>
        `;
        
        $row.html(newStructure);
        
        // Move body content to card-details
        $row.find('.card-details').append($body.html());
        
        // Style status text as green
        $row.find('.card-details').find('div').each(function() {
            var $div = $(this);
            if ($div.find('.text-bold').text().toLowerCase().includes('status')) {
                $div.find('.text-ligth').addClass('status-approved');
            }
        });
        
        // Move download button to card-footer and make it full width
        $downloadBtn.addClass('card-download-full');
        $row.find('.card-download-btn').append($downloadBtn);
    });
}

/**
 * Initialize project materials name display functionality
 * Shows the name of the material in bottom left corner on hover
 */
function initProjectMaterialsNameDisplay() {
    // Target all project material containers
    var materialContainers = $('.logo-container, .flyer-container, .presentation-container, .newsletter-container');
    
    if (!materialContainers.length) {
        return; // Exit if no containers found
    }
    
    // Enhanced hover functionality for better accessibility and performance
    materialContainers.each(function() {
        var $container = $(this);
        var itemName = $container.data('item-name');
        
        // Only proceed if the container has an item name
        if (itemName) {
            // Add hover events with improved animation
            $container.on('mouseenter.projectMaterials', function() {
                // Ensure the pseudo-element content is ready
                $(this).addClass('name-tooltip-active');
            });
            
            $container.on('mouseleave.projectMaterials', function() {
                // Clean up on mouse leave
                $(this).removeClass('name-tooltip-active');
            });
        }
    });
}

/**
 * Initialize project materials dropdown functionality
 * Handles dropdown expansion on click instead of hover
 */
function initProjectMaterialsDropdowns() {
    // Handle dropdown button clicks
    $(document).off('click.projectDropdown').on('click.projectDropdown', '.download-dropdown .download-btn-main', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var $dropdown = $(this).closest('.download-dropdown');
        var $allDropdowns = $('.download-dropdown');
        var $dropdownMenu = $dropdown.find('.dropdown-menu');
        
        // Close all other dropdowns
        $allDropdowns.not($dropdown).removeClass('dropdown-open');
        
        // Toggle current dropdown
        $dropdown.toggleClass('dropdown-open');
        
        // Ensure dropdown menu has the highest z-index when opened
        if ($dropdown.hasClass('dropdown-open')) {
            $dropdownMenu.css('z-index', '99999999');
            
            // Position dropdown to avoid overflow
            setTimeout(function() {
                var $menu = $dropdown.find('.dropdown-menu');
                var menuOffset = $menu.offset();
                var menuWidth = $menu.outerWidth();
                var menuHeight = $menu.outerHeight();
                var windowWidth = $(window).width();
                var windowHeight = $(window).height();
                
                // Adjust horizontal position if menu goes off-screen
                if (menuOffset && menuOffset.left + menuWidth > windowWidth) {
                    $menu.css({
                        'left': 'auto',
                        'right': '0',
                        'transform': 'none'
                    });
                } else if (menuOffset && menuOffset.left < 0) {
                    $menu.css({
                        'left': '0',
                        'right': 'auto',
                        'transform': 'none'
                    });
                }
                
                // Adjust vertical position if menu goes off-screen
                if (menuOffset && menuOffset.top + menuHeight > windowHeight) {
                    $menu.css('top', 'auto');
                    $menu.css('bottom', 'calc(100% + 8px)');
                }
            }, 10);
        } else {
            // Reset z-index when closed
            $dropdownMenu.css('z-index', '9999999');
        }
    });
    
    // Close dropdowns when clicking outside
    $(document).off('click.projectDropdownOutside').on('click.projectDropdownOutside', function(e) {
        if (!$(e.target).closest('.download-dropdown').length) {
            $('.download-dropdown').removeClass('dropdown-open');
            $('.download-dropdown .dropdown-menu').css('z-index', '9999999');
        }
    });
    
    // Handle dropdown item clicks
    $(document).off('click.projectDropdownItem').on('click.projectDropdownItem', '.download-dropdown .dropdown-item', function(e) {
        // Close dropdown after item is clicked
        var $dropdown = $(this).closest('.download-dropdown');
        $dropdown.removeClass('dropdown-open');
        $dropdown.find('.dropdown-menu').css('z-index', '9999999');
    });
}

/**
 * Initialize footer dropdown functionality
 * Handles dropdown toggles in the footer menu with simple click behavior
 */
function initFooterDropdowns() {
    // Mark dropdown items that have submenus
    $('.footer-menu .footer-menu-item').each(function() {
        var $item = $(this);
        var $submenu = $item.find('.dropdown-menu');
        
        if ($submenu.length > 0) {
            $item.addClass('dropdown');
        }
    });
    
    // Handle dropdown clicks
    $('.footer-menu .footer-menu-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var $parentItem = $(this).parent();
        var $dropdownMenu = $parentItem.find('.dropdown-menu');
        
        if ($dropdownMenu.length) {
            // Close all other footer dropdowns first
            $('.footer-menu .footer-menu-item.dropdown').not($parentItem).removeClass('active');
            $('.footer-menu .dropdown-menu').not($dropdownMenu).removeClass('show');
            
            // Toggle current dropdown
            $parentItem.toggleClass('active');
            $dropdownMenu.toggleClass('show');
        }
    });
    
    // Close dropdowns when clicking outside
    $(document).on('click.footerDropdown', function(e) {
        if (!$(e.target).closest('.footer-menu').length) {
            $('.footer-menu .footer-menu-item.dropdown').removeClass('active');
            $('.footer-menu .dropdown-menu').removeClass('show');
        }
    });
    
    // Prevent dropdown menu clicks from closing the dropdown
    $('.footer-menu .dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Allow dropdown menu links to work normally
    $('.footer-menu .dropdown-menu a').on('click', function(e) {
        // Don't prevent default - let the link work normally
        // Just close the dropdown after a short delay
        setTimeout(function() {
            $('.footer-menu .footer-menu-item.dropdown').removeClass('active');
            $('.footer-menu .dropdown-menu').removeClass('show');
        }, 100);
    });
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

/**
 * Rename library category tabs with proper capitalization
 * Updates the text content of library tabs to match desired formatting
 */
function renameLibraryCategoryTabs() {
    var $libraryTabs = $('#mylibraryForm');
    
    if ($libraryTabs.length) {
        // Define the mapping of data-type to proper text
        var tabLabels = {
            '0': 'All documents',
            '4': 'Deliverables & milestones',
            '2': 'Relevant publications',
            '3': 'OneSTOP publications'
        };
        
        // Update each tab's text content
        $libraryTabs.find('a').each(function() {
            var $tab = $(this);
            var dataType = $tab.data('type');
            
            if (tabLabels[dataType]) {
                $tab.text(tabLabels[dataType]);
            }
        });
    }
}

/**
 * Advisory Board Profile Popup functionality
 * Handles opening and closing of advisory board profile popups
 * Following the same pattern as partners popup
 */
function initAdvisoryBoardPopups() {
    // Handle read biography button clicks
    $(document).on('click', '.read-biography-btn', function(e) {
        e.preventDefault();
        var profileId = $(this).data('profile-id');
        var popup = $('#advisory-popup-' + profileId);

        if (popup.length) {
            $('body').addClass('modal-open');
            popup.addClass('open').attr('aria-hidden', 'false');
        }
    });

    // Close interactions using data attribute (following partners pattern)
    $(document).off('click.advisoryClose').on('click.advisoryClose', '[data-close-advisory-popup]', function(e) {
        e.preventDefault();
        var popup = $(this).closest('.advisory-profile-popup');
        popup.removeClass('open').attr('aria-hidden', 'true');
        $('body').removeClass('modal-open');
    });

    // Handle escape key to close popup
    $(document).off('keydown.advisoryEsc').on('keydown.advisoryEsc', function(e) {
        if (e.key === 'Escape') {
            $('.advisory-profile-popup.open [data-close-advisory-popup]').first().trigger('click');
        }
    });
}

/**
 * Video Popup functionality
 * Handles opening and closing of the YouTube video popup with smooth animations
 */
function initVideoPopup() {
    var $videoPopup = $('#videoPopup');
    var $videoIframe = $('#videoIframe');

    // Open video popup
    $('#watchVideoBtn').on('click', function(e) {
        e.preventDefault();

        // Get video URL from data attribute
        var videoUrl = $videoIframe.data('video-url');

        // Set the video URL to start playback
        $videoIframe.attr('src', videoUrl);

        // Open the popup
        $('body').addClass('modal-open');
        $videoPopup.removeClass('closing').addClass('open').attr('aria-hidden', 'false');
    });

    // Close video popup function
    function closeVideoPopup() {
        // Add closing animation class
        $videoPopup.addClass('closing');

        // Wait for animation to complete before hiding
        setTimeout(function() {
            $videoPopup.removeClass('open closing').attr('aria-hidden', 'true');
            $('body').removeClass('modal-open');

            // Stop video playback by clearing the iframe src
            $videoIframe.attr('src', '');
        }, 300); // Match the CSS animation duration
    }

    // Close button click handler (must come before dialog handler)
    $(document).off('click.videoCloseBtn').on('click.videoCloseBtn', '.video-popup-close', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeVideoPopup();
    });

    // Close button and backdrop click handlers
    $(document).off('click.videoClose').on('click.videoClose', '[data-close-video]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeVideoPopup();
    });

    // Close on escape key
    $(document).off('keydown.videoEsc').on('keydown.videoEsc', function(e) {
        if (e.key === 'Escape' && $videoPopup.hasClass('open')) {
            closeVideoPopup();
        }
    });

    // Prevent closing when clicking inside the dialog (but allow close button)
    $('.video-popup-dialog').on('click', function(e) {
        if (!$(e.target).closest('.video-popup-close').length) {
            e.stopPropagation();
        }
    });
}
