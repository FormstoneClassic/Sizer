/*
 * Sizer Plugin [Formstone Library]
 * @author Ben Plum
 * @version 0.1.1
 *
 * Copyright (c) 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
 
if (jQuery) (function($) {
	var sizerCount = 0;
	
	var pub = {
		disable: function() {
			$(this).each(function() {
				var data = $(this).data("sizer");
				data.disabled = true;
				data.$sizer.off("resize.sizer");
				data.$items.css({ height: "" });
				if (data.updateParent) {
					data.$sizer.css({ height: "" })
							   .find(".sizer-update").css({ height: "" });
				}
			});
		},
		
		enable: function() {
			$(this).each(function() {
				var data = $(this).data("sizer");
				if (data.disabled) {
					data.disabled = false;
					data.$sizer.on("resize.sizer", data, pub.resize)
							   .trigger("resize.sizer");
				}
			});
		},
		
		resize: function(e) {
			var data = e.data;
			$.doTimeout("sizer-"+data.guid+"-reset", Site.debounceTime, _resize, data);
		}
	};
	
	function _init() {
		return $(this).each(_build);
	}
	
	function _build() {
		var $sizer = $(this),
			data = {
				$sizer: $sizer,
				$items: $sizer.find(".sizer-item"),
				updateParent: $sizer.hasClass("sizer-update") || $sizer.find(".sizer-update"),
				minWidth: $sizer.data("sizer-min-width") || 0,
				diabled: false,
				guid: sizerCount++
			};
		
		data.$items.wrapInner('<div class="sizer-size" />');
		
		data.$sizer.addClass("sizer-ready")
				   .data("sizer", data)
				   .on("resize.sizer", data, pub.resize)
				   .trigger("resize.sizer");
		
		data.$sizer.on("load", "img", function() {
			$(this).trigger("resize.sizer");
		});
	}
	
	function _resize(data) {
		var height = 0;
		data.$items.css({ height: "" });
		
		if (data.minWidth < Site.maxWidth) {
			for (var i = 0; i < data.$items.length; i++) {
				var itemHeight = data.$items.eq(i).find(".sizer-size").outerHeight(true);
				if (itemHeight > height) {
					height = itemHeight;
				}
			}
			
			data.$items.css({ height: height });
			if (data.updateParent) {
				data.$sizer.css({ height: height })
						   .find(".sizer-update").css({ height: height });
			}
		}
	}
	
	$.fn.sizer = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
})(jQuery);