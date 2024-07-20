
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.toggle');

    toggles.forEach((toggle, index) => {
        const checkbox = toggle.querySelector('.toggle-checkbox');
        const label = toggle.querySelector('.toggle-label');

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                toggle.classList.remove('Default', 'Disabled');
                toggle.classList.add('Active', 'Enabled');
                console.log('Toggle is Active and Enabled');
            } else {
                toggle.classList.remove('Active', 'Disabled');
                toggle.classList.add('Default', 'Enabled');
                console.log('Toggle is Default and Enabled');
            }
        });

        // Initial state based on checkbox state
        if (checkbox.checked) {
            toggle.classList.add('Active', 'Enabled');
        } else {
            toggle.classList.add('Default', 'Enabled');
        }

        // Handling disabled state
        if (checkbox.disabled) {
            if (checkbox.checked) {
                toggle.classList.add('Active', 'Disabled');
                console.log('Toggle is Active and Disabled');
            } else {
                toggle.classList.add('Default', 'Disabled');
                console.log('Toggle is Default and Disabled');
            }
        }

        // Prevent label click when checkbox is disabled
        label.addEventListener('click', function(event) {
            if (checkbox.disabled) {
                event.preventDefault();
            }
        });
    });
});
