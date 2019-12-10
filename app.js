/* STEP 1 Make a plan and a structure and an architecture
    +Add event handler
    +Get input values
    +Add the new item to our data structure
    +Add the new item to the UI
    +Calculate budget
    +update the UI

 
*** Structure your code with modules
-Important aspect of any robust application's architecture;
-Keep the units of code for a project both cleanly seperated and organized;
-Encapsulate some data into privacy and expose other data publicly.

---UI MODULE
-Get input values
-Add the new item to the UI
-Update the UI

---DATA MODULE
-Add the new item to our data structure
-Calculate budget

---CONTROLLER MODULE
-Add event listener

+What you'll learn in this lecture
-What the module pattern is in Javascript and how to implement it
-Learn more about private and public data,encapsulation and seperation of concerns
*/

// LECTURE 78 - Setting up the first event listeners
// How to set up event listeners for keypress events
// How to use event object

// LECTURE 79 - Reading input data
// How to read data from different HTML input types;

// LECTURE 80 - Creating an initialization Function
// How and why to create an initialization function

// LECTURE 81 - Creating income and expense Function constructors
// How to choose function constructors that meet our application needs
// How to set up a proper data structure for our budget controller

// LECTURE 82 - Adding a new item to our budget controller
// How to avoid conflicts in our data structures
// How and why to pass data from one module to another

// LECTURE 83 - Adding a new item to the UI
// A technique for adding big chunks of HTML into the DOM
// How to replace parts of strings
// How to do DOM manipulation using the inserAdjacentHTML method

// LECTURE 84 - Clearing our input fields
// How to clear HTML fields
// How to user querySelectorAll
// How to convert a list to an array
// A better way to loop over an array then for loops: foreach

// LECTURE 85 - Updating the budget: Controller
// How to convert field inputs to numbers
// How to prevent false inputs

// LECTURE 86 - Updating the budget: Budget controller
// How and why to create simple,reusable functions with only one purpose
// How to sum all elements of an array using the forEach method

// LECTURE 87 - Updating the budget : UI controller
// Practice DOM manipulation by updating the budget and total values

// LECTURE 88 - project planning and architecture : step 2

// LECTURE 89 - Event Delegation
// Event bubbling, target element and event delegation
// Event bubbling ; means that when an event is fired and triggered and some dom element and then the same element triggered on all parent elements 
// Use cases for event delegation : 
// 1 when we have an element with lots of child elements that we are interested in,
// 2 when we want an event handler attached to an element that is not yet in the DOM when our page is loaded

// LECTURE 90 - Setting up the delete event listener using event delegation
// How to use event delegation in practice
// How to use ID's in HTML to connect the UI with the data model
// How to use the parentNode property for DOM traversing

// LECTURE 91 - Deleting an item from our budget controller
// Another method to loop over an array: map;
// How to remove elements from an array using the splice method

// LECTURE 92 - Deleting an item from the UI
// More DOM manipulation; specifically, how to remove an element from the DOM


// BUDGET CONTROLLER
var budgetController = (function() {
    var Expense = function(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; //  sum = sum + cur.value; also works
        });  
        /* This is how the loop works
        0
        [200,400,100]
        sum = 0 + 200
        sum = 200 + 400
        sum = 600 + 100 = 700
        */
       data.totals[type] = sum;
    };

    // This is our data structure
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
        
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
            // We want the id be equal to last ID + 1
            // ID = last ID + 1
            
            // Create new ID
            if (data.allItems[type].length > 0 ){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            // Create new item based on "inc" or "exp" type
            if (type === "exp"){
                newItem = new Expense(ID,des,val);
            } else if (type === "inc") {
                newItem = new Income(ID,des,val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },


        calculateBudget: function() {

            // calculate total income and expenses
            calculateTotal("exp");
            calculateTotal("inc");
            
            // calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            // we made the if statement so we only spent when we have income
            if (data.totals.inc > 0) { 
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
                //  for example expense = 100 and income = 200, spent 50% = 100/200 = 0.5 * 100
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

    };




})();



// UI CONTROLLER
var UIController = (function(){

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // parseFloat when decimals
            };
        },
        addListItems: function(obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === "exp") {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
                        
            // Replace the placeholder text with actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },


        clearFields: function(){
            var fields, fieldsArr;

            fields= document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue); // This makes fields a list instead of an array

            fieldsArr = Array.prototype.slice.call(fields); // This turns this list into an array so we can loop over it with forEach method

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        
        },
        
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage = "---";
            }

        },


        getDOMstrings: function() { // makes it public
            return DOMstrings;
        }
    };

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventlisteners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event){
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
        // we did this because we want to do event delegation, this container element has both income and expense so when we mess with it (making delete function) we are only going to have to do it once and it will bubble up so we dont repeat the same code
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

    };


    var updateBudget = function(){

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

        
    };

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get the filed input data
        input = UICtrl.getInput();
        // If statement is here so the app doesnt let any empty inputs to get in
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the new item to the UI
            UICtrl.addListItems(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID; 
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // we got to the parent element and stored it the itemID variable

        if (itemID) {
            
            //inc-1
            splitID = itemID.split("-");
            type = splitID[0];
            ID = parseInt(splitID[1]); // parseInt when integers 

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
        } 
    };

    return {  // To make it public we need to return it in an object
        init: function() {
            console.log("Appliscation has started.");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventlisteners();
        }
    }

    


})(budgetController,UIController);

controller.init();


