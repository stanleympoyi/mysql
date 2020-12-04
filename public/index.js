document.getElementById('get-btn').addEventListener('click', loadText);


function loadText() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:4000/', true);
    xhr.onload = function() {
        if (this.status == 200) {
            var response = JSON.parse(this.responseText);

            document.getElementById('table').innerHTML = response;
        }
    }
    xhr.send();
}