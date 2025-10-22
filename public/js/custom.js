
function togglePassword() {
    // const input = document.getElementById('confirmPasswordInput');
    const input = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');
    if (input.type === "password") {
        input.type = "text";
        eyeIcon.innerHTML = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>`; // eye-off
    } else {
        input.type = "password";
        eyeIcon.innerHTML = `<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>`; // eye
    }
}

document.getElementById("togglePassword").addEventListener("click", togglePassword);

$(function () {
    $(document).on('click', '#delete', function (e) {
        e.preventDefault();
        var link = $(this).attr("href");


        Swal.fire({
            title: 'Are you sure?',
            text: "Delete This Data?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = link
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })


    });

});


// Confirm

$(function () {
    $(document).on('click', '#confirm', function (e) {
        e.preventDefault();
        var link = $(this).attr("href");


        Swal.fire({
            title: 'Are you sure to Confirm?',
            text: "Once Confirm, You will not be able to proceed back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Confirm!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = link
                Swal.fire(
                    'Confirm!',
                    'Confirm Changes',
                    'success'
                )
            }
        })


    });

});

// processing


$(function () {
    $(document).on('click', '#processing', function (e) {
        e.preventDefault();
        var link = $(this).attr("href");


        Swal.fire({
            title: 'Are you sure to Processing?',
            text: "Once Processing, You will not be able to proceed back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Processing!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = link
                Swal.fire(
                    'Processing!',
                    'Processing Changes',
                    'success'
                )
            }
        })


    });

});

//picked


$(function () {
    $(document).on('click', '#picked', function (e) {
        e.preventDefault();
        var link = $(this).attr("href");


        Swal.fire({
            title: 'Are you sure to Picked?',
            text: "Once Picked, You will not be able to proceed back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Picked!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = link
                Swal.fire(
                    'Picked!',
                    'Picked Changes',
                    'success'
                )
            }
        })


    });

});

// shipped


$(function () {
    $(document).on('click', '#shipped', function (e) {
        e.preventDefault();
        var link = $(this).attr("href");


        Swal.fire({
            title: 'Are you sure to shipped?',
            text: "Once shipped, You will not be able to proceed back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, shipped!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = link
                Swal.fire(
                    'shipped!',
                    'shipped Changes',
                    'success'
                )
            }
        })


    });

});

//delivered



$(function () {
    $(document).on('click', '#delivered', function (e) {
        e.preventDefault();
        var link = $(this).attr("href");


        Swal.fire({
            title: 'Are you sure to delivered?',
            text: "Once delivered, You will not be able to proceed back!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delivered!'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = link
                Swal.fire(
                    'delivered!',
                    'delivered Changes',
                    'success'
                )
            }
        })


    });

});
