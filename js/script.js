$(function () {
  $("#navbarToggle").blur(function () {
    if (window.innerWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

var insertHtml = function (selector, html) {
  document.querySelector(selector).innerHTML = html;
};

var showLoading = function (selector) {
  insertHtml(selector,
    "<div class='text-center'><img src='images/ajax-loader.gif'></div>");
};

var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  return string.replace(new RegExp(propToReplace, "g"), propValue);
};

document.addEventListener("DOMContentLoaded", function () {
  dc.loadHomeHtml();
});

dc.loadHomeHtml = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true);
};

function buildAndShowHomeHTML(categories) {
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {

      var chosenCategory =
        categories[Math.floor(Math.random() * categories.length)];
      var shortName = "'" + chosenCategory.short_name + "'";

      var finalHtml =
        insertProperty(homeHtml,
          "randomCategoryShortName",
          shortName);

      insertHtml("#main-content", finalHtml);
    },
    false);
}

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

function buildAndShowCategoriesHTML(categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (titleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          var finalHtml = titleHtml + "<section class='row'>";
          for (var i = 0; i < categories.length; i++) {
            var html = insertProperty(categoryHtml, "name", categories[i].name);
            html = insertProperty(html, "short_name", categories[i].short_name);
            finalHtml += html;
          }
          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false);
    },
    false);
}

function buildAndShowMenuItemsHTML(categoryMenuItems) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (titleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (itemHtml) {

          titleHtml =
            insertProperty(titleHtml, "name",
              categoryMenuItems.category.name);

          var finalHtml = titleHtml + "<section class='row'>";
          var items = categoryMenuItems.menu_items;
          var shortName = categoryMenuItems.category.short_name;

          for (var i = 0; i < items.length; i++) {
            var html = itemHtml;
            html = insertProperty(html, "short_name", items[i].short_name);
            html = insertProperty(html, "catShortName", shortName);
            html = insertProperty(html, "name", items[i].name);
            html = insertProperty(html, "description", items[i].description);
            finalHtml += html;
          }
          finalHtml += "</section>";
          insertHtml("#main-content", finalHtml);
        },
        false);
    },
    false);
}

global.$dc = dc;

})(window);
