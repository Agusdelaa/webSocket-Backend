const socket = io();

socket.on ("products", products => {
    console.log("soy robeto", products)
    const productsContainter = document.querySelector("#products-table")
    productsContainter.innerHTML = `
    <tr>
        <th>Id:</th>
        <th>Título:</th>
        <th>Descripción:</th>
        <th>Código:</th>
        <th>Precio:</th>
        <th>Estado:</th>
        <th>Stock:</th>
        <th>Categoría:</th>
        <th>Imágenes:</th>
    </tr>
    `
    products.forEach((product) => {
        productsContainter.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.statu}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
        </tr>
        `
    }) 
})

document.querySelector("#new-Product-add").addEventListener("submit", (event) => {
    event.preventDefault()

    socket.emit("new-Product", {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        statu: document.getElementById('status').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value,
        thumbnail: document.getElementById('thumbnail').value
    })
    event.target.reset();
});

document.querySelector("#delete-product").addEventListener("submit", (event) => {
    event.preventDefault()
    const necessaryId = document.querySelector("#id").value
    console.log(necessaryId)
    socket.emit("delete-product" ,necessaryId )
    event.target.reset();

})

socket.on('response', (response) => {
    if(response.status === 'success') {
        document.querySelector('#response-container').innerHTML = `<p class="success">${response.message}</p>`;
    } else {
        document.querySelector('#response-container').innerHTML = `<p class="error">${response.message}</p>`;
    }
});
