(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const header = {
  template: `<p class="ps-3">Joel García</p>`
};
const bd = [
  {
    id: 3,
    nombre: "Mahou Cinco Estrellas",
    tipo: "Lager",
    origen: "Madrid",
    descripcion: "Cerveza rubia, suave y refrescante con un sabor ligeramente amargo.",
    imagen: "https://www.rentabilibar.es/img/productos/mahou-5-estrellas/botella-frente.png"
  },
  {
    id: 22,
    nombre: "Estrella Galicia",
    tipo: "Lager",
    origen: "Galicia",
    descripcion: "Cerveza suave y equilibrada con un sabor ligeramente amargo y aroma a malta.",
    imagen: "https://www.crusat.com/wp-content/uploads/2021/07/estrella-galicia-especial.png"
  },
  {
    id: 33,
    nombre: "Alhambra Reserva 1925",
    tipo: "Lager",
    origen: "Granada",
    descripcion: "Cerveza rubia con un sabor ligeramente dulce y toques de caramelo.",
    imagen: "https://sgfm.elcorteingles.es/SGFM/dctm/MEDIA03/202204/04/00118602800916____3__600x600.jpg"
  },
  {
    id: 34,
    nombre: "San Miguel Especial",
    tipo: "Lager",
    origen: "Barcelona",
    descripcion: "Cerveza rubia, suave y refrescante con un sabor ligeramente amargo.",
    imagen: "https://www.sanmiguel.com/es/wp-content/uploads/sites/2/2021/01/san-miguel-gluten-free-4.png"
  },
  {
    id: 35,
    nombre: "Damm Estrella",
    tipo: "Lager",
    origen: "Barcelona",
    descripcion: "Cerveza rubia, suave y refrescante con un sabor ligeramente amargo.",
    imagen: "https://static.damm.com/sites/default/files/config-page/estrella_header_logo/estrella-damm_0.png"
  }
];
const formulario = {
  template: `
    <div class="container mt-3 p-5 border shadow-lg ">
    <h1 class="text-center mb-5 ">----- Vista usuario -----</h1>
    <div class="row">
      
      <div class="col-6">
        <h3>Grupo</h3>
        <label for="nombreGrupo" class="label-control">Nombre del grupo:</label>
        <input id="nombreGrupo" type="text" class="form-control mt-2" placeholder ="Borrachos de DAW2">
        <label for="numeroMesa" class="label-control">Mesa numero</label>
        <input id="numeroMesa" type="number" class="form-control mt-2" placeholder ="0">
      
        <h3 class="mt-5">Haz tu pedido</h3>
        <div class="d-flex gap-3 ">
        
          <select id="cervezas" class="form-control">

    
          </select>
        
          <input id="cantidad" type="number" value="0" class="form-control">
        </div>
        <button id="pedido" type="submit" class="btn btn-success mt-4 w-100">¡Enviar pedido!</button>
      </div>
      <div class="col-6 border ">
        <div class="p-3 d-flex">

          <div id="muestraCerveza">

          </div>
          

        </div>
      </div>
     
    </div>
    

  </div>
              `,
  script: () => {
    let html = "";
    bd.forEach((element) => {
      html += `<option value="` + element.id + `">` + element.nombre + `</option>`;
      console.log("hola desde el option");
    });
    document.querySelector("#cervezas").innerHTML = html;
    let descripcion = ` <div class="pb-5">
                                <h3 id="nombre" class="pb-3">` + bd[0].nombre + `</h3>
                                <p id="descripcion">` + bd[0].descripcion + `</p>
                            </div>
                            <img src="` + bd[0].imagen + `" class="card-img-bottom w-25 img-fluid" alt="">
                            `;
    document.querySelector("#muestraCerveza").innerHTML = descripcion;
    const selectElement = document.querySelector("#cervezas");
    selectElement.addEventListener("change", (event) => {
      console.log("cerveza cambiada");
      let numero = parseInt(event.target.value);
      let seleccion = bd.find((cerveza) => cerveza.id === numero);
      if (seleccion) {
        descripcion = ` <div class="pb-5">
                                <h3 id="nombre" class="pb-3">${seleccion.nombre}</h3> 
                                <p id="descripcion">${seleccion.descripcion}</p>
                            </div>
                            <img src="${seleccion.imagen}" class="card-img-bottom w-25 img-fluid" alt="">
                            `;
        document.querySelector("#muestraCerveza").innerHTML = descripcion;
      } else {
        console.error("la cerveza no se encuentra");
      }
    });
  }
};
const tablaPedidos = {
  template: `<div id="tablaPedidos" class="container mt-5 mb-5 p-5 border shadow-lg ">
    <div class="row">
      <h1 class="text-center mb-5 ">----- Vista camareros -----</h1>
    <h3>Pedidos</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Grupo</th>
          <th>Mesa</th>
          <th>Cerveza</th>
          <th>Cantidad</th>
          <th>Estado</th>
        </tr>        
      </thead>
      <tbody id="cervecitas">
        <tr>
          <td>1</td>
          <td>Borrachos de DAW2</td>
          <td>1</td>
          <td>Estrella Galicia</td>
          <td>3</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btnEliminarPendientes pendiente btn btn-outline-warning w-100 btn-sm">Pedido pendiente...</button>
              <button class="pedido eliminar btn btn-outline-danger w-100 btn-sm"> 🗑 Borrar pedido</button>
            </div>
            
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Cabezones contentos</td>
          <td>1</td>
          <td>Estrella DAM</td>
          <td>2</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-success w-100 btn-sm">¡Pedido servido!</button>
              <button class="eliminar btn btn-outline-danger w-100 btn-sm"> 🗑 Borrar pedido</button>
            </div>       
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    
  </div>
            `,
  script: () => {
    let pedidos = [];
    let sumarid = 2;
    document.querySelector("#pedido").addEventListener("click", () => {
      const nombreGrupo = document.querySelector("#nombreGrupo").value;
      const numeroMesa = document.querySelector("#numeroMesa").value;
      const cantidad = document.querySelector("#cantidad").value;
      const seleccionar = document.querySelector("#cervezas");
      const cervezaSeleccionadaId = parseInt(seleccionar.value);
      const cervezaSeleccionada = bd.find((cerveza) => cerveza.id === cervezaSeleccionadaId);
      const nombreCerveza = cervezaSeleccionada.nombre;
      let tr = document.createElement("tr");
      tr.setAttribute("id", sumarid++);
      const inyectarTabla = `
            <tr>
                <td>${sumarid}</td>
                <td>${nombreGrupo}</td>
                <td>${numeroMesa}</td>
                <td>${nombreCerveza}</td>
                <td>${cantidad}</td>
                <td><button class="btnEliminarPendientes eliminar pendiente btn btn-outline-warning w-100 btn-sm">Pedido pendiente...</button></td>
                <td><button class="btn eliminar btn-outline-danger w-100 btn-sm"> 🗑 Borrar pedido</button></td>
            </tr>`;
      document.querySelector("tbody").innerHTML += inyectarTabla;
      pedidos.push({
        id: sumarid,
        grupo: nombreGrupo,
        mesa: numeroMesa,
        cerveza: nombreCerveza,
        cantidad,
        estado: "Pedido pendiente"
      });
      console.log("array de pedidos", pedidos);
    });
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("pendiente")) {
        const button = event.target;
        button.classList.remove("pendiente");
        button.classList.remove("btn-outline-warning");
        button.classList.add("btn-outline-success");
        button.classList.add("pedido");
        button.innerHTML = "¡Pedido servido!";
      }
    });
    document.querySelector("#cervecitas").addEventListener("click", (event) => {
      console.log("eliminando el pedido");
      const boton = event.target.closest(".eliminar");
      if (boton) {
        const fila = boton.closest("tr");
        if (fila) {
          fila.remove();
          console.log("pedidos borrados", pedido);
        }
      }
    });
  }
};
document.querySelector("header").innerHTML = header.template;
document.querySelector("main").innerHTML = formulario.template + tablaPedidos.template;
formulario.script();
tablaPedidos.script();
