const apiURL = window.location.origin + '/api';

function navigate(endpoint) {
    const url = window.location.origin + '/' + endpoint;
    console.log(url);
    window.location.href = url;
}