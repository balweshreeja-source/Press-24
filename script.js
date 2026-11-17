
// =================================
// PRESS24 WEBSITE JAVASCRIPT
// =================================

// MOBILE NAVIGATION
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("show");

        const isOpen = navLinks.classList.contains("show");
        menuToggle.textContent = isOpen ? "✕" : "☰";
        menuToggle.setAttribute("aria-expanded", isOpen);
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", function () {
            navLinks.classList.remove("show");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// BOOKING FORM
const bookingForm = document.getElementById("booking-form");
const formMessage = document.getElementById("form-message");

const bookingSuccess = document.getElementById("booking-success");
const newBookingButton = document.getElementById("new-booking");

if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const pincode = document.getElementById("pincode").value.trim();

        formMessage.textContent = "";
        formMessage.hidden = false;

        // NAME VALIDATION
        if (name.length < 2) {
            showMessage("Please enter a valid name.", "red");
            return;
        }

        // PHONE VALIDATION
        if (!/^[6-9]\d{9}$/.test(phone)) {
            showMessage("Please enter a valid 10-digit Indian mobile number.", "red");
            return;
        }

        // ADDRESS VALIDATION
        if (address.length < 10) {
            showMessage("Please enter your complete pickup address.", "red");
            return;
        }

        // PIN CODE VALIDATION
        if (!/^\d{6}$/.test(pincode)) {
            showMessage("Please enter a valid 6-digit PIN code.", "red");
            return;
        }

        if (pincode !== "411036") {
            showMessage("Sorry! Press24 currently serves PIN code 411036 only.", "red");
            return;
        }

        // GENERATE DEMO BOOKING REFERENCE
        const bookingId =
            "P24-" +
            Date.now().toString().slice(-8) +
            Math.floor(100 + Math.random() * 900);

        // DISPLAY CUSTOMER DETAILS
        document.getElementById("booking-id").textContent = bookingId;
        document.getElementById("confirmed-name").textContent = name;
        document.getElementById("confirmed-phone").textContent = phone;
        document.getElementById("confirmed-address").textContent = address;
        document.getElementById("confirmed-pincode").textContent = pincode;

        // HIDE INPUT FIELDS
        bookingForm.querySelectorAll(".form-group").forEach(group => {
            group.hidden = true;
        });

        const submitButton = bookingForm.querySelector(".form-button");

        if (submitButton) {
            submitButton.hidden = true;
        }

        formMessage.hidden = true;

        // SHOW SUCCESS CARD
        bookingSuccess.hidden = false;
        bookingSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

// MAKE ANOTHER REQUEST
if (newBookingButton) {
    newBookingButton.addEventListener("click", function () {
        bookingForm.reset();

        // SHOW INPUT FIELDS AGAIN
        bookingForm.querySelectorAll(".form-group").forEach(group => {
            group.hidden = false;
        });

        const submitButton = bookingForm.querySelector(".form-button");

        if (submitButton) {
            submitButton.hidden = false;
        }

        // HIDE SUCCESS CARD
        bookingSuccess.hidden = true;

        formMessage.textContent = "";
        formMessage.hidden = false;

        // FOCUS ON NAME FIELD
        document.getElementById("customer-name").focus();
    });
}

// MESSAGE FUNCTION
function showMessage(message, color) {
    formMessage.textContent = message;
    formMessage.style.color = color;
}

// FOOTER YEAR
const footerYear = document.querySelector(".footer-bottom p");

if (footerYear) {
    footerYear.textContent =
        "© " + new Date().getFullYear() + " Press24. All rights reserved.";
}
// BACK TO TOP BUTTON
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = "1";
            backToTopButton.style.visibility = "visible";
        } else {
            backToTopButton.style.opacity = "0";
            backToTopButton.style.visibility = "hidden";
        }
    });

    backToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// =================================
// PRESS24 GARMENT CATALOGUE LOGIC
// =================================

const garmentCards = document.querySelectorAll(".garment-card");
const categoryButtons = document.querySelectorAll(".category-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const proceedBooking = document.getElementById("proceed-booking");

function updateCart() {
    let total = 0;
    let selectedItems = [];

    garmentCards.forEach(card => {
        const quantity = Number(card.querySelector(".qty").textContent);
        const name = card.dataset.name;
        const price = Number(card.dataset.price);

        if (quantity > 0) {
            const itemTotal = quantity * price;
            total += itemTotal;

            selectedItems.push({
                name,
                quantity,
                itemTotal
            });
        }
    });

    cartItems.innerHTML = "";

    if (selectedItems.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No garments selected yet.</p>';
    } else {
        selectedItems.forEach(item => {
            const row = document.createElement("div");
            row.className = "cart-item";

            const itemName = document.createElement("span");
            itemName.textContent = `${item.name} × ${item.quantity}`;

            const itemPrice = document.createElement("strong");
            itemPrice.textContent = `₹${item.itemTotal}`;

            row.append(itemName, itemPrice);
            cartItems.appendChild(row);
        });
    }

    cartTotal.textContent = `₹${total}`;
}

// QUANTITY BUTTONS
garmentCards.forEach(card => {
    const minusButton = card.querySelector(".qty-minus");
    const plusButton = card.querySelector(".qty-plus");
    const quantityDisplay = card.querySelector(".qty");

    plusButton.addEventListener("click", () => {
        let quantity = Number(quantityDisplay.textContent);
        quantityDisplay.textContent = quantity + 1;
        updateCart();
    });

    minusButton.addEventListener("click", () => {
        let quantity = Number(quantityDisplay.textContent);

        if (quantity > 0) {
            quantityDisplay.textContent = quantity - 1;
            updateCart();
        }
    });
});

// CATEGORY FILTERS
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedCategory = button.dataset.category;

        garmentCards.forEach(card => {
            if (
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// CONTINUE TO BOOKING
if (proceedBooking) {
    proceedBooking.addEventListener("click", () => {
        const hasItems = [...garmentCards].some(card =>
            Number(card.querySelector(".qty").textContent) > 0
        );

        if (!hasItems) {
            alert("Please select at least one garment before continuing.");
            return;
        }

        const bookingSection = document.getElementById("booking");

        if (bookingSection) {
            bookingSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
}

// INITIAL CART DISPLAY
updateCart();

// =================================
// PRESS24 GPS LOCATION
// =================================

const locationButton = document.getElementById("use-current-location");
const locationStatus = document.getElementById("location-status");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

if (locationButton) {
    locationButton.addEventListener("click", () => {

        if (!navigator.geolocation) {
            locationStatus.textContent =
                "Your browser does not support GPS location.";
            return;
        }

        locationStatus.textContent = "Getting your location...";
        locationButton.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                latitudeInput.value = latitude;
                longitudeInput.value = longitude;

                locationStatus.textContent =
                    "Location captured successfully! Please enter your complete pickup address below.";

                locationButton.disabled = false;
            },

            (error) => {
                locationButton.disabled = false;

                if (error.code === error.PERMISSION_DENIED) {
                    locationStatus.textContent =
                        "Location permission denied. Please allow location access or enter your address manually.";
                } else {
                    locationStatus.textContent =
                        "Unable to get your location. Please try again or enter your address manually.";
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    });
}
