/*
 * Template functions file.
 *
 */
jQuery( function() { "use strict";

	var screen_has_mouse = false,
		$body = jQuery( "body" ),
		$top_nav = jQuery( "#top .navbar" ),
		$featured = jQuery( "#featured" ),
		$featured_media = jQuery( "#featured-media" );

	// Simple way of determining if user is using a mouse device.
	function themeMouseMove() {
		screen_has_mouse = true;
	}
	function themeTouchStart() {
		jQuery( window ).off( "mousemove.anii" );
		screen_has_mouse = false;
		setTimeout(function() {
			jQuery( window ).on( "mousemove.anii", themeMouseMove );
		}, 250);
	}
	if ( ! navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) {
		jQuery( window ).on( "touchstart.anii", themeTouchStart ).on( "mousemove.anii", themeMouseMove );
		if ( window.navigator.msPointerEnabled ) {
			document.addEventListener( "MSPointerDown", themeTouchStart, false );
		}
	}

	// Handle both mouse hover and touch events for traditional menu + mobile hamburger.
	jQuery( "#top .site-menu-toggle a" ).on( "click.anii", function( e ) {
		$body.toggleClass( "mobile-menu-opened" );
		e.stopPropagation();
		e.preventDefault();
	});

	jQuery( "#site-menu .menu-expand" ).on( "click.anii", function ( e ) {
		var $parent = jQuery( this ).parent();
		if ( jQuery( ".site-menu-toggle" ).is( ":visible" ) ) {
			$parent.toggleClass( "collapse" );
		}
		e.preventDefault();
	});
	jQuery( "#site-menu .current-menu-parent" ).addClass( "collapse" );

	jQuery( document ).on({
		mouseenter: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).addClass( "hover" );
			}
		},
		mouseleave: function() {
			if ( screen_has_mouse ) {
				jQuery( this ).removeClass( "hover" );
			}
		}
	}, "#site-menu li" );

	if ( jQuery( "html" ).hasClass( "touchevents" ) ) {
		jQuery( "#site-menu li.menu-item-has-children > a:not(.menu-expand)" ).on( "click.anii", function (e) {
			if ( ! screen_has_mouse && ! window.navigator.msPointerEnabled && ! jQuery( ".site-menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( "#site-menu li.menu-item-has-children" ).not( $parent ).removeClass( "hover" );
				}
				$parent.toggleClass( "hover" );
				e.preventDefault();
			}
		});
	} else {
		// Toggle visibility of dropdowns on keyboard focus events.
		jQuery( "#site-menu li > a:not(.menu-expand), #top .site-title a, #social-links-menu a:first" ).on( "focus.anii blur.anii", function(e) {
			if ( screen_has_mouse && ! jQuery( "#top .site-menu-toggle" ).is( ":visible" ) ) {
				var $parent = jQuery( this ).parent();
				if ( ! $parent.parents( ".hover" ).length ) {
					jQuery( "#site-menu .menu-item-has-children.hover" ).not( $parent ).removeClass( "hover" );
				}
				if ( $parent.hasClass( "menu-item-has-children" ) ) {
					$parent.addClass( "hover" );
				}
				e.preventDefault();
			}
		});
	}

	// Toggle visibility of dropdowns if touched outside the menu area.
	jQuery( document ).on( "click.anii", function(e) {
		if ( jQuery( e.target ).parents( "#site-menu" ).length > 0 ) {
			return;
		}
		jQuery( "#site-menu li.menu-item-has-children" ).removeClass( "hover" );
	});

	// Handle navigation stickiness.
	if ( $top_nav.hasClass( "navbar-sticky" ) && $top_nav.length > 0 && $featured.length > 0 ) {
		var top_nav_height, featured_height;

		var update_sticky_nav_variables = function() {
			top_nav_height  = $top_nav.outerHeight();
			featured_height = $featured.outerHeight() + top_nav_height;
		};

		update_sticky_nav_variables();

		jQuery( window ).on( "resize.anii", function() {
			if ( window.innerWidth >= 992 ) {
				var isFixed = $body.hasClass( "navbar-is-sticky" );
				$body.removeClass( "navbar-is-sticky" );
				update_sticky_nav_variables();
				if ( isFixed ) {
					$body.addClass( "navbar-is-sticky" );
				}

				// On scroll, we want to stick/unstick the navigation.
				if ( ! $top_nav.hasClass( "navbar-sticky-watching" ) ) {
					$top_nav.addClass( "navbar-sticky-watching" );
					jQuery( window ).on( "scroll.anii", function() {
						var isFixed = $body.hasClass( "navbar-is-sticky" );
						if ( 1 > ( featured_height - window.pageYOffset ) ) {
							if ( ! isFixed ) {
								$body.addClass( "navbar-is-sticky" );
								if ( parseInt( $featured.css( "margin-top" ), 10 ) != top_nav_height ) {
									$featured.css( "margin-top", top_nav_height );
								}
							}
						} else {
							if ( isFixed ) {
								$body.removeClass( "navbar-is-sticky" );
								$featured.css( "margin-top", "" );
							}
						}
					} ).scroll();
				}
			} else {
				if ( $top_nav.hasClass( "navbar-sticky-watching" ) ) {
					$top_nav.removeClass( "navbar-sticky-watching" );
					jQuery( window ).unbind( "scroll.anii" );
					$body.removeClass( "navbar-is-sticky" );
					$featured.css( "margin-top", "" );
				}
			}
		}).resize();
	}

	// Handle footer "behind the content" stickiness.
	if ( $body.hasClass( "footer-sticky" ) ) {
		jQuery( window ).on( "resize.castilo", function() {
			var footer_height = jQuery( "#footer" ).outerHeight();
			if ( footer_height > window.innerHeight - jQuery( "#wpadminbar" ).outerHeight() - jQuery( ".navbar-is-sticky #top" ).outerHeight() ) {
				$body.removeClass( "footer-sticky" );
				jQuery( "#footer" ).prev().css( "margin-bottom", "" );
			} else {
				$body.addClass( "footer-sticky" );
				jQuery( "#footer" ).prev().css( "margin-bottom", footer_height );
			}
		}).resize();
	}

	// Optimize post view unnecessary scape using masonry
	if ( jQuery.fn.masonry ) {
		var $grid = jQuery( ".post-listing .masonry-grid" ).masonry({
			itemSelector       : ".grid-item",
			columnWidth        : ".grid-sizer",
			percentPosition    : true,
			transitionDuration : 0,
		});
		$grid.imagesLoaded().progress( function() {
			$grid.masonry( "layout" );
		});
	}

	// Handle tab navigation.
	jQuery( ".tabs a" ).on( "click.anii", function (e) {
		var $parent = jQuery( this ).parent();
		e.preventDefault();
		if ( $parent.hasClass( "active" ) ) {
			return;
		}
		$parent.siblings( "li" ).each( function() {
			jQuery( this ).removeClass( "active" );
			jQuery( jQuery( this ).find( "a" ).attr( "href" ) ).removeClass( "active" );
		});
		$parent.addClass( "active" );
		var hash = $parent.find( "a" ).attr( "href" );
		jQuery( hash ).addClass( "active" );
	});

	if ( jQuery( "html" ).hasClass( "custom-cursor" ) && ! jQuery( "html" ).hasClass( "touchevents" ) ) {
		var clientX = -200, clientY = -200, $cursor = jQuery( "#magic-cursor" );
		document.addEventListener( "mousemove", function( e ) {
			clientX = e.clientX;
			clientY = e.clientY;
		});

		// move magic cursor
		function renderCursor() {
			$cursor.css( "transform", "translate(" + clientX + "px, " + clientY + "px)" );
			requestAnimationFrame( renderCursor );
		}
		requestAnimationFrame( renderCursor );

		jQuery( ".hide-cursor, .site-title a, #site-menu li, .social-navigation a" ).on({
			mouseenter: function() { $cursor.addClass( "hide" ); },
			mouseleave: function() { $cursor.removeClass( "hide" ); }
		});

		jQuery( ".scale-cursor, .button, .podcast-episode-player" ).on({
			mouseenter: function() { $cursor.addClass( "scale" ); },
			mouseleave: function() { $cursor.removeClass( "scale" ); }
		});
	}

});
