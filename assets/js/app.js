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

/**
 * Initialize Advisory Board Popup functionality
 * Handles modal open/close with pre-rendered content from Twig
 */
function initAdvisoryBoardPopup() {
    var $modal = $('#advisoryBoardModal');
    var $modalContent = $('#advisoryModalContent');
    var $closeBtn = $('#advisoryBoardModalClose');
    var $readMoreLinks = $('.advisory-board .read-more');

    // Show popup when "Read more" is clicked
    $readMoreLinks.off('click.advisoryPopup').on('click.advisoryPopup', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Store the element that triggered the modal for focus restoration
        $modal.data('lastFocusedElement', this);

        // Get profile ID and find pre-rendered content
        var profileId = $(this).data('profile-id');
        var $content = $('.profile-content[data-profile-id="' + profileId + '"]');

        // Clone and insert content into modal
        if ($content.length) {
            $modalContent.html($content.html());
            showAdvisoryBoardPopup();
        }
    });

    // Close button click
    $closeBtn.off('click.advisoryClose').on('click.advisoryClose', function(e) {
        e.preventDefault();
        e.stopPropagation();
        hideAdvisoryBoardPopup();
    });

    // Close on overlay click (clicking outside the modal)
    $modal.off('click.advisoryOverlay').on('click.advisoryOverlay', function(e) {
        if ($(e.target).is($modal)) {
            hideAdvisoryBoardPopup();
        }
    });

    // Close on Escape key
    $(document).off('keydown.advisoryEscape').on('keydown.advisoryEscape', function(e) {
        if (e.key === 'Escape' && $modal.hasClass('show')) {
            hideAdvisoryBoardPopup();
        }
    });
}

/**
 * Show Advisory Board Popup
 * Manages focus, ARIA attributes, and body scroll
 */
function showAdvisoryBoardPopup() {
    var $modal = $('#advisoryBoardModal');

    // Add show class to display modal
    $modal.addClass('show');

    // Update ARIA attributes
    $modal.attr('aria-hidden', 'false');

    // Prevent body scroll
    $('body').css('overflow', 'hidden');

    // Set focus to modal title for screen reader announcement
    // Add small delay to ensure DOM is ready
    setTimeout(function() {
        $('#advisoryModalContent .advisory-popup-name').focus();
    }, 100);
}

/**
 * Hide Advisory Board Popup
 * Restores focus, ARIA attributes, and body scroll
 */
function hideAdvisoryBoardPopup() {
    var $modal = $('#advisoryBoardModal');
    var lastFocusedElement = $modal.data('lastFocusedElement');

    // Remove show class to hide modal
    $modal.removeClass('show');

    // Update ARIA attributes
    $modal.attr('aria-hidden', 'true');

    // Restore body scroll
    $('body').css('overflow', '');

    // Return focus to the triggering element without scrolling
    if (lastFocusedElement) {
        setTimeout(function() {
            // Prevent scroll by using preventScroll option
            if (lastFocusedElement.focus) {
                lastFocusedElement.focus({ preventScroll: true });
            }
        }, 100);
    }
}

/**
 * Initialize Partners Popup functionality
 * Handles modal open/close with pre-rendered content from Twig
 */
function initPartnersPopup() {
    var $modal = $('#partnersModal');
    var $modalContent = $('#partnersModalContent');
    var $closeBtn = $('#partnersModalClose');
    var $partnerCards = $('.partner-card-clickable');

    // Show popup when partner card is clicked
    $partnerCards.off('click.partnersPopup').on('click.partnersPopup', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Store the element that triggered the modal for focus restoration
        $modal.data('lastFocusedElement', this);

        // Get partner ID and find pre-rendered content
        var partnerId = $(this).data('partner-id');
        var $content = $('.partner-content[data-partner-id="' + partnerId + '"]');

        // Clone and insert content into modal
        if ($content.length) {
            $modalContent.html($content.html());

            // Initialize read more functionality for this content
            initPartnersReadMore();

            // Initialize biography toggle functionality (always, not dependent on read-more)
            initPartnersBiographyToggle();

            showPartnersPopup();
        }
    });

    // Handle keyboard enter/space on partner cards
    $partnerCards.off('keydown.partnersPopup').on('keydown.partnersPopup', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    // Close button click
    $closeBtn.off('click.partnersClose').on('click.partnersClose', function(e) {
        e.preventDefault();
        e.stopPropagation();
        hidePartnersPopup();
    });

    // Close on overlay click (clicking outside the modal)
    $modal.off('click.partnersOverlay').on('click.partnersOverlay', function(e) {
        if ($(e.target).is($modal)) {
            hidePartnersPopup();
        }
    });

    // Close on Escape key
    $(document).off('keydown.partnersEscape').on('keydown.partnersEscape', function(e) {
        if (e.key === 'Escape' && $modal.hasClass('show')) {
            hidePartnersPopup();
        }
    });
}

