function actualizarCursos(CursosData, id) {
    $.ajax({
        url: 'http://localhost:8081/cursos/' + id,
        method: 'put',
        data: CursosData
    }).done((response) => {
        toastr.success('Curso Actualizado exitosamente');
        console.log('curso guardado exitosamente:', response);
    }).fail((fail) => {
        toastr.error('Error al guardar el curso');
        console.error('Error al guardar el curso:', error);
    });
}

$('form').submit(function (event) {
    event.preventDefault();
    const id = $('#id').val();
    let CursosData = {
        id: id,
        nombre: $('#name').val(),
        codDocente: $('#codDocente').val()
    };
    actualizarCursos(CursosData, id);
});

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    $.ajax({
        url: 'http://localhost:8081/cursos/' + id,
        method: 'get'
    }).done((response) => {
        const curso = response;
        document.getElementById('id').value = curso.id;
        document.getElementById('name').value = curso.nombre;
    }).fail((fail) => {
        console.error(fail);
    });
});

$(document).ready(() => {

    let docentes = [];
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

    function obtenerNombreDocente(codDocentes) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:8081/docentes/${codDocentes}`,
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
                console.error('Error al obtener los nombres de los docentes:', error);
            });
    }
});
