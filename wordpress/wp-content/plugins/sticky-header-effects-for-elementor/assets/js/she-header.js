var $j = jQuery.noConflict();

$j(document).ready(function () {
    "use strict";
    // She header
    sheHeader();

    $j(window).on('resize', function (e) {
        sheHeader(e);
    });
});


/* ==============================================
HEADER EFFECTS
============================================== */


function sheHeader(e) {
   
    var header = $j('.elementor-element.she-header-yes'),
        container = $j('.she-header-yes .elementor-container, .elementor-element.she-header-yes.e-con'),
        header_elementor = $j('.elementor-edit-mode .she-header-yes'),
        header_logo = $j('.she-header-yes .elementor-widget-theme-site-logo img:not(.elementor-widget-n-menu img), .she-header-yes .elementor-widget-image img:not(.elementor-widget-n-menu img)'),
        header_logo_div = $j('.she-header-yes .elementor-widget-theme-site-logo a::after, .she-header-yes .elementor-widget-image a::after');
    data_settings = header.data('settings');

    if (typeof data_settings != 'undefined') {
        var responsive_settings = data_settings["transparent_on"];
        var width = $j(window).width(),
            header_height = header.height(),
            logo_width = header_logo.width(),
            logo_height = header_logo.height();
    }

    // Check responsive is enabled
    if (typeof width != 'undefined' && width) {
        if (width >= 1025) {
            var enabled = "desktop";
        } else if (width > 767 && width < 1025) {
            var enabled = "tablet";
        } else if (width <= 767) {
            var enabled = "mobile";
        }
    }

    if ($j.inArray(enabled, responsive_settings) != '-1') {

        var scroll_distance = data_settings["scroll_distance"];
        var she_offset = data_settings["she_offset_top"];
        var she_padding = data_settings["she_padding"];
        var she_width = data_settings["she_width"];
        var transparent_header = data_settings["transparent_header_show"];
        var background = data_settings["background"];
        var bottom_border_color = data_settings["custom_bottom_border_color"],
            bottom_border_view = data_settings["bottom_border"],
            bottom_border_width = data_settings["custom_bottom_border_width"];

        var shrink_header = data_settings["shrink_header"],
            data_height = data_settings["custom_height_header"],
            data_height_tablet = data_settings["custom_height_header_tablet"],
            data_height_mobile = data_settings["custom_height_header_mobile"];

        var shrink_logo = data_settings["shrink_header_logo"],
            data_logo_height = data_settings["custom_height_header_logo"],
            data_logo_height_tablet = data_settings["custom_height_header_logo_tablet"],
            data_logo_height_mobile = data_settings["custom_height_header_logo_mobile"];

        var change_logo_color = data_settings["change_logo_color"];

        var blur_bg = data_settings["blur_bg"];

        var scroll_distance_hide_header = data_settings["scroll_distance_hide_header"];

        // offset
        if (width >= 1025) {
            she_offset = data_settings["she_offset_top"];
            she_padding = data_settings["she_padding"];
            she_width = data_settings["she_width"];
        } else if (width > 767 && width < 1025) {
            she_offset = data_settings["she_offset_top_tablet"];
            she_padding = data_settings["she_padding_tablet"];
            she_width = data_settings["she_width_tablet"];
        } else if (width <= 767) {
            she_offset = data_settings["she_offset_top_mobile"];
            she_padding = data_settings["she_padding_mobile"];
            she_width = data_settings["she_width_mobile"];
        }

        if (header.hasClass("she-header")) {
            if( e?.type === 'resize' ){
                header.css("width", she_width.size + she_width.unit);
                header.css("padding-top", she_padding.top + she_padding.unit);
                header.css("padding-bottom", she_padding.bottom + she_padding.unit);
                header.css("padding-left", she_padding.left + she_padding.unit);
                header.css("padding-right", she_padding.right + she_padding.unit);
            }
        }

        // add transparent class
        if (transparent_header == "yes") {
            header.addClass('she-header-transparent-yes');
        }

        // header height shrink
        if (typeof data_height != "undefined" && data_height) {
            if (width >= 1025) {
                var shrink_height = data_height["size"];
            } else if (width > 767 && width < 1025) {
                var shrink_height = data_height_tablet["size"];
                if (shrink_height == "") {
                    shrink_height = data_height["size"];
                }
            } else if (width <= 767) {
                var shrink_height = data_height_mobile["size"];
                if (shrink_height == "") {
                    shrink_height = data_height["size"];
                }
            }
        }

        // Logo height shrink
        if (
            typeof data_logo_height != "undefined" &&
            data_logo_height
        ) {
            if (width >= 1025) {
                var shrink_logo_height = data_logo_height["size"];
            } else if (width > 767 && width < 1025) {
                var shrink_logo_height =
                    data_logo_height_tablet["size"];
            } else if (width <= 767) {
                var shrink_logo_height =
                    data_logo_height_mobile["size"];
            }

            //Calc New width and height
            if (shrink_logo_height == "") {
                //Get logo shrink settings from desktop
                shrink_logo_height = data_logo_height["size"];

                if (shrink_logo_height == "") {
                    // Shrink same settings from height shrink option
                    shrink_logo_height = shrink_height;

                    var percent =
                        parseInt(shrink_logo_height) /
                        parseInt(header_height),
                        width_l = logo_width * percent,
                        height_l = logo_height * percent;
                } else {
                    var width_l =
                        (logo_width * shrink_logo_height) / 100,
                        height_l =
                            (logo_height * shrink_logo_height) / 100;
                }
            } else {
                //Get logo shrink settings from the responsive option
                var width_l = (logo_width * shrink_logo_height) / 100,
                    height_l = (logo_height * shrink_logo_height) / 100;
            }
        }

        // border bottom
        if (typeof bottom_border_width != 'undefined' && bottom_border_width) {
            var bottom_border = bottom_border_width["size"] + "px solid " + bottom_border_color;
        }

        // hide header on scroll
        if (
            typeof scroll_distance_hide_header != "undefined" &&
            scroll_distance_hide_header
        ) {
            var mywindow = $j(window),
                mypos = mywindow.scrollTop();

            mywindow.scroll(function () {
                var sd_hh_s = scroll_distance_hide_header["size"],
                    sd_hh_u = scroll_distance_hide_header["unit"],
                    sd_hh_tablet =
                        data_settings[
                        "scroll_distance_hide_header_tablet"
                        ],
                    sd_hh_tablet_s = sd_hh_tablet["size"],
                    sd_hh_tablet_u = sd_hh_tablet["unit"],
                    sd_hh_mobile =
                        data_settings[
                        "scroll_distance_hide_header_mobile"
                        ],
                    sd_hh_mobile_s = sd_hh_mobile["size"],
                    sd_hh_mobile_u = sd_hh_mobile["unit"];

                // get responsive view
                if (
                    typeof scroll_distance_hide_header != "undefined" &&
                    scroll_distance_hide_header
                ) {
                    if (width >= 1025) {
                        var sd_hh = sd_hh_s,
                            sd_hh_u = sd_hh_u;
                        // calc sise for vh unit
                        if (sd_hh_u == "vh") {
                            sd_hh = window.innerHeight * (sd_hh / 100);
                        }
                    } else if (width > 767 && width < 1025) {
                        var sd_hh = sd_hh_tablet_s,
                            sd_hh_u = sd_hh_tablet_u;

                        if (sd_hh == "") {
                            sd_hh = sd_hh_s;
                        }
                        // calc sise for vh unit
                        if (sd_hh_u == "vh") {
                            sd_hh = window.innerHeight * (sd_hh / 100);
                        }
                    } else if (width <= 767) {
                        var sd_hh = sd_hh_mobile_s,
                            sd_hh_u = sd_hh_mobile_u;

                        if (sd_hh == "") {
                            sd_hh = sd_hh_s;
                        }
                        // calc sise for vh unit
                        if (sd_hh_u == "vh") {
                            sd_hh = window.innerHeight * (sd_hh / 100);
                        }
                    }
                }

                // added option for vh unit
                //if(sd_hh_u == 'px'){
                //	sd_hh  = sd_hh_s;
                //} else {
                //	sd_hh  = (window.innerHeight)*(sd_hh_s/100);
                //}

                if (mypos > sd_hh) {
                    if (mywindow.scrollTop() > mypos) {
                        header.addClass("headerup");
                    } else {
                        header.removeClass("headerup");
                    }
                }
                mypos = mywindow.scrollTop();
            });
        }

        // scroll function
        $j(window).on("load scroll", function (e) {
            var scroll = $j(window).scrollTop();

            if (header_elementor) {
                header_elementor.css("position", "relative");
            }

            var sd_s = scroll_distance["size"],
                sd_u = scroll_distance["unit"],
                sd_tablet = data_settings["scroll_distance_tablet"],
                sd_tablet_s = sd_tablet["size"],
                sd_tablet_u = sd_tablet["unit"],
                sd_mobile = data_settings["scroll_distance_mobile"],
                sd_mobile_s = sd_mobile["size"],
                sd_mobile_u = sd_mobile["unit"];

            // get responsive view
            if (
                typeof scroll_distance != "undefined" &&
                scroll_distance
            ) {
                if (width >= 1025) {
                    var sd = sd_s,
                        sd_u = sd_u;
                    // calc sise for vh unit
                    if (sd_u == "vh") {
                        sd = window.innerHeight * (sd / 100);
                    }
                } else if (width > 767 && width < 1025) {
                    var sd = sd_tablet_s,
                        sd_u = sd_tablet_u;

                    if (sd == "") {
                        sd = sd_s;
                    }
                    // calc sise for vh unit
                    if (sd_u == "vh") {
                        sd = window.innerHeight * (sd / 100);
                    }
                } else if (width <= 767) {
                    var sd = sd_mobile_s,
                        sd_u = sd_mobile_u;

                    if (sd == "") {
                        sd = sd_s;
                    }
                    // calc sise for vh unit
                    if (sd_u == "vh") {
                        sd = window.innerHeight * (sd / 100);
                    }
                }
            }

            if (scroll >= scroll_distance["size"]) {
                header.removeClass('header').addClass("she-header");
                header.css("background-color", background);
                header.css("border-bottom", bottom_border);

                header.css("top", she_offset.size + she_offset.unit);

                if (width >= 768) {
                    if (document.body.classList.contains('admin-bar')) {
                        header.css("top", (32 + she_offset.size) + she_offset.unit);
                    }
                }

                header.css("padding-top", she_padding.top + she_padding.unit);
                header.css("padding-bottom", she_padding.bottom + she_padding.unit);
                header.css("padding-left", she_padding.left + she_padding.unit);
                header.css("padding-right", she_padding.right + she_padding.unit);
                header.css("width", she_width.size + she_width.unit);
                // header.attr("style", "width: " + she_width.size + she_width.unit + " !important;");
                // header.css("width", she_width.size + she_width.unit);

                header.removeClass('she-header-transparent-yes');

                if (shrink_header == "yes") {
                    header.css({ "padding-top": "0", "padding-bottom": "0", "margin-top": "0", "margin-bottom": "0" });
                    container.css({ "min-height": shrink_height, "transition": "all 0.4s ease-in-out", "-webkit-transition": "all 0.4s ease-in-out", "-moz-transition": "all 0.4s ease-in-out" });
                }

                if (change_logo_color == "yes") {
                    header_logo.addClass("change-logo-color");
                }

                // ---------------------------------- SHRINK LOGO
                if (shrink_logo == "yes") {
                    header_logo.css({
                        width: width_l,
                        transition: "all 0.4s ease-in-out",
                        "-webkit-transition": "all 0.4s ease-in-out",
                        "-moz-transition": "all 0.4s ease-in-out",
                    });
                }

            } else {
                header.removeClass("she-header").addClass('header');
                header.css("background-color", "");
                header.css("border-bottom", "");
                header.css("top", "");
                header.css("padding-top", "");
                header.css("padding-bottom", "");
                header.css("padding-left", "");
                header.css("padding-right", "");
                header.css("width", "");

                if (transparent_header == "yes") {
                    header.addClass('she-header-transparent-yes');
                }
                if (shrink_header == "yes") {
                    header.css({ "padding-top": "", "padding-bottom": "", "margin-top": "", "margin-bottom": "" });
                    container.css("min-height", "");
                }

                // ---------------------------------- SHRINK LOGO
                if (shrink_logo == "yes") {
                    header_logo.css({ height: "", width: "" });
                }

                if (change_logo_color == "yes") {
                    header_logo.removeClass("change-logo-color");

                }

            }


        });
    }

};