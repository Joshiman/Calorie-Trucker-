// storage Controller
const StorageCtrl = (function () {
  // Public methods
  return {
    storeItem: function (item) {
      let items;
      // check if there is any item in Local storage(LS)
      if (localStorage.getItem("items") === null) {
        items = [];
        // push new item
        items.push(item);
        //set LS
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is already in LS
        items = JSON.parse(localStorage.getItem("items"));

        // push  new item
        items.push(item);

        // re set LS
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },

    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

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
    // items: [
    //   //   { id: 0, name: "Steak Diner", calories: 1200 },
    //   //   { id: 1, name: "Cookies", calories: 500 },
    //   //   { id: 2, name: "Fish and Chips ", calories: 800 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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

    deleteItem: function (id) {
      // Get ids
      const ids = state.items.map(function (item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      state.items.splice(index, 1);
    },

    setCurrentItem: function (item) {
      state.currentItem = item;
    },

    clearAllItems: function () {
      state.items = [];
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
    clearBtn: ".clear-btn",
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

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
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
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
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

    // Delet  item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Clear  items event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
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

      // Store in locaStorage
      StorageCtrl.storeItem(newItem);

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
    // get item input
    const input = UICtrl.getItemInput();

    // Update time
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total  Calories in UI
    UICtrl.showTotalCalories(totalCalories);

    // updat local stdorage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button event
  const itemDeleteSubmit = function (e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI

    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total  Calories in UI
    UICtrl.showTotalCalories(totalCalories);

    // Delet from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear Items event
  const clearAllItemsClick = function (e) {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total  Calories in UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from UI
    UICtrl.removeItems();

    // Clear from Local Storage
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();

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
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App

App.init();
