$(document).ready(() => {
    let cursos = [];
    loadCursos();
});

function loadCursos() {
    $.ajax({
        url: 'http://localhost:8081/cursos',
        method: 'get'
    }).done((response) => {
        cursos = response.allowed;
        let html = '';
        cursos.forEach(item => { 
            obtenerNombreDocente(item.codDocente, function(nombreDocente) {
                html += '<tr>';
                html += '<td>' + item.id + '</td>';
                html += '<td>' + item.nombre + '</td>';
                html += '<td>' + nombreDocente + '</td>';
                html += '<td> <a class="action-links" href="modificarcursos.html?id=' + item.id + '">modificar</a></td>';
                html += '<td> <a class="delete-docente-btn action-links" data-id="' + item.id + '">eliminar</a></td>';
                html += '</tr>';
            document.getElementById('data-table').querySelector('tbody').innerHTML = html;
        });
        });
    }).fail((fail) => {
        console.error(fail); 
    });
}


function obtenerNombreDocente(codDocente, callback) {
    $.ajax({
        url: `http://localhost:8081/docentes/${codDocente}`,
        method: 'get',
        dataType: 'json',
        success: function(response) {
            callback(response.nombre);
        },
    });
}

function deleteCursos(id) {
    $.ajax({
        url: 'http://localhost:8081/cursos/' + id,
        method: 'delete',
        success: function (response) {
            toastr.success('curso eliminado exitosamente.');
            loadDocentes();
        },
        error: function (error) {
            toastr.error('Error al eliminar el curso.');
            console.error('Error al eliminar el docente:', error);
        }
    });
}

$(document).ready(() => {
    loadCursos();
    $(document).on('click', '.delete-docente-btn', function () {
        let id = $(this).attr('data-id');
        deleteCursos(id);
    });
});