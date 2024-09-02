document.addEventListener('DOMContentLoaded', () => {
    // Initialize container navigation
    function showContainer(index) {
        const containers = document.querySelectorAll('.container1, .container2, .container3, .container4, .container5, .container6, .container8');
        containers.forEach((container, i) => {
            container.classList.toggle('active', i === index);
        });

        // Update container6 when navigating to it
        if (index === 5) { // Index for container6
            updateContainer6();
        }
    }

    function handleNavigation(event) {
        const containers = Array.from(document.querySelectorAll('.container1, .container2, .container3, .container4, .container5, .container6, .container8'));
        const currentIndex = containers.findIndex(container => container.classList.contains('active'));

        if (event.target.classList.contains('next')) {
            if (currentIndex < containers.length - 1) { // Navigate to the next container
                showContainer(currentIndex + 1);
                updateSliderNo(currentIndex + 1);
            }
        } else if (event.target.classList.contains('back')) {
            if (currentIndex > 0) { // Navigate to the previous container
                showContainer(currentIndex - 1);
                updateSliderNo(currentIndex - 1);
            }
        } else if (event.target.classList.contains('continue')) {
            // Navigate back to the initial page (index 0)
            showContainer(0);
            updateSliderNo(0);
        }
    }

    function updateSliderNo(index) {
        const sliderDots = document.querySelectorAll('.sliderNo div');
        sliderDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Attach event listeners for navigation buttons
    document.querySelectorAll('.buttons1 .next, .buttons1 .back, .buttons1 .continue').forEach(button => {
        button.addEventListener('click', handleNavigation);
    });

    // Initialize the first container as active
    showContainer(0);
    updateSliderNo(0);  // Ensure the slider starts in the correct state

    // Initialize monthly/yearly plan toggle for container2
    const toggleButtonsContainer2 = document.querySelectorAll('.container2 .toggle button');
    const monthlyPlansContainer2 = document.querySelectorAll('.container2 .plans.monthly');
    const yearlyPlansContainer2 = document.querySelectorAll('.container2 .plans.yearly');

    toggleButtonsContainer2.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtonsContainer2.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const isYearly = button.classList.contains('yearly');

            monthlyPlansContainer2.forEach(plan => plan.style.display = isYearly ? 'none' : 'block');
            yearlyPlansContainer2.forEach(plan => plan.style.display = isYearly ? 'block' : 'none');
        });
    });

    // Initialize monthly/yearly plan toggle for container4
    const toggleButtonsContainer4 = document.querySelectorAll('.container4 .toggle button');
    const monthlyPlansContainer4 = document.querySelectorAll('.container4 .planss.monthly2');
    const yearlyPlansContainer4 = document.querySelectorAll('.container4 .planss.yearly2');

    toggleButtonsContainer4.forEach(button => {
        button.addEventListener('click', () => {
            toggleButtonsContainer4.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const isYearly = button.classList.contains('yearly');

            monthlyPlansContainer4.forEach(plan => plan.style.display = isYearly ? 'none' : 'block');
            yearlyPlansContainer4.forEach(plan => plan.style.display = isYearly ? 'block' : 'none');
        });
    });

    // Initialize with monthly plans visible for both containers
    monthlyPlansContainer2.forEach(plan => plan.style.display = 'block');
    yearlyPlansContainer2.forEach(plan => plan.style.display = 'none');

    monthlyPlansContainer4.forEach(plan => plan.style.display = 'block');
    yearlyPlansContainer4.forEach(plan => plan.style.display = 'none');

    // Store selected plan and add-ons
    let selectedPlan = {
        type: null, // Monthly or yearly
        plan: null, // Arcade, Advanced, or Pro
        price: null  // Price of the selected plan
    };

    let selectedAddOns = {
        type: null, // Monthly or yearly
        addOns: [], // Array of selected add-ons with their prices
        total: 0    // Total cost of selected add-ons
    };

    // Handle plan selection in container2
    document.querySelectorAll('.container2 .plans input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const planType = document.querySelector('.container2 .toggle .active').classList.contains('yearly') ? 'yearly' : 'monthly';
            const selectedPlanElement = event.target.closest('label');
            const selectedPlanName = event.target.value;

            // Price extraction for selected plan in container2
            const priceText = selectedPlanElement.querySelector('.text p:last-child').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

            selectedPlan = {
                type: planType,
                plan: selectedPlanName,
                price: price
            };

            console.log('Selected Plan in Container 2:', selectedPlan);

            // Update container6 when plan is selected
            if (document.querySelector('.container6').classList.contains('active')) {
                updateContainer6();
            }
        });
    });

    // Handle add-on selection in container4
    document.querySelectorAll('.container4 .planss input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const planType = document.querySelector('.container4 .toggle .active').classList.contains('yearly') ? 'yearly' : 'monthly';
            const selectedAddOnElement = event.target.closest('div');
            const addOnText = selectedAddOnElement.querySelector('div:first-child p').textContent; // Adjusted selector
            const priceText = selectedAddOnElement.querySelector('div:last-child p').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')); // Extract numerical value

            // Initialize total if not already done
            if (!selectedAddOns.total) {
                selectedAddOns.total = 0;
            }

            // Update selected add-ons
            if (event.target.checked) {
                selectedAddOns.addOns.push({
                    name: addOnText,
                    price: price
                });
                selectedAddOns.total += price;
            } else {
                const index = selectedAddOns.addOns.findIndex(addOn => addOn.name === addOnText);
                if (index > -1) {
                    selectedAddOns.total -= selectedAddOns.addOns[index].price;
                    selectedAddOns.addOns.splice(index, 1);
                }
            }

            selectedAddOns.type = planType;

            console.log('Selected Add-Ons in Container 4:', selectedAddOns);

            // Update container6 when add-ons are selected
            if (document.querySelector('.container6').classList.contains('active')) {
                updateContainer6();
            }
        });
    });

    // Function to update container6 with selected options
    function updateContainer6() {
        const container6 = document.querySelector('.container6');
        const selectedPlanText = `${selectedPlan.plan} (${selectedPlan.type === 'monthly' ? '$' + selectedPlan.price + '/mo' : '$' + selectedPlan.price + '/yr'})`;

        // Display selected plan
        container6.querySelector('.subscript .type').textContent = selectedPlanText;
        container6.querySelector('.subscript .amnt').textContent = `$${selectedPlan.price.toFixed(2)}`;

        // Display add-ons
        let onlineServicePrice = '';
        let largerStoragePrice = '';
        let customizableProfilePrice = ''; // Added this for the new add-on

        selectedAddOns.addOns.forEach(addOn => {
            if (addOn.name === 'Online service') {
                onlineServicePrice = `+$${addOn.price.toFixed(2)}`;
            } else if (addOn.name === 'Larger storage') {
                largerStoragePrice = `+$${addOn.price.toFixed(2)}`;
            } else if (addOn.name === 'Customizable Profile') {
                customizableProfilePrice = `+$${addOn.price.toFixed(2)}`;
            }
        });

        container6.querySelector('.onlSer .amnt1').textContent = onlineServicePrice;
        container6.querySelector('.larStor .amnt2').textContent = largerStoragePrice;
        container6.querySelector('.custPro .amnt3').textContent = customizableProfilePrice; // Added this for the new add-on

        // Display total
        container6.querySelector('.totalSel .total').textContent = `$${selectedAddOns.total.toFixed(2)}`;
    }
});