/**
 * Initialize "Read more" toggle for Partners popup content
 * Called after content is cloned into modal
 */
function initPartnersReadMore() {
    var $content = $('#partnersModalContent .partners-popup-content');
    var $readMore = $('#partnersModalContent .partners-popup-read-more');

    if (!$readMore.length) return;

    var fullText = $content.text().trim();
    var truncatedText = fullText.substring(0, 300);

    // Only show read more if text is longer than 300 characters
    if (fullText.length <= 300) {
        $readMore.hide();
        return;
    }

    truncatedText += '...';

    // Initially show truncated text
    $content.text(truncatedText);
    $content.data('full-text', fullText);
    $content.data('expanded', false);
    $readMore.show();

    // Toggle on click
    $readMore.off('click').on('click', function(e) {
        e.preventDefault();
        var isExpanded = $content.data('expanded');
        var $icon = $(this).find('.read-more-icon');

        if (isExpanded) {
            // Collapse
            $content.text(truncatedText);
            $content.data('expanded', false);
            $(this).contents().filter(function() {
                return this.nodeType === 3;
            }).first().replaceWith('Read more ');
            $icon.css('transform', 'rotate(0deg)');
        } else {
            // Expand
            $content.text(fullText);
            $content.data('expanded', true);
            $(this).contents().filter(function() {
                return this.nodeType === 3;
            }).first().replaceWith('Read less ');
            $icon.css('transform', 'rotate(180deg)');
        }
    });
}

/**
 * Initialize Biography toggle for team members in Partners popup
 * Shows/hides team member biography content
 */
function initPartnersBiographyToggle() {
    var $bioLinks = $('#partnersModalContent .partner-team-bio');

    // Remove any existing handlers
    $bioLinks.off('click.biographyToggle');

    // Attach new handlers
    $bioLinks.on('click.biographyToggle', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $link = $(this);
        var $teamInfo = $link.closest('.partner-team-info');
        var $bioContent = $teamInfo.find('.partner-team-bio-content');
        var $icon = $link.find('.bio-icon');

        // Check if content exists
        if ($bioContent.length === 0) {
            return;
        }

        // Toggle visibility
        if ($bioContent.is(':visible')) {
            // Hide biography
            $bioContent.slideUp(300);
            // Update text node (the text before the icon)
            var textNode = $link.contents().filter(function() {
                return this.nodeType === 3; // Text node
            })[0];
            if (textNode) {
                textNode.nodeValue = 'Biography ';
            }
            $icon.css('transform', 'rotate(0deg)');
        } else {
            // Show biography
            $bioContent.slideDown(300);
            // Update text node
            var textNode = $link.contents().filter(function() {
                return this.nodeType === 3; // Text node
            })[0];
            if (textNode) {
                textNode.nodeValue = 'Hide Biography ';
            }
            $icon.css('transform', 'rotate(180deg)');
        }
    });
}

/**
 * Show Partners Popup
 * Manages focus, ARIA attributes, and body scroll
 */
function showPartnersPopup() {
    var $modal = $('#partnersModal');

    // Add show class to display modal
    $modal.addClass('show');

    // Update ARIA attributes
    $modal.attr('aria-hidden', 'false');

    // Prevent body scroll
    $('body').css('overflow', 'hidden');

    // Set focus to modal title for screen reader announcement
    // Add small delay to ensure DOM is ready
    setTimeout(function() {
        $('#partnersModalContent .partners-popup-name').focus();
    }, 100);
}

/**
 * Hide Partners Popup
 * Restores focus, ARIA attributes, and body scroll
 */
