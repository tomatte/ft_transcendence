document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.toggle');

    toggles.forEach(toggle => {
        const checkbox = toggle.querySelector('.toggle-checkbox');

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                toggle.classList.remove('Default');
                toggle.classList.add('Active');
            } else {
                toggle.classList.remove('Active');
                toggle.classList.add('Default');
            }
        });

        // Initial state based on checkbox state
        if (checkbox.checked) {
            toggle.classList.add('Active');
        } else {
            toggle.classList.add('Default');
        }
    });
});



