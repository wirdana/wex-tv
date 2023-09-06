videojs.Hls.xhr.beforeRequest = function(options) {
    /*
     * Modifications to requests that will affect every player.
     */
    
    let newUri = options.uri.includes('.ts') ? options.uri + "?q=testDePrueba": options.uri;
    
    return {
      ...options,
      uri : newUri
    };
  };
  
  
  
  let player = videojs("my-video", {}, () => {
  console.log("Inicio")
    
  
    player.one("loadedmetadata", () => {
      
      let calidades = player
        .tech({ IWillNotUseThisInPlugins: true })
        .hls.representations();
  
      crearBotonesCalidades({
        class: "item",
        calidades: calidades,
        father: player.controlBar.el_
      });
      
      player.play();
      
      // ---------------------------------------------- //
  
      function crearBotonAutoCalidad(params) {
        let button = document.createElement("div");
  
        button.id = "auto";
        button.innerText = `Auto`;
  
        button.classList.add("selected");
  
        if (params && params.class) button.classList.add(params.class);
  
        button.addEventListener("click", () => {
          removeSelected(params);
          button.classList.add("selected");
          calidades.map(calidad => calidad.enabled(true));
        });
        
        return button;
      }
  
      function crearBotonesCalidades(params) {
        
        let contentMenu = document.createElement('div');
        let menu = document.createElement('div');
        let icon = document.createElement('div');
  
        let fullscreen = params.father.querySelector('.vjs-fullscreen-control');
        contentMenu.appendChild(icon);      
        contentMenu.appendChild(menu);
        fullscreen.before(contentMenu);
        
        menu.classList.add('menu');
        icon.classList.add('icon','vjs-icon-cog');
        contentMenu.classList.add('contentMenu');
        
        let botonAuto = crearBotonAutoCalidad(params);
       
        menu.appendChild(botonAuto);
  
        calidades.sort((a, b) => {
          return a.height > b.height ? 1 : 0;
        });
  
        calidades.map(calidad => {
          let button = document.createElement("div");
  
          if (params && params.class) button.classList.add(params.class);
  
          button.id = `${calidad.height}`;
          button.innerText = calidad.height + "p";
  
          button.addEventListener("click", () => {
            resetCalidad(params);
            button.classList.add("selected");
            calidad.enabled(true);
          });
  
          menu.appendChild(button);
        });
  
        setInterval(() => {
          let auto = document.querySelector("#auto");
          current = player
            .tech({ IWillNotUseThisInPlugins: true })
            .hls.selectPlaylist().attributes.RESOLUTION.height;
          console.log(current);
  
          document.querySelector("#auto").innerHTML = auto.classList.contains(
            "selected"
          )
            ? `Auto <span class='current'>${current}p</span>`
            : "Auto";
        }, 1000);
        
  
      }
  
      function removeSelected(params) {
        document.querySelector("#auto").classList.remove("selected");
        [...document.querySelectorAll(`.${params.class}`)].map(calidad => {
          calidad.classList.remove("selected");
        });
      }
  
      function resetCalidad(params) {
        removeSelected(params);
  
        for (let calidad of params.calidades) {
          calidad.enabled(false);
        }
      }
    });
  });
  