function hidePartnersPopup() {
    var $modal = $('#partnersModal');
    var lastFocusedElement = $modal.data('lastFocusedElement');

    // Remove show class to hide modal
    $modal.removeClass('show');

    // Update ARIA attributes
    $modal.attr('aria-hidden', 'true');

    // Restore body scroll
    $('body').css('overflow', '');

    // Return focus to the triggering element without scrolling
    if (lastFocusedElement) {
        setTimeout(function() {
            // Prevent scroll by using preventScroll option
            if (lastFocusedElement.focus) {
                lastFocusedElement.focus({ preventScroll: true });
            }
        }, 100);
    }
}

$(document).ready(function() {
    // Set menu ID for compatibility
    $('.navbar-nav').attr('id', 'menu');

    // Clean up data-toggle attributes to prevent Bootstrap interference (only once)
    $('#headerNavbarNav .nav-item > a[data-toggle="dropdown"], #headerNavbarNav .dropdown > a[data-toggle="dropdown"]').removeAttr('data-toggle');

    // Initialize hamburger menu dropdown functionality
    initHamburgerMenuDropdowns();

    // Initialize Advisory Board Popup functionality
    initAdvisoryBoardPopup();

    // Initialize Partners Popup functionality
    initPartnersPopup();

    // Initialize Work Packages Accordion functionality
    initWorkPackagesAccordion();

    // Initialize Biography Toggle functionality
    initBiographyToggle();

    // Wrap nav-item text in span for roulette animation (desktop only)
    if (window.matchMedia('(min-width: 992px)').matches) {
        $('.navbar-nav-wrapper .nav-item > a').each(function() {
            var $link = $(this);
            var text = $link.text().trim();

            // Don't wrap if it already contains spans (to avoid double wrapping)
            if (!$link.find('.nav-text').length && text) {
                // Create two copies: one goes up, one comes from bottom
                $link.html(
                    '<span class="nav-text-wrapper">' +
                        '<span class="nav-text nav-text-1">' + text + '</span>' +
                        '<span class="nav-text nav-text-2">' + text + '</span>' +
                    '</span>'
                );
            }
        });
    }

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

    $("nav").removeClass("no-transition");

    // Responsive Menu System
    // Handles both desktop (hover-based) and mobile (hamburger) menus
    var isDesktop = window.matchMedia('(min-width: 992px)').matches;

    // Mobile Hamburger Menu Toggle - Use CSS classes instead of inline styles
    $('#desktopMenuToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Open the menu using CSS class only
        $('#headerNavbarNav').addClass('show');
        $('#desktopMenuToggle').addClass('active');
        $('#desktopMenuToggle').attr('aria-expanded', 'true');
        $('body').addClass('menu-open');
    });

    // Close mobile menu with X button
    $('#closeMobileMenu').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $('#headerNavbarNav').removeClass('show');
        $('#desktopMenuToggle').removeClass('active');
        $('#desktopMenuToggle').attr('aria-expanded', 'false');
        $('body').removeClass('menu-open');
    });

    // Close mobile menu when clicking outside
    $(document).on('click.menuClose', function(event) {
        var $navbarNav = $('#headerNavbarNav');
        var $desktopToggle = $('#desktopMenuToggle');
        var $actionsWrapper = $('.mobile-actions-wrapper');

        // Only for mobile menu (hamburger)
        if ($navbarNav.hasClass('show') &&
            !$navbarNav.is(event.target) &&
            $navbarNav.has(event.target).length === 0 &&
            !$desktopToggle.is(event.target) &&
            $desktopToggle.has(event.target).length === 0 &&
            !$actionsWrapper.is(event.target) &&
            $actionsWrapper.has(event.target).length === 0) {

            $navbarNav.removeClass('show');
            $desktopToggle.removeClass('active');
            $desktopToggle.attr('aria-expanded', 'false');
            $('body').removeClass('menu-open');
        }
    });

    // Prevent clicks on the mobile menu from closing it
    $('#headerNavbarNav').on('click', function(e) {
        e.stopPropagation();
    });

    // Mobile menu dropdown handling is now handled by initHamburgerMenuDropdowns()
    // This ensures proper accordion behavior within the mobile menu

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
            $('#headerNavbarNav').removeClass('show');
            $('#desktopMenuToggle').removeClass('active');
            $('#desktopMenuToggle').attr('aria-expanded', 'false');
            $('body').removeClass('menu-open');
        }

        isDesktop = nowDesktop;
    });

    $('.work_packages .accordion-content, .messages .accordion-toggle').each(function( index, value ) {
        $(value).find('a').attr( "onclick", "window.open(this.href, '_blank');" )
    });

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

    // Hero Carousel Initialization
    if($('.hero-carousel').length){
        $('.hero-carousel').slick({
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 5000,
            fade: true,
            cssEase: 'linear',
            speed: 1000,
            infinite: true,
            pauseOnHover: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: false,
            responsive: [
                {
                    breakpoint: 992, // Tablets and below
                    settings: {
                        autoplaySpeed: 4000,
                        speed: 800
                    }
                },
                {
                    breakpoint: 576, // Mobile phones
                    settings: {
                        autoplaySpeed: 4000,
                        speed: 800
                    }
                }
            ]
        });
    }

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
 * Initialize Work Packages Accordion functionality
 * Handles accordion toggle for new wp-accordion structure with Figma design
 */
