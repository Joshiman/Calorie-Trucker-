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
      //   { id: 0, name: "Steak Diner", calories: 1200 },
      //   { id: 1, name: "Cookies", calories: 500 },
      //   { id: 2, name: "Fish and Chips ", calories: 800 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public methods

  return {
    getItems: function () {
      return state.items;
    },
    addItem: function (name, calories) {
      // create Id
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);
      // Add to itmes array
      state.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through items
      state.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(function (item) {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;
    },
    setCurrentItem: function (item) {
      state.currentItem = item;
    },

    getCurrentItem: function () {
      return state.currentItem;
    },

    getTotalCalories: function () {
      let total = 0;

      // Loop through items and calories
      state.items.forEach(function (item) {
        total += item.calories;
      });
      // Set total Cal in data Structure
      state.totalCalories = total;

      // return total
      return state.totalCalories;
    },

    logData: function () {
      return state;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  // make the id selctor dynamic
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
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
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // add Class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;

      // add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },

    updateListItem: function (item) {
      let listItem = document.querySelectorAll(UISelectors.listItems);
      //   console.log(listItem);
      // Turn Node list into array
      listItem = Array.from(listItem);

      listItem.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        }
      });
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    AddItemToForm: function () {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  const loadEventListeners = function () {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter key
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemClickEdit);

    //Update  item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
  };

  // Add item submit
  const itemAddSubmit = function (e) {
    // Get from input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total  Calories in UI
      UICtrl.showTotalCalories(totalCalories);

      // clear fileds
      UICtrl.clearInput();

      // update UI item
      //   UICtrl.itemUpdateSubmit
    }

    e.preventDefault();
  };

  // update item click
  const itemClickEdit = function (e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      //break into an array
      const listIdArr = listId.split("-");

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add current item
      UICtrl.AddItemToForm();
    }

    e.preventDefault();
  };

  // Update click submit
  const itemUpdateSubmit = function (e) {
    // get item inpudt
    const input = UICtrl.getItemInput();

    // Update time
    const updateItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updateItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total  Calories in UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Pulic methods
  return {
    init: function () {
      // Celar edit state / set initila set
      UICtrl.clearEditState();

      // Fetch Items from states  stucture
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total  Calories in UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

// Initialize App

App.init();
