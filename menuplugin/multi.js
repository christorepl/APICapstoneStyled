var multi = (function () {
  var disabled_limit = false;

  var trigger_event = function (type, el) {
    var e = document.createEvent("HTMLEvents");
    e.initEvent(type, false, true);
    el.dispatchEvent(e);
  };

  var toggle_option = function (select, event, settings) {
    var option = select.options[event.target.getAttribute("multi-index")];

    if (option.disabled) {
      return;
    }

    option.selected = !option.selected;

    var limit = settings.limit;
    if (limit > -1) {
      var selected_count = 0;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
          selected_count++;
        }
      }
      if (selected_count === limit) {
        this.disabled_limit = true;
        if (typeof settings.limit_reached === "function") {
          settings.limit_reached();
        }
        for (var i = 0; i < select.options.length; i++) {
          var opt = select.options[i];

          if (!opt.selected) {
            opt.setAttribute("disabled", true);
          }
        }
      } else if (this.disabled_limit) {
        for (var i = 0; i < select.options.length; i++) {
          var opt = select.options[i];

          if (opt.getAttribute("data-origin-disabled") === "false") {
            opt.removeAttribute("disabled");
          }
        }

        this.disabled_limit = false;
      }
    }

    trigger_event("change", select);
  };

  var refresh_select = function (select, settings) {
    select.wrapper.selected.innerHTML = "";
    select.wrapper.non_selected.innerHTML = "";
    if (settings.non_selected_header && settings.selected_header) {
      var non_selected_header = document.createElement("div");
      var selected_header = document.createElement("div");

      non_selected_header.className = "header";
      selected_header.className = "header";

      non_selected_header.innerText = settings.non_selected_header;
      selected_header.innerText = settings.selected_header;

      select.wrapper.non_selected.appendChild(non_selected_header);
      select.wrapper.selected.appendChild(selected_header);
    }

    if (select.wrapper.search) {
      var query = select.wrapper.search.value;
    }

    var item_group = null;
    var current_optgroup = null;

    for (var i = 0; i < select.options.length; i++) {
      var option = select.options[i];

      var value = option.value;
      var label = option.textContent || option.innerText;

      var row = document.createElement("a");
      row.tabIndex = 0;
      row.className = "item";
      row.innerText = label;
      row.setAttribute("role", "button");
      row.setAttribute("data-value", value);
      row.setAttribute("multi-index", i);

      if (option.disabled) {
        row.className += " disabled";
      }

      if (option.selected) {
        row.className += " selected";
        var clone = row.cloneNode(true);
        select.wrapper.selected.appendChild(clone);
      }

      if (
        option.parentNode.nodeName == "OPTGROUP" &&
        option.parentNode != current_optgroup
      ) {
        current_optgroup = option.parentNode;
        item_group = document.createElement("div");
        item_group.className = "item-group";

        if (option.parentNode.label) {
          var groupLabel = document.createElement("span");
          groupLabel.innerHTML = option.parentNode.label;
          groupLabel.className = "group-label";
          item_group.appendChild(groupLabel);
        }

        select.wrapper.non_selected.appendChild(item_group);
      }

      if (option.parentNode == select) {
        item_group = null;
        current_optgroup = null;
      }

      if (
        !query ||
        (query && label.toLowerCase().indexOf(query.toLowerCase()) > -1)
      ) {
        if (item_group != null) {
          item_group.appendChild(row);
        } else {
          select.wrapper.non_selected.appendChild(row);
        }
      }
    }
  };

  var init = function (select, settings) {
    settings = typeof settings !== "undefined" ? settings : {};

    settings["enable_search"] =
      typeof settings["enable_search"] !== "undefined"
        ? settings["enable_search"]
        : true;
    settings["search_placeholder"] =
      typeof settings["search_placeholder"] !== "undefined"
        ? settings["search_placeholder"]
        : "Search for a state...";
    settings["non_selected_header"] =
      typeof settings["non_selected_header"] !== "undefined"
        ? settings["non_selected_header"]
        : null;
    settings["selected_header"] =
      typeof settings["selected_header"] !== "undefined"
        ? settings["selected_header"]
        : null;
    settings["limit"] =
      typeof settings["limit"] !== "undefined"
        ? parseInt(settings["limit"])
        : -1;
    if (isNaN(settings["limit"])) {
      settings["limit"] = -1;
    }

    if (select.dataset.multijs != null) {
      return;
    }
    if (select.nodeName != "SELECT" || !select.multiple) {
      return;
    }

    select.style.display = "none";
    select.setAttribute("data-multijs", true);

    var wrapper = document.createElement("div");
    wrapper.className = "multi-wrapper";

    if (settings.enable_search) {
      var search = document.createElement("input");
      search.className = "search-input";
      search.type = "text";
      search.setAttribute("placeholder", settings.search_placeholder);

      search.addEventListener("input", function () {
        refresh_select(select, settings);
      });

      wrapper.appendChild(search);
      wrapper.search = search;
    }

    var non_selected = document.createElement("div");
    non_selected.className = "non-selected-wrapper";

    var selected = document.createElement("div");
    selected.className = "selected-wrapper";

    wrapper.addEventListener("click", function (event) {
      if (event.target.getAttribute("multi-index")) {
        toggle_option(select, event, settings);
      }
    });

    wrapper.addEventListener("keypress", function (event) {
      var is_action_key = event.keyCode === 32 || event.keyCode === 13;
      var is_option = event.target.getAttribute("multi-index");

      if (is_option && is_action_key) {
        event.preventDefault();
        toggle_option(select, event, settings);
      }
    });

    wrapper.appendChild(non_selected);
    wrapper.appendChild(selected);

    wrapper.non_selected = non_selected;
    wrapper.selected = selected;

    select.wrapper = wrapper;

    select.parentNode.insertBefore(wrapper, select.nextSibling);

    for (var i = 0; i < select.options.length; i++) {
      var option = select.options[i];
      option.setAttribute("data-origin-disabled", option.disabled);
    }

    refresh_select(select, settings);

    select.addEventListener("change", function () {
      refresh_select(select, settings);
    });
  };

  return init;
})();

if (typeof jQuery !== "undefined") {
  (function ($) {
    $.fn.multi = function (settings) {
      settings = typeof settings !== "undefined" ? settings : {};

      return this.each(function () {
        var $select = $(this);

        multi($select.get(0), settings);
      });
    };
  })(jQuery);
}
