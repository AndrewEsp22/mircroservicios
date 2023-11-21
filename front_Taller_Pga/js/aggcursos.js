function saveDocente(cursosData) {
    $.ajax({
        url: 'http://localhost:8081/cursos',
        method: 'post',
        data: cursosData
    }).done((response) => {
        toastr.success('Curso guardado exitosamente');
        console.log('Curso guardado exitosamente:', response);
    }).fail((error) => {
        toastr.error('Error al guardar el Curso');
        console.error('Error al guardar el Curso:', error);
    });
}

$(document).ready(() => {
    let ocupaciones = [];
    let ids = [];

    $.ajax({
        url: 'http://localhost:8081/docentes',
        method: 'get'
    }).done((response) => {
        saveids(response);
        viewsteachers(ids);
    }).fail((fail) => {
        console.error(fail);
    });

    function saveids(docenteData) {
        docentes = docenteData.allowed;
        ids = docentes.map(item => item.id);
    }

    function obtenerNombreDocente(codDocente) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:8081/docentes/${codDocente}`,
                method: 'get',
                dataType: 'json',
                success: function (response) {
                    resolve(response.nombre);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    }

    function viewsteachers(ids) {
        let html = '';
        Promise.all(ids.map(id => obtenerNombreDocente(id)))
            .then(nombres => {
                html = '<option disabled selected>-Elige una opción-</option>';
                nombres.forEach((nombre, index) => {
                    html += '<option value="' + ids[index] + '">' + nombre + '</option>';
                });
                document.getElementById('codDocente').innerHTML = html;
            })
            .catch(error => {
                console.error('Error al obtener los nombres de las ocupaciones:', error);
            });
    }
    $('form').submit(function (event) {
        event.preventDefault();
        let cursosData = {
            id: $('#id').val(),
            nombre: $('#name').val(),
            codDocente: $('#codDocente').val()
        };
        saveDocente(cursosData);
    });
});

