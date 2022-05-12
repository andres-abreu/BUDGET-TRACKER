// declares a brand new database
const request = window.indexedDB.open("budget-tracker", 1);
let db;

// initialize the database with onupgradeneeded
// create a new object storage with a name
// modify the object storage by opening up a new transaction and ".objectStore"
// need  to open up a new transaction every time the object storage must be modified

request.onupgradeneeded = (event) => {
  db = event.target.result; // this result is an object that represents a connection to the database

  db.createObjectStore("Budget", { autoIncrement: true });
};

request.onsuccess = (event) => {
  //when the db is successfully created, then ...
  db = event.target.result;
  if (navigator.onLine) {
    uploadBudgetInfo();
  }
};

function saveRecord(data) {
  console.log(data);
  const transaction = db.transaction(["Budget"], "readwrite"); // open a new transaction in your database object store with read/write perms
  const budgetStore = transaction.objectStore("Budget"); // access the newly created transaction (set to your object store)
  budgetStore.add(data); // add the data
}

async function uploadBudgetInfo() {
  const transaction = db.transaction(["Budget"], "readwrite");
  const budgetStore = transaction.objectStore("Budget");
  const budgetInfo = budgetStore.getAll();

  budgetInfo.onsuccess = () => {
    if (budgetInfo.result.length > 0) {
      fetch("api/transaction/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetInfo.result),
      })
        .then((result) => result.json())
        .then((response) => {
          if (response.message) {
            throw new Error(message);
          }
          const transaction = db.transaction(["Budget"], "readwrite");
          const budgetStore = transaction.objectStore("Budget");
          budgetStore.clear();

          alert("Your budget info has been synced!");
          window.location.reload();
        });
    }
  };
}

window.addEventListener('online', uploadBudgetInfo);