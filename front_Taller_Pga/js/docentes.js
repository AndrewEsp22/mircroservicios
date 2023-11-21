$(document).ready(() => {
    let docentes = [];
    loadDocentes();
});

function loadDocentes() {
    $.ajax({
        url: 'http://localhost:8081/docentes',
        method: 'get'
    }).done((response) => {
        docentes = response.allowed;
        let html = '';
        docentes.forEach(item => { 
            obtenerNombreOcupacion(item.idOcupacion, function(nombreOcupacion) {
                html += '<tr>';
                html += '<td>' + item.id + '</td>';
                html += '<td>' + item.nombre + '</td>';
                html += '<td>' + nombreOcupacion + '</td>';
                html += '<td> <a class="action-links" href="views/modificar.html?id=' + item.id + '">modificar</a></td>';
                html += '<td> <a class="delete-docente-btn action-links" data-id="' + item.id + '">eliminar</a></td>';
                html += '</tr>';
            document.getElementById('tdocentes').querySelector('tbody').innerHTML = html;
        });
        });
    }).fail((fail) => {
        console.error(fail); 
    });
}

function obtenerNombreOcupacion(idOcupacion, callback) {
    $.ajax({
        url: `http://localhost:8081/ocupaciones/${idOcupacion}`,
        method: 'get',
        dataType: 'json',
        success: function(response) {
            callback(response.nombre);
        },
    });
}
function checkIfDocenteIsAssigned(docenteId, callback) {
    $.ajax({
        url: 'http://localhost:8081/cursos',
        method: 'get',
        dataType: 'json',
        success: function(response) {
            let isAssigned = false;
            response.allowed.forEach(item => {
                if (item.codDocente === docenteId) {
                    isAssigned = true;
                }
            });
            callback(isAssigned);
        },
    });
}
function deleteDocente(id) {
    checkIfDocenteIsAssigned(id, function(isAssigned) {
        if (isAssigned) {
            toastr.error('No se puede eliminar el docente debido a que está asignado a un curso.');
        } else {
            $.ajax({
                url: 'http://localhost:8081/docentes/' + id,
                method: 'delete',
                success: function (response) {
                    toastr.success('Docente eliminado exitosamente.');
                    loadDocentes();
                },
                error: function (error) {
                    toastr.error('Error al eliminar el docente.');
                    console.error('Error al eliminar el docente:', error);
                }
            });
        }
    });
}

$(document).ready(() => {
    loadDocentes();
    $(document).on('click', '.delete-docente-btn', function () {
        let id = $(this).attr('data-id');
        deleteDocente(id);
    });
});