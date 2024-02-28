import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Reference variables
const gratitudeInput = document.getElementById("gratitude-input");
const gratitudeSubmitBtn = document.getElementById("gratitude-button");
const gratitudeList = document.getElementById("gratitude-list");

const firebaseConfig = {
    databaseURL: "https://gratitude-pwa-default-rtdb.firebaseio.com/"
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const gratitudeDB = ref(db, "gratitude");

// If there is already data in the database, display it

// Empty state
onValue(gratitudeDB, function(snapshot) {
    if(snapshot.exists()) {
        let gratitudeList = Object.entries(snapshot.val());
        clearList();
        gratitudeList.forEach((gratitude) => {
            render(gratitude[0], gratitude[1]);
        });
    } else {
        // Add icon later
        clearList();
        const emptyState = document.createElement("li");
        const emptyStateText = document.createElement("p");
        emptyStateText.textContent = "No gratitude notes... yet!";
        emptyState.append(emptyStateText);
        const emptyStateAction = document.createElement("p");
        emptyStateAction.textContent = "Add your first note";
        emptyStateAction.classList.add("inline-action");
        emptyStateAction.addEventListener("click", () => {
            gratitudeInput.focus();
        });
        emptyState.append(emptyStateAction);
        emptyState.id = "empty-state";
        gratitudeList.append(emptyState);
    }
});

// Submit button event listener
gratitudeSubmitBtn.addEventListener("click", () => {
    event.preventDefault();
    const gratitude = gratitudeInput.value;
    if(gratitude) {
        push(gratitudeDB, gratitude);
        gratitudeInput.value = "";
    }
});

// Render function
function render(key, value){
    const gratitudeItem = document.createElement("li");
    gratitudeItem.textContent = value;
    gratitudeItem.classList.add("gratitude-item");
    gratitudeItem.addEventListener("click", () => {
        removeItem(key);
    });
    gratitudeList.append(gratitudeItem);
}

// Clear function
function clearList() {
    gratitudeList.innerHTML = "";
}

// Remove function
function removeItem(key) {
    console.log("removeItem called");
    remove(ref(db, `gratitude/${key}`));
}