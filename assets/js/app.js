/**
 * Main Application JavaScript Module
 * 
 * This module handles all interactive components of the website including:
 * - Navigation menus (desktop and mobile)
 * - Search functionality
 * - Modal popups (Advisory Board, Partners)
 * - Work packages accordions
 * - Biography toggles
 * - Hero carousel
 * - Hash-based navigation
 * 
 * @module App
 */
(function($, window, document) {
    'use strict';

    // =================================================================
    // CONFIGURATION & CONSTANTS
    // =================================================================

    /**
     * Application configuration object
     * Contains all magic numbers, breakpoints, and selectors
     */
    const CONFIG = {
        BREAKPOINTS: {
            mobile: 992
        },
        DELAYS: {
            focus: 100,
            clickClose: 100,
            menuSetup: 200,
            animation: 300
        },
        ANIMATION_SPEEDS: {
            fade: 200,
            slide: 300
        },
        SCROLL_OFFSET: 150,
        READ_MORE_TRUNCATE_LENGTH: 300,
        SELECTORS: {
            // Navigation
            menu: '#menu',
            navbarNav: '#headerNavbarNav',
            desktopMenuToggle: '#desktopMenuToggle',
            closeMobileMenu: '#closeMobileMenu',
            navbarNavWrapper: '.navbar-nav-wrapper',
            mobileActionsWrapper: '.mobile-actions-wrapper',
            navbarBottomElements: '.navbar-bottom-elements',
            
            // Search
            search: '#search',
            searchForm: '#search form',
            searchInput: '#search input.search_input',
            searchToggle: '#searchToggle',
            desktopSearchBtn: '#desktopSearchBtn',
            closeSearch: '.close-search',
            
            // Advisory Board Modal
            advisoryModal: '#advisoryBoardModal',
            advisoryModalContent: '#advisoryModalContent',
            advisoryModalClose: '#advisoryBoardModalClose',
            advisoryReadMore: '.advisory-board .read-more',
            advisoryPopupName: '.advisory-popup-name',
            
            // Partners Modal
            partnersModal: '#partnersModal',
            partnersModalContent: '#partnersModalContent',
            partnersModalClose: '#partnersModalClose',
            partnerCards: '.partner-card-clickable',
            partnersPopupName: '.partners-popup-name',
            partnersPopupContent: '.partners-popup-content',
            partnersPopupReadMore: '.partners-popup-read-more',
            partnerTeamBio: '.partner-team-bio',
            partnerTeamBioContent: '.partner-team-bio-content',

            // Video/Audio Modal
            videoModal: '#videoModal',
            videoModalClose: '.video-modal-close',
            videoModalOverlay: '.video-modal-overlay',
            videoModalTrigger: '.video-modal-trigger',
            videoFrame: '#videoFrame',

            // Work Packages
            workPackagesAccordion: '.work-packages .wp-accordion',
            accordionToggle: '.accordion-toggle',
            accordionContent: '.accordion-content',
            biographyToggle: '.work-packages .biography-toggle',
            leadBiography: '.lead-biography',
            
            // Carousel
            heroCarousel: '.hero-carousel',
            
            // General
            body: 'body',
            layoutContent: '#layout-content',
            accordionBorder: '.accordion-border',
            dropdown: '.dropdown'
        },
        EVENT_NAMESPACES: {
            search: 'searchClose searchEscape searchSubmit',
            advisory: 'advisoryPopup advisoryClose advisoryOverlay advisoryEscape',
            partners: 'partnersPopup partnersClose partnersOverlay partnersEscape',
            menu: 'menuClose setupDropdowns',
            dropdown: 'mobileDropdown',
            biography: 'bioToggle biographyToggle',
            accordion: 'wpAccordion',
            video: 'videoModal videoClose videoOverlay videoEscape'
        }
    };

    // =================================================================
    // UTILITY FUNCTIONS
    // =================================================================

    /**
     * Get current window width
     * @returns {number} Current window width in pixels
     */
    function getWindowWidth() {
        return window.innerWidth;
    }

    /**
     * Check if current viewport is mobile
     * @returns {boolean} True if viewport is mobile size
     */
    function isMobile() {
        return getWindowWidth() < CONFIG.BREAKPOINTS.mobile;
    }

    /**
     * Check if document has scroll
     * @returns {boolean} True if document height exceeds viewport height
     */
    function documentHasScroll() {
        return window.innerHeight <= document.body.offsetHeight;
    }

    /**
     * Smooth scroll to element with offset
     * @param {jQuery} $element - Element to scroll to
     * @param {number} offset - Offset from top in pixels
     * @param {number} duration - Animation duration in milliseconds
     */
    function smoothScrollTo($element, offset, duration) {
        if ($element && $element.offset()) {
            $('html, body').animate({
                scrollTop: $element.offset().top - offset
            }, duration || 500);
        }
    }

    /**
     * Animate element slide down
     * @param {jQuery} $element - Element to slide down
     * @param {number} speed - Animation speed
     * @param {Function} callback - Callback after animation
     */
    function slideDown($element, speed, callback) {
        $element.slideDown(speed || CONFIG.ANIMATION_SPEEDS.slide, callback);
    }

    /**
     * Animate element slide up
     * @param {jQuery} $element - Element to slide up
     * @param {number} speed - Animation speed
     * @param {Function} callback - Callback after animation
     */
    function slideUp($element, speed, callback) {
        $element.slideUp(speed || CONFIG.ANIMATION_SPEEDS.slide, callback);
    }

    /**
     * Set focus with optional delay and scroll prevention
     * @param {jQuery|HTMLElement} element - Element to focus
     * @param {number} delay - Delay before focusing
     * @param {boolean} preventScroll - Whether to prevent scroll on focus
     */
    function setFocus(element, delay, preventScroll) {
        const focusDelay = delay || CONFIG.DELAYS.focus;
        const shouldPreventScroll = preventScroll !== undefined ? preventScroll : false;
        
        setTimeout(function() {
            if (element && element.focus) {
                element.focus({ preventScroll: shouldPreventScroll });
            } else if (element instanceof jQuery && element.length) {
                element[0].focus({ preventScroll: shouldPreventScroll });
            }
        }, focusDelay);
    }

    // =================================================================
    // MODAL CONTROLLER
    // =================================================================

    /**
     * Generic Modal Controller
     * Manages modal open/close with focus management and ARIA attributes
     * Follows Single Responsibility and Open/Closed principles
     */
    class ModalController {
        /**
         * @param {Object} config - Modal configuration
         * @param {string} config.modalSelector - Modal container selector
         * @param {string} config.contentSelector - Modal content selector
         * @param {string} config.closeSelector - Close button selector
         * @param {string} config.triggerSelector - Elements that trigger modal
         * @param {string} config.titleSelector - Modal title selector for focus
         * @param {string} config.contentDataSelector - Pre-rendered content selector
         * @param {string} config.dataAttribute - Data attribute for content ID
         * @param {Function} config.onContentLoaded - Callback after content loaded
         */
        constructor(config) {
            this.config = config;
            this.$modal = $(config.modalSelector);
            this.$content = $(config.contentSelector);
            this.$closeBtn = $(config.closeSelector);
            this.eventNamespace = config.eventNamespace || 'modal';
        }

        /**
         * Initialize modal event handlers
         */
        init() {
            this.attachTriggerHandlers();
            this.attachCloseHandlers();
            this.attachKeyboardHandlers();
            this.attachOverlayHandler();
        }

        /**
         * Attach handlers to trigger elements
         */
        attachTriggerHandlers() {
            const self = this;
            const $triggers = $(this.config.triggerSelector);

            $triggers.off(`click.${this.eventNamespace}`).on(`click.${this.eventNamespace}`, function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.open(this);
            });

            // Keyboard accessibility for triggers
            $triggers.off(`keydown.${this.eventNamespace}`).on(`keydown.${this.eventNamespace}`, function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    $(this).trigger('click');
                }
            });
        }

        /**
         * Attach close button handler
         */
        attachCloseHandlers() {
            const self = this;
            this.$closeBtn.off(`click.${this.eventNamespace}Close`).on(`click.${this.eventNamespace}Close`, function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.close();
            });
        }

        /**
         * Attach overlay click handler
         */
        attachOverlayHandler() {
            const self = this;
            this.$modal.off(`click.${this.eventNamespace}Overlay`).on(`click.${this.eventNamespace}Overlay`, function(e) {
                if ($(e.target).is(self.$modal)) {
                    self.close();
                }
            });
        }

        /**
         * Attach keyboard handlers (Escape key)
         */
        attachKeyboardHandlers() {
            const self = this;
            $(document).off(`keydown.${this.eventNamespace}Escape`).on(`keydown.${this.eventNamespace}Escape`, function(e) {
                if (e.key === 'Escape' && self.$modal.hasClass('show')) {
                    self.close();
                }
            });
        }

        /**
         * Open modal with content
         * @param {HTMLElement} trigger - Element that triggered modal
         */
        open(trigger) {
            // Store trigger for focus restoration
            this.$modal.data('lastFocusedElement', trigger);

            // Get and load content
            const contentId = $(trigger).data(this.config.dataAttribute);
            const $content = $(this.config.contentDataSelector + '[data-' + this.config.dataAttribute + '="' + contentId + '"]');

            if ($content.length) {
                this.$content.html($content.html());

                // Call custom content loaded callback if provided
                if (this.config.onContentLoaded) {
                    this.config.onContentLoaded.call(this);
                }

                this.show();
            }
        }

        /**
         * Show modal (handle display and ARIA)
         */
        show() {
            this.$modal.addClass('show');
            this.$modal.attr('aria-hidden', 'false');
            $(CONFIG.SELECTORS.body).css('overflow', 'hidden');

            // Set focus to modal title
            const $title = this.$modal.find(this.config.titleSelector);
            if ($title.length) {
                setFocus($title[0], CONFIG.DELAYS.focus, false);
            }
        }

        /**
         * Close modal
         */
        close() {
            const lastFocusedElement = this.$modal.data('lastFocusedElement');

            this.$modal.removeClass('show');
            this.$modal.attr('aria-hidden', 'true');
            $(CONFIG.SELECTORS.body).css('overflow', '');

            // Restore focus to trigger element
            if (lastFocusedElement) {
                setFocus(lastFocusedElement, CONFIG.DELAYS.focus, true);
            }
        }

        /**
         * Destroy modal and remove all event handlers
         */
        destroy() {
            $(this.config.triggerSelector).off(`.${this.eventNamespace}`);
            this.$closeBtn.off(`.${this.eventNamespace}Close`);
            this.$modal.off(`.${this.eventNamespace}Overlay`);
            $(document).off(`.${this.eventNamespace}Escape`);
        }
    }

    // =================================================================
    // SEARCH FUNCTIONALITY
    // =================================================================

    /**
     * Show search form overlay
     * Public API - exposed globally
     */
    function showSearchForm() {
        const $search = $(CONFIG.SELECTORS.search);
        const $searchForm = $(CONFIG.SELECTORS.searchForm);
        const $searchInput = $(CONFIG.SELECTORS.searchInput);

        $search.fadeIn(CONFIG.ANIMATION_SPEEDS.fade);
        $searchForm.addClass('pop-in');
        $searchInput.val('').focus();
        $(CONFIG.SELECTORS.body).addClass('search-open').css('overflow', 'hidden');

        attachSearchEventHandlers();
    }

    /**
     * Hide search form overlay
     * Public API - exposed globally
     */
    function hideSearchForm() {
        const $search = $(CONFIG.SELECTORS.search);
        const $searchForm = $(CONFIG.SELECTORS.searchForm);

        $searchForm.removeClass('pop-in');
        $search.fadeOut(CONFIG.ANIMATION_SPEEDS.fade);
        $(CONFIG.SELECTORS.body).removeClass('search-open').css('overflow', '');

        removeSearchEventHandlers();
    }

    /**
     * Attach search-specific event handlers
     * @private
     */
    function attachSearchEventHandlers() {
        // Delay to prevent immediate closure
        setTimeout(function() {
            $(document).on('click.searchClose', handleSearchOutsideClick);
        }, CONFIG.DELAYS.clickClose);

        $(document).on('keydown.searchEscape', handleSearchEscapeKey);
        $(CONFIG.SELECTORS.searchInput).on('keydown.searchSubmit', handleSearchEnterKey);
    }

    /**
     * Remove search event handlers
     * @private
     */
    function removeSearchEventHandlers() {
        $(document).off('click.searchClose');
        $(document).off('keydown.searchEscape');
        $(CONFIG.SELECTORS.searchInput).off('keydown.searchSubmit');
    }

    /**
     * Handle click outside search form
     * @private
     */
    function handleSearchOutsideClick(event) {
        const $search = $(CONFIG.SELECTORS.searchForm);
        const $searchToggle = $(CONFIG.SELECTORS.searchToggle);
        const $desktopSearchBtn = $(CONFIG.SELECTORS.desktopSearchBtn);

        if (!$search.is(event.target) && 
            $search.has(event.target).length === 0 && 
            !$searchToggle.is(event.target) && 
            $searchToggle.has(event.target).length === 0 &&
            !$desktopSearchBtn.is(event.target) && 
            $desktopSearchBtn.has(event.target).length === 0 &&
            !$(event.target).closest(CONFIG.SELECTORS.closeSearch).length) {
            hideSearchForm();
        }
    }

    /**
     * Handle Escape key in search
     * @private
     */
    function handleSearchEscapeKey(e) {
        if (e.key === 'Escape') {
            hideSearchForm();
        }
    }

    /**
     * Handle Enter key in search
     * @private
     */
    function handleSearchEnterKey(e) {
        if (e.key === 'Enter') {
            $(CONFIG.SELECTORS.searchForm).submit();
        }
    }

    /**
     * Initialize search functionality
     * @private
     */
    function initSearch() {
        $(CONFIG.SELECTORS.searchToggle).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showSearchForm();
        });

        $(CONFIG.SELECTORS.desktopSearchBtn).on('click', function(e) {
            e.preventDefault();
            showSearchForm();
        });
    }

    // =================================================================
    // ADVISORY BOARD POPUP
    // =================================================================

    let advisoryBoardModal;

    /**
     * Initialize Advisory Board popup functionality
     * Public API - exposed globally
     */
    function initAdvisoryBoardPopup() {
        advisoryBoardModal = new ModalController({
            modalSelector: CONFIG.SELECTORS.advisoryModal,
            contentSelector: CONFIG.SELECTORS.advisoryModalContent,
            closeSelector: CONFIG.SELECTORS.advisoryModalClose,
            triggerSelector: CONFIG.SELECTORS.advisoryReadMore,
            titleSelector: CONFIG.SELECTORS.advisoryPopupName,
            contentDataSelector: '.profile-content',
            dataAttribute: 'profile-id',
            eventNamespace: 'advisory'
        });

        advisoryBoardModal.init();
    }

    // =================================================================
    // PARTNERS POPUP
    // =================================================================

    let partnersModal;

    /**
     * Initialize Partners popup functionality
     * Public API - exposed globally
     */
    function initPartnersPopup() {
        partnersModal = new ModalController({
            modalSelector: CONFIG.SELECTORS.partnersModal,
            contentSelector: CONFIG.SELECTORS.partnersModalContent,
            closeSelector: CONFIG.SELECTORS.partnersModalClose,
            triggerSelector: CONFIG.SELECTORS.partnerCards,
            titleSelector: CONFIG.SELECTORS.partnersPopupName,
            contentDataSelector: '.partner-content',
            dataAttribute: 'partner-id',
            eventNamespace: 'partners',
            onContentLoaded: function() {
                initPartnersReadMore();
                initPartnersBiographyToggle();
            }
        });

        partnersModal.init();
    }

    /**
     * Initialize read more toggle for Partners popup content
     * @private
     */
    function initPartnersReadMore() {
        const $content = $(CONFIG.SELECTORS.partnersModalContent + ' ' + CONFIG.SELECTORS.partnersPopupContent);
        const $readMore = $(CONFIG.SELECTORS.partnersModalContent + ' ' + CONFIG.SELECTORS.partnersPopupReadMore);

        if (!$readMore.length) return;

        const fullText = $content.text().trim();
        const maxLength = CONFIG.READ_MORE_TRUNCATE_LENGTH;

        // Only show read more if text is longer than max length
        if (fullText.length <= maxLength) {
            $readMore.hide();
            return;
        }

        const truncatedText = fullText.substring(0, maxLength) + '...';

        // Initially show truncated text
        $content.text(truncatedText);
        $content.data('full-text', fullText);
        $content.data('expanded', false);
        $readMore.show();

        // Toggle on click
        $readMore.off('click').on('click', function(e) {
            e.preventDefault();
            toggleReadMore($content, truncatedText, fullText, $(this));
        });
    }

    /**
     * Toggle read more/less content
     * @private
     */
    function toggleReadMore($content, truncatedText, fullText, $button) {
        const isExpanded = $content.data('expanded');
        const $icon = $button.find('.read-more-icon');

        if (isExpanded) {
            // Collapse
            $content.text(truncatedText);
            $content.data('expanded', false);
            updateButtonText($button, 'Read more ');
            $icon.css('transform', 'rotate(0deg)');
        } else {
            // Expand
            $content.text(fullText);
            $content.data('expanded', true);
            updateButtonText($button, 'Read less ');
            $icon.css('transform', 'rotate(180deg)');
        }
    }

    /**
     * Update button text while preserving icon
     * @private
     */
    function updateButtonText($button, newText) {
        $button.contents().filter(function() {
            return this.nodeType === 3; // Text node
        }).first().replaceWith(newText);
    }

    /**
     * Initialize biography toggle for team members in Partners popup
     * @private
     */
    function initPartnersBiographyToggle() {
        const $bioLinks = $(CONFIG.SELECTORS.partnersModalContent + ' ' + CONFIG.SELECTORS.partnerTeamBio);

        $bioLinks.off('click.biographyToggle');

        $bioLinks.on('click.biographyToggle', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $link = $(this);
            const $teamInfo = $link.closest('.partner-team-info');
            const $bioContent = $teamInfo.find(CONFIG.SELECTORS.partnerTeamBioContent);
            const $icon = $link.find('.bio-icon');

            if ($bioContent.length === 0) return;

            toggleBiography($bioContent, $link, $icon);
        });
    }

    /**
     * Toggle biography content visibility
     * @private
     */
    function toggleBiography($bioContent, $link, $icon) {
        if ($bioContent.is(':visible')) {
            slideUp($bioContent, CONFIG.ANIMATION_SPEEDS.slide);
            updateButtonText($link, 'Biography ');
            $icon.css('transform', 'rotate(0deg)');
        } else {
            slideDown($bioContent, CONFIG.ANIMATION_SPEEDS.slide);
            updateButtonText($link, 'Hide Biography ');
            $icon.css('transform', 'rotate(180deg)');
        }
    }

    // =================================================================
    // VIDEO/AUDIO MODAL
    // =================================================================

    /**
     * Initialize Video/Audio Modal functionality
     * Handles both YouTube/Vimeo videos and podcast audio embeds
     * Public API - exposed globally
     */
    function initVideoModal() {
        const $modal = $(CONFIG.SELECTORS.videoModal);
        const $videoFrame = $(CONFIG.SELECTORS.videoFrame);
        const $closeBtn = $(CONFIG.SELECTORS.videoModalClose);
        const $overlay = $(CONFIG.SELECTORS.videoModalOverlay);
        const $triggers = $(CONFIG.SELECTORS.videoModalTrigger);

        if (!$modal.length || !$triggers.length) return;

        /**
         * Open video modal with iframe URL
         * @private
         */
        function openModal(trigger) {
            // Store trigger for focus restoration
            $modal.data('lastFocusedElement', trigger);

            const videoUrl = $(trigger).data('video-url');
            const videoTitle = $(trigger).data('video-title') || 'Video';

            if (!videoUrl) return;

            // Set iframe src and show modal
            $videoFrame.attr('src', videoUrl);
            $modal.addClass('show').attr('aria-hidden', 'false');
            $(CONFIG.SELECTORS.body).css('overflow', 'hidden');

            // Set focus to close button for accessibility
            setFocus($closeBtn[0], CONFIG.DELAYS.focus, false);
        }

        /**
         * Close video modal
         * @private
         */
        function closeModal() {
            const lastFocusedElement = $modal.data('lastFocusedElement');

            // Clear iframe src to stop playback
            $videoFrame.attr('src', '');
            $modal.removeClass('show').attr('aria-hidden', 'true');
            $(CONFIG.SELECTORS.body).css('overflow', '');

            // Restore focus to trigger element
            if (lastFocusedElement) {
                setFocus(lastFocusedElement, CONFIG.DELAYS.focus, true);
            }
        }

        // Attach event handlers with namespaced events
        $triggers.off('click.videoModal').on('click.videoModal', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal(this);
        });

        $closeBtn.off('click.videoClose').on('click.videoClose', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });

        $overlay.off('click.videoOverlay').on('click.videoOverlay', function(e) {
            if ($(e.target).is($overlay)) {
                closeModal();
            }
        });

        $(document).off('keydown.videoEscape').on('keydown.videoEscape', function(e) {
            if (e.key === 'Escape' && $modal.hasClass('show')) {
                closeModal();
            }
        });
    }

    // =================================================================
    // WORK PACKAGES ACCORDION
    // =================================================================

    /**
     * Initialize Work Packages Accordion functionality
     * Public API - exposed globally
     */
    function initWorkPackagesAccordion() {
        const $accordions = $(CONFIG.SELECTORS.workPackagesAccordion + ' ' + CONFIG.SELECTORS.accordionToggle);
        
        $accordions.off('click.wpAccordion');

        $accordions.on('click.wpAccordion', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $accordion = $(this).closest('.wp-accordion');
            const $content = $accordion.find(CONFIG.SELECTORS.accordionContent);
            const isActive = $accordion.hasClass('active');

            if (isActive) {
                slideUp($content, CONFIG.ANIMATION_SPEEDS.slide);
                $accordion.removeClass('active');
            } else {
                slideDown($content, CONFIG.ANIMATION_SPEEDS.slide);
                $accordion.addClass('active');
            }
        });
    }

    /**
     * Initialize Biography Toggle functionality
     * Public API - exposed globally
     */
    function initBiographyToggle() {
        const $toggles = $(CONFIG.SELECTORS.biographyToggle);
        
        $toggles.off('click.bioToggle');

        $toggles.on('click.bioToggle', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const $button = $(this);
            const $leadSection = $button.closest('.wp-lead-section');
            const $biography = $leadSection.find(CONFIG.SELECTORS.leadBiography);
            const $bioText = $button.find('.bio-text');
            const isActive = $button.hasClass('active');

            if (isActive) {
                slideUp($biography, CONFIG.ANIMATION_SPEEDS.slide);
                $button.removeClass('active');
                $bioText.text('Biography');
            } else {
                slideDown($biography, CONFIG.ANIMATION_SPEEDS.slide);
                $button.addClass('active');
                $bioText.text('Hide Biography');
            }
        });
    }

    // =================================================================
    // HAMBURGER MENU & DROPDOWNS
    // =================================================================

    /**
     * Auto-expand dropdowns that contain the current active page
     * @private
     */
    function autoExpandActiveDropdowns() {
        const $mobileMenu = $(CONFIG.SELECTORS.navbarNav);
        const $activeSubItems = $mobileMenu.find('ul.dropdown-menu li.active, ul.dropdown-menu .nav-item.active');

        $activeSubItems.each(function() {
            const $parentDropdown = $(this).closest('li.dropdown, li.nav-item.dropdown');
            if (!$parentDropdown.length) return;

            let $dropdownMenu = $parentDropdown.children('ul.dropdown-menu');
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentDropdown.next('ul.dropdown-menu');
            }
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentDropdown.find('ul.dropdown-menu').first();
            }

            if ($dropdownMenu.length) {
                $parentDropdown.addClass('active');
                $dropdownMenu.addClass('show');
                $parentDropdown.find('> a').attr('aria-expanded', 'true');
            }
        });
    }

    /**
     * Initialize ARIA attributes for dropdowns
     * @private
     */
    function initializeDropdownAriaAttributes() {
        const $dropdownLinks = $(CONFIG.SELECTORS.navbarNav + ' li.dropdown > a, ' + 
                                 CONFIG.SELECTORS.navbarNav + ' li.nav-item.dropdown > a');

        $dropdownLinks.each(function() {
            const $link = $(this);
            const $parentItem = $link.closest('li.dropdown, li.nav-item.dropdown');

            let $dropdownMenu = $parentItem.children('ul.dropdown-menu');
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentItem.next('ul.dropdown-menu');
            }
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentItem.find('ul.dropdown-menu').first();
            }

            if ($dropdownMenu.length) {
                if (!$link.attr('aria-expanded')) {
                    $link.attr('aria-expanded', 'false');
                }
                $link.attr('aria-haspopup', 'true');
                $dropdownMenu.attr('role', 'menu');
            }
        });
    }

    /**
     * Setup mobile dropdown click handlers
     * @private
     */
    function setupMobileDropdownHandlers() {
        $(CONFIG.SELECTORS.navbarNav).off('click.mobileDropdown');

        $(CONFIG.SELECTORS.navbarNav).on('click.mobileDropdown', 'li.dropdown > a, li.nav-item.dropdown > a', function(e) {
            if (!isMobile()) return;

            e.preventDefault();
            e.stopPropagation();

            const $link = $(this);
            const $parentItem = $link.closest('li.dropdown, li.nav-item.dropdown');

            let $dropdownMenu = $parentItem.children('ul.dropdown-menu');
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentItem.next('ul.dropdown-menu');
            }
            if (!$dropdownMenu.length) {
                $dropdownMenu = $parentItem.find('ul.dropdown-menu').first();
            }

            if (!$dropdownMenu.length) return;

            const isExpanded = $dropdownMenu.hasClass('show');

            // Close all other dropdowns (accordion behavior)
            $(CONFIG.SELECTORS.navbarNav + ' ul.dropdown-menu.show').not($dropdownMenu).removeClass('show');
            $(CONFIG.SELECTORS.navbarNav + ' li.dropdown.active, ' + 
              CONFIG.SELECTORS.navbarNav + ' li.nav-item.dropdown.active').not($parentItem).removeClass('active');
            $(CONFIG.SELECTORS.navbarNav + ' li.dropdown > a, ' + 
              CONFIG.SELECTORS.navbarNav + ' li.nav-item.dropdown > a').not($link).attr('aria-expanded', 'false');

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
        });
    }

    /**
     * Initialize hamburger menu dropdown functionality
     * Public API - exposed globally
     */
    function initHamburgerMenuDropdowns() {
        // Initial setup
        setTimeout(function() {
            if (isMobile()) {
                initializeDropdownAriaAttributes();
                autoExpandActiveDropdowns();
                $(CONFIG.SELECTORS.navbarNav + ' li.dropdown.active > a, ' + 
                  CONFIG.SELECTORS.navbarNav + ' li.nav-item.dropdown.active > a').attr('aria-expanded', 'true');
            }
        }, CONFIG.DELAYS.focus);

        initializeDropdownAriaAttributes();
        setupMobileDropdownHandlers();

        // Re-setup when menu is opened
        $(CONFIG.SELECTORS.desktopMenuToggle).off('click.setupDropdowns').on('click.setupDropdowns', function() {
            setTimeout(function() {
                initializeDropdownAriaAttributes();
                setupMobileDropdownHandlers();
                autoExpandActiveDropdowns();
                $(CONFIG.SELECTORS.navbarNav + ' li.dropdown.active > a, ' + 
                  CONFIG.SELECTORS.navbarNav + ' li.nav-item.dropdown.active > a').attr('aria-expanded', 'true');
            }, CONFIG.DELAYS.menuSetup);
        });

        // Re-setup on window resize
        $(window).on('resize.setupDropdowns', function() {
            if (isMobile()) {
                setupMobileDropdownHandlers();
                autoExpandActiveDropdowns();
            }
        });
    }

    // =================================================================
    // NAVIGATION & MENU
    // =================================================================

    /**
     * Initialize mobile menu functionality
     * @private
     */
    function initMobileMenu() {
        let isDesktop = !isMobile();

        // Open mobile menu
        $(CONFIG.SELECTORS.desktopMenuToggle).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            $(CONFIG.SELECTORS.navbarNav).addClass('show');
            $(CONFIG.SELECTORS.desktopMenuToggle).addClass('active');
            $(CONFIG.SELECTORS.desktopMenuToggle).attr('aria-expanded', 'true');
            $(CONFIG.SELECTORS.body).addClass('menu-open');
        });

        // Close mobile menu with X button
        $(CONFIG.SELECTORS.closeMobileMenu).on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });

        // Close mobile menu when clicking outside
        $(document).on('click.menuClose', function(event) {
            const $navbarNav = $(CONFIG.SELECTORS.navbarNav);
            const $desktopToggle = $(CONFIG.SELECTORS.desktopMenuToggle);
            const $actionsWrapper = $(CONFIG.SELECTORS.mobileActionsWrapper);

            if ($navbarNav.hasClass('show') &&
                !$navbarNav.is(event.target) &&
                $navbarNav.has(event.target).length === 0 &&
                !$desktopToggle.is(event.target) &&
                $desktopToggle.has(event.target).length === 0 &&
                !$actionsWrapper.is(event.target) &&
                $actionsWrapper.has(event.target).length === 0) {
                closeMobileMenu();
            }
        });

        // Prevent clicks inside menu from closing it
        $(CONFIG.SELECTORS.navbarNav).on('click', function(e) {
            e.stopPropagation();
        });

        // Prevent clicks on bottom elements from closing the menu
        $(CONFIG.SELECTORS.navbarBottomElements).on('click', function(e) {
            e.stopPropagation();
        });

        // Handle window resize
        $(window).on('resize', function() {
            const nowDesktop = !isMobile();

            // If switched from mobile to desktop, close mobile menu
            if (!isDesktop && nowDesktop) {
                closeMobileMenu();
            }

            isDesktop = nowDesktop;
        });
    }

    /**
     * Close mobile menu
     * @private
     */
    function closeMobileMenu() {
        $(CONFIG.SELECTORS.navbarNav).removeClass('show');
        $(CONFIG.SELECTORS.desktopMenuToggle).removeClass('active');
        $(CONFIG.SELECTORS.desktopMenuToggle).attr('aria-expanded', 'false');
        $(CONFIG.SELECTORS.body).removeClass('menu-open');
    }

    /**
     * Initialize desktop navigation hover effects
     * @private
     */
    function initDesktopNavigation() {
        // Wrap nav-item text in span for roulette animation (desktop only)
        if (!isMobile()) {
            $(CONFIG.SELECTORS.navbarNavWrapper + ' .nav-item > a').each(function() {
                const $link = $(this);
                const text = $link.text().trim();

                // Don't wrap if it already contains spans
                if (!$link.find('.nav-text').length && text) {
                    $link.html(
                        '<span class="nav-text-wrapper">' +
                            '<span class="nav-text nav-text-1">' + text + '</span>' +
                            '<span class="nav-text nav-text-2">' + text + '</span>' +
                        '</span>'
                    );
                }
            });
        }
    }

    // =================================================================
    // CAROUSEL
    // =================================================================

    /**
     * Initialize hero carousel
     * @private
     */
    function initHeroCarousel() {
        const $carousel = $(CONFIG.SELECTORS.heroCarousel);
        
        if (!$carousel.length) return;

        $carousel.slick({
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
                    breakpoint: CONFIG.BREAKPOINTS.mobile,
                    settings: {
                        autoplaySpeed: 4000,
                        speed: 800
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        autoplaySpeed: 4000,
                        speed: 800
                    }
                }
            ]
        });
    }

    // =================================================================
    // HASH NAVIGATION
    // =================================================================

    /**
     * Handle hash-based navigation on page load
     * @private
     */
    function handleHashNavigation() {
        if (!window.location.hash) return;

        const link = window.location.hash;
        const anchorId = link.substr(link.indexOf("#") + 1);
        const $target = $("#" + anchorId);

        if ($target.offset()) {
            smoothScrollTo($target, CONFIG.SCROLL_OFFSET, 500);
        } else {
            // Try to find in accordion titles
            $(CONFIG.SELECTORS.accordionBorder).each(function() {
                const $accordion = $(this);
                const title = $accordion.find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                const $toggler = $accordion.find(".accordion-toggle");

                if (title.indexOf(anchorId.toUpperCase()) >= 0 && !$toggler.next(".accordion-content").is(':visible')) {
                    smoothScrollTo($toggler.parent(), CONFIG.SCROLL_OFFSET, 500);
                    $toggler.trigger("click");
                }
            });
        }
    }

    /**
     * Handle dropdown anchor clicks
     * @private
     */
    function handleDropdownAnchors() {
        $(CONFIG.SELECTORS.dropdown + ' a').click(function(event) {
            if (location.href.indexOf("#") === -1) return;

            const link = $(this).attr('href');
            const anchorId = link.substr(link.indexOf("#") + 1);
            const $target = $("#" + anchorId);

            if ($target.length > 0) {
                smoothScrollTo($target, CONFIG.SCROLL_OFFSET, 500);
            } else {
                // Highlight SVG path if exists
                $("g[title='" + anchorId.toUpperCase() + "']").addClass('active_path');

                // Try to find in accordion titles
                $(CONFIG.SELECTORS.accordionBorder).each(function() {
                    const $accordion = $(this);
                    const title = $accordion.find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                    const $toggler = $accordion.find(".accordion-toggle");

                    if (title.indexOf(anchorId.toUpperCase()) >= 0 && !$toggler.next(".accordion-content").is(':visible')) {
                        smoothScrollTo($toggler.parent(), CONFIG.SCROLL_OFFSET, 500);
                        $toggler.trigger("click");
                        event.preventDefault();
                    }
                });
            }
        });
    }

    // =================================================================
    // OBJECTIVE CARD ANIMATIONS
    // =================================================================

    /**
     * Initialize AOS animations for objective cards
     * Adds data-aos attributes dynamically with staggered delays
     * Public API - exposed globally
     */
    function initObjectiveCardAnimations() {
        const $objectiveCards = $('.objective-card');

        if (!$objectiveCards.length) return;

        // Add AOS attributes to each card with staggered delay
        $objectiveCards.each(function(index) {
            const delay = index * 100; // 100ms delay between each card

            $(this).attr({
                'data-aos': 'fade-up',
                'data-aos-duration': '600',
                'data-aos-delay': delay.toString(),
                'data-aos-once': 'true' // Animate only once
            });
        });

        // Refresh AOS to apply new attributes
        if (typeof AOS !== 'undefined' && AOS.refresh) {
            AOS.refresh();
        }
    }

    // =================================================================
    // BUBBLE ANIMATIONS
    // =================================================================

    /**
     * Initialize bubble pop-up animations on scroll
     * Uses Intersection Observer to trigger animations when bubbles come into view
     * Public API - exposed globally
     */
    function initBubbleAnimations() {
        const $missionImage = $('.mission-image');
        if (!$missionImage.length) return;

        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: animate immediately if Intersection Observer not supported
            $missionImage.find('.bubble-image').addClass('animate');
            return;
        }

        // Create Intersection Observer with enhanced visibility detection
        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -50px 0px', // Buffer zone to ensure element is well into viewport
            threshold: 0.5 // Trigger when 50% of the element is visible (increased from 20%)
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const $container = $(entry.target);
                    const $bubbles = $container.find('.bubble-image');

                    // Add animate class to all bubbles - CSS animation-delay will handle staggering
                    $bubbles.addClass('animate');

                    // Stop observing after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Delay observer initialization to ensure page layout is stable
        setTimeout(function() {
            observer.observe($missionImage[0]);
        }, 100);
    }

    // =================================================================
    // DOWNLOAD DROPDOWNS
    // =================================================================

    /**
     * Initialize download dropdown functionality for Media Center pages
     * Handles click-based toggle with accordion behavior and outside-click-to-close
     * Public API - exposed globally
     */
    function initDownloadDropdowns() {
        const $dropdowns = $('.download-dropdown');

        if (!$dropdowns.length) return;

        /**
         * Close all dropdowns
         * @private
         */
        function closeAllDropdowns() {
            $dropdowns.removeClass('active');
        }

        /**
         * Toggle dropdown on button click
         * @private
         */
        function handleDropdownToggle(e) {
            e.preventDefault();
            e.stopPropagation();

            const $button = $(this);
            const $dropdown = $button.closest('.download-dropdown');
            const isActive = $dropdown.hasClass('active');

            // Close all other dropdowns (accordion behavior)
            closeAllDropdowns();

            // Toggle current dropdown
            if (!isActive) {
                $dropdown.addClass('active');
            }
        }

        /**
         * Close dropdown when clicking outside
         * @private
         */
        function handleOutsideClick(e) {
            const $target = $(e.target);

            // Check if click is outside all dropdowns
            if (!$target.closest('.download-dropdown').length) {
                closeAllDropdowns();
            }
        }

        /**
         * Close dropdown on Escape key
         * @private
         */
        function handleEscapeKey(e) {
            if (e.key === 'Escape') {
                closeAllDropdowns();
            }
        }

        /**
         * Close dropdown after selecting a download option
         * @private
         */
        function handleDownloadSelect() {
            // Close dropdown after a short delay to allow download to start
            setTimeout(closeAllDropdowns, 100);
        }

        // Attach event handlers
        $('.btn-download-toggle').off('click.downloadDropdown').on('click.downloadDropdown', handleDropdownToggle);
        $('.download-option').off('click.downloadOption').on('click.downloadOption', handleDownloadSelect);

        // Delay outside click handler to prevent immediate closure
        setTimeout(function() {
            $(document).off('click.downloadDropdown').on('click.downloadDropdown', handleOutsideClick);
        }, CONFIG.DELAYS.clickClose);

        $(document).off('keydown.downloadDropdown').on('keydown.downloadDropdown', handleEscapeKey);
    }

    // =================================================================
    // LIBRARY FILTERING & SEARCH
    // =================================================================

    /**
     * Initialize Library filtering, search, and pagination functionality
     * Public API - exposed globally
     */
    function initLibraryFilters() {
        const $container = $('.library-page');
        if (!$container.length) return;

        // State management object
        const state = {
            page: 1,
            perPage: 15,
            type: '0',
            sort: 'year desc'  // Fixed default sort
        };

        let isLoading = false;

        /**
         * Show loading state
         * @private
         */
        function showLoading() {
            isLoading = true;
            $container.addClass('loading');
            // Add opacity to results while loading
            $('.library-item').css('opacity', '0.5');
        }

        /**
         * Hide loading state
         * @private
         */
        function hideLoading() {
            isLoading = false;
            $container.removeClass('loading');
            $('.library-item').css('opacity', '1');
        }

        /**
         * Fetch records via AJAX and update DOM
         * @private
         */
        function fetchAndRender() {
            if (isLoading) return;

            const $recordsContainer = $('#recordsContainer');

            // Fade out current results
            $recordsContainer.css('opacity', '0');
            showLoading();

            $.ajax({
                url: window.location.href,
                type: 'POST',
                dataType: 'json',
                data: $.param({
                    ...state,
                    _handler: 'onFilter'
                }),
                headers: {
                    'X-OCTOBER-REQUEST-HANDLER': 'LibraryHandler::onFilter',
                    'X-OCTOBER-REQUEST-PARTIALS': '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                success: function(response) {
                    hideLoading();

                    // Inject the HTML from response
                    if (response.html) {
                        $recordsContainer.html(response.html);
                    }

                    // Inject pagination if provided
                    if (response.pagination) {
                        $('#libPagination').html(response.pagination);
                    }

                    // Fade in new results
                    $recordsContainer.animate({ opacity: 1 }, CONFIG.ANIMATION_SPEEDS.slide);

                    // Attach pagination handlers
                    attachPaginationHandlers();

                    // Scroll to top
                    smoothScrollTo($container, CONFIG.SCROLL_OFFSET, CONFIG.ANIMATION_SPEEDS.slide);
                },
                error: function(xhr, textStatus, errorThrown) {
                    hideLoading();
                    console.error('Library filter error:', textStatus, errorThrown);
                    console.error('Response:', xhr.responseText);

                    $recordsContainer.html(
                        '<div class="no-records error-message">' +
                        'Sorry, there was an error loading the library. Please try again.' +
                        '</div>'
                    ).css('opacity', '1');
                }
            });
        }

        /**
         * Attach click handlers to pagination links
         * @private
         */
        function attachPaginationHandlers() {
            $('.library-pagination a').off('click.libPagination').on('click.libPagination', function(e) {
                e.preventDefault();

                const href = $(this).attr('href');
                const match = href ? href.match(/page=(\d+)/) : null;

                if (match && match[1]) {
                    state.page = parseInt(match[1], 10);
                    fetchAndRender();
                }
            });
        }

        /**
         * Handle tab click (horizontal tabs)
         * @private
         */
        function handleTabChange(e) {
            e.preventDefault();

            const $tab = $(e.currentTarget);
            const value = $tab.data('type').toString();

            // Remove active class and aria-selected from all tabs
            $('.lib-tab').removeClass('active').attr('aria-selected', 'false');

            // Add active class and aria-selected to clicked tab
            $tab.addClass('active').attr('aria-selected', 'true');

            // Update state
            state.type = value;
            state.page = 1;

            fetchAndRender();
        }

        // =================================================================
        // EVENT LISTENERS
        // =================================================================

        // Tab navigation
        $('.lib-tab').off('click.libTab').on('click.libTab', handleTabChange);

        // Attach pagination handlers for initial page load
        attachPaginationHandlers();
    }

    /**
     * Force external links in certain sections to open in new tab
     * @private
     */
    function forceExternalLinks() {
        $('.work_packages .accordion-content, .messages .accordion-toggle').each(function(index, value) {
            $(value).find('a').attr("onclick", "window.open(this.href, '_blank');");
        });
    }

    // =================================================================
    // PUBLIC UTILITY FUNCTIONS (Exposed globally for backward compatibility)
    // =================================================================

    /**
     * Check if breakpoint is large (mobile)
     * Public API - exposed globally
     * @returns {boolean} True if viewport is mobile size
     */
    function isBreakpointLarge() {
        return isMobile();
    }

    /**
     * Scroll down to main content
     * Public API - exposed globally
     */
    function scrollDown() {
        const $element = $(CONFIG.SELECTORS.layoutContent);
        smoothScrollTo($element, 190, 500);
    }

    // =================================================================
    // INITIALIZATION
    // =================================================================

    /**
     * Main initialization function
     * Runs when DOM is ready
     */
    function init() {
        // Set menu ID for compatibility
        $('.navbar-nav').attr('id', CONFIG.SELECTORS.menu.substring(1));

        // Clean up data-toggle attributes to prevent Bootstrap interference
        $(CONFIG.SELECTORS.navbarNav + ' .nav-item > a[data-toggle="dropdown"], ' +
          CONFIG.SELECTORS.navbarNav + ' .dropdown > a[data-toggle="dropdown"]').removeAttr('data-toggle');

        // Remove transition class after page load
        $("nav").removeClass("no-transition");

        // Remove conflicting ID from nav-pills
        $('.nav.nav-pills').removeAttr('id');

        // Initialize all modules
        initHamburgerMenuDropdowns();
        initAdvisoryBoardPopup();
        initPartnersPopup();
        initWorkPackagesAccordion();
        initBiographyToggle();
        initDesktopNavigation();
        initSearch();
        initMobileMenu();
        initHeroCarousel();
        initLibraryFilters();
        initDownloadDropdowns();
        initObjectiveCardAnimations();
        initBubbleAnimations();
        initVideoModal();
        handleHashNavigation();
        handleDropdownAnchors();
        forceExternalLinks();
    }

    // =================================================================
    // DOCUMENT READY
    // =================================================================

    $(document).ready(init);

    // =================================================================
    // EXPOSE PUBLIC API
    // =================================================================

    // Expose functions globally for backward compatibility
    window.showSearchForm = showSearchForm;
    window.hideSearchForm = hideSearchForm;
    window.initAdvisoryBoardPopup = initAdvisoryBoardPopup;
    window.initPartnersPopup = initPartnersPopup;
    window.initWorkPackagesAccordion = initWorkPackagesAccordion;
    window.initBiographyToggle = initBiographyToggle;
    window.initHamburgerMenuDropdowns = initHamburgerMenuDropdowns;
    window.initLibraryFilters = initLibraryFilters;
    window.initDownloadDropdowns = initDownloadDropdowns;
    window.initObjectiveCardAnimations = initObjectiveCardAnimations;
    window.initBubbleAnimations = initBubbleAnimations;
    window.initVideoModal = initVideoModal;
    window.documentHasScroll = documentHasScroll;
    window.isBreakpointLarge = isBreakpointLarge;
    window.scrollDown = scrollDown;

})(jQuery, window, document);
