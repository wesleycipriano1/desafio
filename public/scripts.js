
function confirmarExclusao(url) {
    var confirmacao = confirm("Tem certeza que deseja excluir?");
    if (confirmacao) {
        window.location.href = url;
    }
}

