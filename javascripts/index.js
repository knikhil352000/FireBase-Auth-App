//setting up materialize components

document.addEventListener('DOMContentLoaded', function(){
    let modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    let items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
})