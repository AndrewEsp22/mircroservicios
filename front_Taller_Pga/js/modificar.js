function actualizarDocente(docenteData, id) {
    $.ajax({
        url: 'http://localhost:8081/docentes/' + id,
        method: 'put',
        data: docenteData
    }).done((response) => {
        toastr.success('Docente Actualizado exitosamente');
        console.log('Docente guardado exitosamente:', response);
    }).fail((fail) => {
        toastr.error('Error al guardar el docente');
        console.error('Error al guardar el docente:', error);
    });
}

$('form').submit(function (event) {
    event.preventDefault();
    const id = $('#id').val();
    let docenteData = {
        id: id,
        nombre: $('#name').val(),
        idOcupacion: $('#idOcu').val()
    };
    actualizarDocente(docenteData, id);
});

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    $.ajax({
        url: 'http://localhost:8081/docentes/' + id,
        method: 'get'
    }).done((response) => {
        const docente = response;
        document.getElementById('id').value = docente.id;
        document.getElementById('name').value = docente.nombre;
    }).fail((fail) => {
        console.error(fail);
    });
});

$(document).ready(() => {

    let ocupaciones = [];
    let ids = [];

    $.ajax({
        url: 'http://localhost:8081/ocupaciones',
        method: 'get'
    }).done((response) => {
        saveids(response);
        viewsteachers(ids);
    }).fail((fail) => {
        console.error(fail);
    });

    function saveids(ocupacionesData) {
        ocupaciones = ocupacionesData.allowed;
        ids = ocupaciones.map(item => item.id);
    }

    function obtenerNombreOcupacion(idOcupacion) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:8081/ocupaciones/${idOcupacion}`,
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
        Promise.all(ids.map(id => obtenerNombreOcupacion(id)))
            .then(nombres => {
                html = '<option disabled selected>-Elige una opción-</option>';
                nombres.forEach((nombre, index) => {
                    html += '<option value="' + ids[index] + '">' + nombre + '</option>';
                });
                document.getElementById('idOcu').innerHTML = html;
            })
            .catch(error => {
                console.error('Error al obtener los nombres de las ocupaciones:', error);
            });
    }
});