function initWorkPackagesAccordion() {
    // Target new wp-accordion structure
    $('.work-packages .wp-accordion .accordion-toggle').off('click.wpAccordion');

    $('.work-packages .wp-accordion .accordion-toggle').on('click.wpAccordion', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $accordion = $(this).closest('.wp-accordion');
        var $content = $accordion.find('.accordion-content');
        var isActive = $accordion.hasClass('active');

        if (isActive) {
            // Close accordion
            $content.slideUp(300);
            $accordion.removeClass('active');
        } else {
            // Open accordion
            $content.slideDown(300);
            $accordion.addClass('active');
        }
    });
}

/**
 * Initialize Biography Toggle functionality
 * Handles show/hide of biography content within lead profile cards
 */
function initBiographyToggle() {
    $('.work-packages .biography-toggle').off('click.bioToggle');

    $('.work-packages .biography-toggle').on('click.bioToggle', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $button = $(this);
        var $leadSection = $button.closest('.wp-lead-section');
        var $biography = $leadSection.find('.lead-biography');
        var $bioText = $button.find('.bio-text');
        var isActive = $button.hasClass('active');

        if (isActive) {
            // Hide biography
            $biography.slideUp(300);
            $button.removeClass('active');
            $bioText.text('Biography');
        } else {
            // Show biography
            $biography.slideDown(300);
            $button.addClass('active');
            $bioText.text('Hide Biography');
        }
    });
}

/**
 * Initialize hamburger menu dropdown functionality
 * Handles dropdown menu toggles, auto-expand, and menu state management
 * Works specifically for mobile menu (inside #headerNavbarNav)
 */
