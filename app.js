// storage Controller

// Item controller

const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State

  const state = {
    items: [
      { id: 0, name: "Steak Diner", calories: 1200 },
      { id: 0, name: "Cookies", calories: 500 },
      { id: 0, name: "Fish and Chips ", calories: 800 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods

  return {
    getItems: function () {
      return state.items;
    },
    logData: function () {
      return state;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  // make the id selctor dynamic
  const UISelector = {
    itemList: "#item-list",
  };

  // pulic methods
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelector.itemList).innerHTML = html;
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Pulic methods
  return {
    init: function () {
      // Fetch Items from states  stucture
      const items = ItemCtrl.getItems();

      // Populate list with items
      UICtrl.populateItemList(items);
    },
  };
})(ItemCtrl, UICtrl);

// Initialize App

App.init();