function initHamburgerMenuDropdowns() {
    // Auto-expand dropdowns that contain the current active page
    function autoExpandActiveDropdowns() {
        // Check mobile menu for active items
        var $mobileMenu = $('#headerNavbarNav');
        var activeSubItems = $mobileMenu.find('ul.dropdown-menu li.active, ul.dropdown-menu .nav-item.active');
        
        activeSubItems.each(function() {
            // Find the parent dropdown
            var parentDropdown = $(this).closest('li.dropdown, li.nav-item.dropdown');
            if (parentDropdown.length) {
                var dropdownMenu = parentDropdown.children('ul.dropdown-menu');
                if (!dropdownMenu.length) {
                    dropdownMenu = parentDropdown.next('ul.dropdown-menu');
                }
                if (!dropdownMenu.length) {
                    dropdownMenu = parentDropdown.find('ul.dropdown-menu').first();
                }
                
                // Expand the parent dropdown
                if (dropdownMenu.length) {
                    parentDropdown.addClass('active');
                    dropdownMenu.addClass('show');
                    // Update ARIA
                    parentDropdown.find('> a').attr('aria-expanded', 'true');
                }
            }
        });
    }
    
    // Initialize ARIA attributes for dropdowns
    function initializeAriaAttributes() {
        $('#headerNavbarNav li.dropdown > a, #headerNavbarNav li.nav-item.dropdown > a').each(function() {
            var $link = $(this);
            var $parentItem = $link.closest('li.dropdown, li.nav-item.dropdown');
            
            // Find the dropdown menu
            var $dropdownMenu = $parentItem.children('ul.dropdown-menu');
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentItem.next('ul.dropdown-menu');
            }
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentItem.find('ul.dropdown-menu').first();
            }
            
            if ($dropdownMenu.length) {
                // Set initial ARIA attributes
                if (!$link.attr('aria-expanded')) {
                    $link.attr('aria-expanded', 'false');
                }
                $link.attr('aria-haspopup', 'true');
                $dropdownMenu.attr('role', 'menu');
            }
        });
    }
    
    // Run auto-expand on page load (only for mobile menu)
    // Use setTimeout to ensure menu is rendered
    setTimeout(function() {
        if (window.innerWidth < 992) {
            initializeAriaAttributes();
            autoExpandActiveDropdowns();
            // Update ARIA attributes after auto-expand
            $('#headerNavbarNav li.dropdown.active > a, #headerNavbarNav li.nav-item.dropdown.active > a').attr('aria-expanded', 'true');
        }
    }, 100);
    
    // Handle dropdown menu toggles for mobile menu
    function setupMobileDropdownHandlers() {
        // Remove existing handlers to prevent duplicates
        $('#headerNavbarNav').off('click.mobileDropdown');
        
        // Add click handlers for mobile menu dropdowns using event delegation
        // This catches all dropdown links including those loaded dynamically
        $('#headerNavbarNav').on('click.mobileDropdown', 'li.dropdown > a, li.nav-item.dropdown > a', function(e) {
            // Only handle on mobile screens
            if (window.innerWidth < 992) {
                e.preventDefault();
                e.stopPropagation();
                
                var $link = $(this);
                var $parentItem = $link.closest('li.dropdown, li.nav-item.dropdown');
                
                // Find the dropdown menu - it's a sibling <ul> with class dropdown-menu
                var $dropdownMenu = $parentItem.children('ul.dropdown-menu');
                
                // If not found, try next sibling
                if (!$dropdownMenu.length) {
                    $dropdownMenu = $parentItem.next('ul.dropdown-menu');
                }
                
                // If still not found, search within the parent
                if (!$dropdownMenu.length) {
                    $dropdownMenu = $parentItem.find('ul.dropdown-menu').first();
                }
                
                if ($dropdownMenu.length) {
                    var isExpanded = $dropdownMenu.hasClass('show');
                    
                    // Close all other dropdowns first (accordion behavior)
                    $('#headerNavbarNav ul.dropdown-menu.show').not($dropdownMenu).removeClass('show');
                    $('#headerNavbarNav li.dropdown.active, #headerNavbarNav li.nav-item.dropdown.active').not($parentItem).removeClass('active');
                    // Update ARIA attributes for closed dropdowns
                    $('#headerNavbarNav li.dropdown.active > a, #headerNavbarNav li.nav-item.dropdown.active > a').not($link).attr('aria-expanded', 'false');
                    
                    // Toggle current dropdown
                    if (isExpanded) {
                        $dropdownMenu.removeClass('show');
                        $parentItem.removeClass('active');
                        $link.attr('aria-expanded', 'false');
                    } else {
                        $dropdownMenu.addClass('show');
                        $parentItem.addClass('active');
                        $link.attr('aria-expanded', 'true');
                    }
                }
            }
        });
    }
    
    // Setup handlers on page load
    initializeAriaAttributes();
    setupMobileDropdownHandlers();
    
    // Re-setup handlers when menu is opened (in case menu content is dynamically loaded)
    $('#desktopMenuToggle').off('click.setupDropdowns').on('click.setupDropdowns', function() {
        setTimeout(function() {
            initializeAriaAttributes();
            setupMobileDropdownHandlers();
            autoExpandActiveDropdowns();
            // Update ARIA attributes after auto-expand
            $('#headerNavbarNav li.dropdown.active > a, #headerNavbarNav li.nav-item.dropdown.active > a').attr('aria-expanded', 'true');
        }, 200);
    });
    
    // Re-setup handlers when window is resized
    $(window).on('resize.setupDropdowns', function() {
        if (window.innerWidth < 992) {
            setupMobileDropdownHandlers();
            autoExpandActiveDropdowns();
        }
    });
}