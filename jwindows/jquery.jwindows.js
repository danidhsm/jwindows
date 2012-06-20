 /**
 * plugin para hacer ventanas de escritorio
 */



(function( $ ){
     
    jwindows_icons={"warning":"warning","error":"error","info":"info","question":"question"};
    
    var jwindows ={
        jwindow : [],
        jexecute : [],
        jtaskbar_application :[]
    };
            
  var methods = {
            
              application : function( options, callback ) {  
                  
            	//parametros del plugin
                var settings={
                       
                        titles        : "",    		//array de cada uno de los titulos de las ventanas["titulo1,titulo2"]
                        icons         : "",    		//array de cada uno de los iconos de las ventanas["/la/ruta.gif","/la/otra/ruta.gif"]
                        ejecutores    : "<div id='ejecutor'></div>",        //selector, clase, o id de donde se encuentran los ejecutores de cada ventana "#apli1"
                        srcs          : "",    		//si son un iframes, cada uno de los src ["http://google.es","http://mipagina.com"]
                        minimize      : true,    	//boton de minimizar true | false
                        maximize      : true,    	//boton de maximizar true | false
                        close         : true,    	//boton de cerrar true | false
                        iframeFix     : false,    	//atributo de draggable que no hace falta ya true | false
                        opacity       : 0.8,    	//opacidad de la ventana al ser movida
                        draggable     : true,    	//capacidad de movimiento true | false
                        resizable     : true,    	//capacidad de redimension true | false
                        statusbar     : true,    	//no se ...
                        taskbar       : "new",    	//capa que se utilizará como barra de tareas|new es para indicar que se genere una
                        minheight     : 10,        	//alto minimo de la ventana
                        minwidth      : 236,        	//ancho minimo de la ventana
                        maxwidth      : null,    	//ancho maximo de la ventana
                        handles       : 'all',    	//direcciones de redimensionamiento 'n,s,nw,ne,s,se,sw,all'
                        maxheight     : null,    	//maximo alto de la ventana
                        cursor        : "move",    	//cursor utilizado al mover
                        deleteContent : false,    	//si se borrará el contenido una vez se cierre la ventana
                        iframe        : true,    	//si el contenido de las ventanas son iframes
                        autoOpen      : false,    	//indica si se abrirá despues de generar la ventana
                        dblclick	  : false,		//indica si el ejecutor se activará con doble click en vez de un click
                        stun		  : false,		//bloquea las demas ventanas y deja activa la que lo lleva
                        center		  : false,		//posiciona la ventana en el medio
                        reload		  : true,		//indica si aparecerá el boton de recargar la pagina
                        position	  : '',		//indica la posicion donde aparecerá la ventana [right|left|top|bottom]
                        buttons       : {        	//listado de botones a los cuales se les podrá asignar una funcion
                            
                                        },
                        //eventos
                        //function(event,close){console.log($(this));console.log($(ventana));console.log($(close));}
                        //$(this) devuelve la ventana dentro de la funcion
                        onClose		  : function(event,close)	{return true;}, // justo antes de cerrarse la ventana 
                        onMinimize	  : function(event,minimize){return true;}, // Al minimizar la ventana
                        onMaximize	  : function(event,maximize){return true;}, // Al maximizar una ventana
                        onRestore	  : function(event,minimize){return true;}, // Al restaurar
                        onPrint		  : function(event,print)	{return true;}, // Antes de Imprimir
                        onDrag		  : function(event,ui)		{return true;}, // Mientras arrastramos
                        onResize	  : function(event,ui)		{return true;}, // Mientras redimensionas
                        onReload	  : function(event,reload)	{return true;}, // Antes de recargar
                        onActivate    : function(event)			{return true;}, // Al activar/seleccionar una ventana
                        onLoad		  : function(event)			{return true;}, // Al configurar la ventana(eventos, estructura, etc..).
                       
                };
                
                //mezclamos los parametros pasados al plugin con los valores por defecto
                if ( options ) {
                      $.extend( settings, options );
                }
               
                //cogemos el contenido de las ventanas
                ventanas=$(this);
                
                //cogemos los elementos que van a ejecutar cada una de las ventanas
                var ejecutores=$(settings.ejecutores);
                ejecutores.addClass("jwindows-execute");

                
                
                //revisamos la barra de herramientas
                switch(settings.taskbar){
                   
                    //se crea una nueva taskbar
                    case "new":
                        ventanas.parent().append('<div class="jwindows-taskbar"></div>');
                        taskbar=ventanas.parent().find('.jwindows-taskbar');
                        break;
                       
                    //se utiliza una taskbar ya creada
                    default:
                        taskbar=$(settings.taskbar);
                        taskbar.addClass('jwindows-taskbar');
                        break;
                }
                
                //variable que guardará el estado del boton minimizar todo
                allminimized=0;
                
                //vemos si esta el boton para minimizar todas las ventanas, si no existe lo creamos
                var minimizeall="";
                if(!taskbar.find('.jwindows-minimize-all').length){
                      minimizeall=$("<div class='jwindows-minimize-all'></div>").appendTo(taskbar);
                }
                else{
                    minimizeall=taskbar.find('.jwindows-minimize-all');
                }
             
                
                //menu contextual barra de tareas(optimizar ...)
                //if(!$('.jwindows-taskbar-context-menu-item').length){
                	
	                var cerrar=$('<li class="jwindows-taskbar-context-menu-item" id="jwindows-close-application">Cerrar</li>');
	               
	                var ul=$('<ul></ul>').html(cerrar);
	                var contextmenu=$('<div class="jwindows-taskbar-context-menu"></div>').html(ul).appendTo('body');
	                jq(document).click(function(e){  
	                    if(e.button == 0){  
	                        contextmenu.css("display","none");
	                    }  
	                });
                
	                taskbar.bind('contextmenu', function(e){
            
            		/*seleccionamos el target del boton derecho*/
            		var aplicacionselec=jq(e.target);

            		/*si no es una aplicacion buscamos la aplicacion que este por encima si tiene*/
            		if(!aplicacionselec.hasClass('jwindows-taskbar-application')){
            			aplicacionselec=aplicacionselec.parents('.jwindows-taskbar-application');
            		}

            		/*si es una aplicacion*/
            		if(aplicacionselec.hasClass('jwindows-taskbar-application')){
            			cerrar.unbind('click').removeClass('disabled');
            			
            			cerrar.click(function(){
            				aplicacionselec.jwindows('close');

            			});

            		}
            		else{
            			cerrar.unbind('click').addClass('disabled');
            		}

            		/*mostramos el menu contextual*/
            		contextmenu.css({'z-index':9999,'display':'block', 'left':e.pageX+10, 'top':e.pageY-contextmenu.height()});

            		return false;
            	});
                //} 
                //----------------------------
                
                minimizeall.hover(function(){
                		$('.jwindows-window:visible').css('opacity',0.5);
                	}
                	,function(){
                		$('.jwindows-window:visible').css('opacity',1);
                	}
                );
                
                //establecemos el evento del boton de minimizar todo
                minimizeall.unbind('click');
                minimizeall.click(function(){
                   
                    if(!allminimized){
                        opened=$('.jwindows-minimize:visible');
                        allminimized=1;
                    } else{
                        allminimized=0;
                    }
                    //miramos las ventanas abiertas y no se...
                    opened.each(function(){
                        $(this).parent().parent().click();
                        $(this).click();
                    });

                   
                });
                
                //a cada ventana le añadimos sus propios eventos y comportamientos
                return ventanas.each(function(indice) {
                    
                	//cogemos la ventana actual y establacemos su contenido
                    var ventana=$(this);
                    
                    //eventos
                    ventana.bind('onClose',settings.onClose);
                    ventana.bind('onMinimize',settings.onMinimize);
                    ventana.bind('onMaximize',settings.onMaximize);
                    ventana.bind('onRestore',settings.onRestore);
                    ventana.bind('onPrint',settings.onPrint);
                    ventana.bind('onReload',settings.onReload);
                    
                    
                    
                    var contenido=ventana.children();
                    ventana.addClass('jwindows-closed');
                    
                    //miramos el numero de ventanas creadas y añadimos al final de la variable global la actual
                    var key=jwindows.jexecute.length;
                    
                    jwindows.jwindow[key]=ventana;
                    jwindows.jexecute[key]=$(ejecutores[indice]);
                    
                    
                    //establecemos el modo de abrir la ventana
                    if(settings.dblclick){
                    	$(ejecutores[indice]).dblclick(function(){loadjwindows();});
                    }
                    else{
                    	$(ejecutores[indice]).click(function(){loadjwindows();});
                    }
                    
                    
                    function cargar(){
                		var load = $("<div class='jwindows-load' style='background: white url(\"call/fw/res/Scripts/JQuery/plugins/jwindows/v1.0/images/load.gif\") no-repeat center; width:100%;height: 100%;display: block;position: absolute;z-index: 1000;'></div>");
                		load.width(ventana.width()).height(ventana.height());
                		ventana.prepend(load);
                	}
                    
                    
                    
                    //cargador de la ventana
                    function loadjwindows(){
                        //paraiframes
                    	var event = jQuery.Event("onLoad");
                		ventana.trigger(event);
                		if(event.result || event.result==undefined){
	                    	if(settings.stun){
	                    		var stun=$('<div class="jwindows-stun"></div>').appendTo('body');
	                    		ventana.css('z-index','500');
	                    	}
	                    	
	                        if(ventana.hasClass('jwindows-closed')){
	                        
	                            ventana.addClass('jwindows-window');
	                            contenido.addClass("jwindows-content");
	                            //ventana.removeClass('jwindows-closed');
	                            $.each(settings.buttons, function(key){
	                                //if(settings.buttons.hasOwnProperty(key)){}
	                                
	                                $("<button class='jwindows-button'>"+key+"</button>").click(function(){
	                                    
	                                    
	                                    if(callback){
	                                        callback((settings.buttons[key])());
	                                    }else{
	                                        (settings.buttons[key])();
	                                    }
	                                    
	                                }).appendTo(contenido);
	                                
	                                
	                            });
	    
	                            
	                           if(settings.iframe){
	                        	  
	                        	cargar();
	                        	contenido.load(function(){
	                           		ventana.find('.jwindows-load').remove();
	                           		contenido.unbind('load');
	                           	});
	                        	   
	                            ventana.mousedown(function(){
	                                
	                                var mascara = $('<div class="jwindows-mask"></div>');
	
	
	                                var visibles=$('.jwindows-window:visible').prepend(mascara);
	                                var cont=0;
	                                $('.jwindows-mask').each(function(){
	                                    $(this).width($(visibles[cont]).width());
	                                    $(this).height($(visibles[cont]).height());
	                                    cont++;
	                                }).css({'position':'absolute','background':'trasparent'});
	                                     
	                            });
	                           }
	                           else{
	                        	   contenido.ready(function(){
	                              		ventana.find('.jwindows-load').remove();
	                              		contenido.unbind('load');
	                              	});
	                           }
	                            ventana.mouseup(function(){
	                                $('.jwindows-mask').remove();
	                            });
	                            
	                           
	                           
	                            if(settings.draggable){
	                                ventana.draggable({
	                                   
	                                    iframeFix:settings.iframeFix,
	                                    cancel:".jwindows-content,.jwindows-mmc",
	                                    opacity:settings.opacity,
	                                    stack:ventanas,
	                                    cursor:settings.cursor,
	                                    drag:function(e,ui){               
	                                        //ventana.click();
	                                    	var event = jQuery.Event("onDrag");
	                                		ventana.trigger(event,ui);
	                                    	if(event.result || event.result==undefined){
		                                        ventana.stop(true,true).removeClass('jwindows-maximized');
		                                       
		                                          if(ui.offset.top<0){
		                                              $(this).dblclick();
		                                          }
		                                          
		    
		                                          if(ui.offset.left<0){
		                                              //console.log("izquierda");
		                                          }else if(ui.offset.left+$(this).width()>$(window).width()){
		                                              //console.log("derecha");
		                                          }
		                                          return true;
	                                    	}
	                                    	return false;
	                                    	
	                                             
	                                    },
	                                       stop: function(e,ui){
	                                    	   if(ui.offset.top<0){
	                                               ventana.css({'top':'2px'});
	                                           }
	                                    	   ventana.click();
	                                       },
	                                       start:function(){ventana.click();
	                                       $('.jwindows-mask').remove();
	                                       $('.jwindows-window:visible').prepend('<div class="jwindows-mask"></div>');
	                                       $('.jwindows-mask').css({'position':'absolute','top':'0','left':'0','right':'0','bottom':'0','background':'transparent'});}
	                                   
	                                });
	                            }
	                           
	                            if(settings.resizable){
	                                ventana.resizable({
	    
	                                      minHeight:settings.minheight,
	                                      minWidth:settings.minwidth,
	                                      maxWidth:settings.maxwidth,
	                                      maxHeight:settings.maxheight,
	                                      handles:settings.handles,
	                                      start: function(){
	                                          
	                                          ventana.click();
	                                          $('.jwindows-mask').remove();
	                                          $('.jwindows-window:visible').prepend('<div class="jwindows-mask"></div>');
	                                          $('.jwindows-mask').css({'position':'absolute','top':'0','left':'0','right':'0','bottom':'0','background':'transparent'});
	                                      },
	                                      stop: function(){
	                                          $('.jwindows-mask').remove();
	                                      },
	                                      resize:function(e,ui){
	                                    	  var event = jQuery.Event("onResize");
	                                    	  ventana.trigger(event,ui);
	                                    	  if(event.result || event.result==undefined){
	                                    		  $(this).removeClass('jwindows-maximized');
	                                    		  return true;
	                                    	  }
	                                    	  return false;
	                                        }
	                                });
	                            }
	    
	                            ventana.prepend("<div class='jwindows-bh'></div>");
	                            var bh=ventana.find('.jwindows-bh');
	                            bh.prepend("<div class='jwindows-mmc'></div>").prepend("<div class='jwindows-title'></div>").prepend("<div class='jwindows-icon'></div>");
	                           
	                           
	                            var title=bh.find('.jwindows-title');
	                            if(settings.titles.length){    
	                                
	                                title.html(settings.titles[indice]);
	                            }
	                            
	                           
	                            var icon=bh.find('.jwindows-icon');
	                            if(settings.icons.length){
	                            	var iconoruta="";
	                                switch(settings.icons[indice])
	                                {
	                                	case "error":
	                                		iconoruta="call/fw/res/Scripts/JQuery/plugins/jwindows/v1.0/images/icon_error.png";
	                                		break;
	                                	case "warning":
	                                		iconoruta="call/fw/res/Scripts/JQuery/plugins/jwindows/v1.0/images/icon_warning.png";
	                                		break;
	                                	case "info": 
	                                		iconoruta="call/fw/res/Scripts/JQuery/plugins/jwindows/v1.0/images/icon_info.png";
	                                		break;
	                                	case "question":
	                                		iconoruta="call/fw/res/Scripts/JQuery/plugins/jwindows/v1.0/images/icon_question.png";
	                                		break;
	                                	default:
	                                		iconoruta=settings.icons[indice];
	                                		
	                                }
	                                icon.html("<img src='"+iconoruta+"' />");
	                            }
	    
	                            var mmc=bh.find('.jwindows-mmc');
	    
	    
	    
	                            var taskbaricon=icon.clone().addClass('jwindows-taskbar-icon').removeClass('jwindows-icon');
	                            var taskbartitle=title.clone().addClass('jwindows-taskbar-title').removeClass('jwindows-title');;
	    
	                            var taskbarapplication=$("<div class='jwindows-taskbar-application'></div>").addClass('jwindows-taskbar-closed').appendTo(taskbar);
	                            jwindows.jtaskbar_application[key]=taskbarapplication;
	                            taskbaricon.appendTo(taskbarapplication);
	                            taskbartitle.appendTo(taskbarapplication);
	                           
	                            if(settings.iframe){
		                            if(settings.reload){
		                            	
		                            	
		                            	
		                            	//document.getElementById(FrameID).contentDocument.location.reload(true);
		                            	var reload=$("<div class='jwindows-reload'></div>").appendTo(mmc);
		                            	contenido.load(function(){
	                            			
	                            			reload.attr('title',contenido.contents().get(0).location.href);
	                            		
	                            		});
		                            	reload.click(function(){
		                            		
		                            		var event = jQuery.Event("onReload");
	                                		ventana.trigger(event,reload);
	                                		
		                            		if(event.result || event.result==undefined){
			                            		cargar();
			                            		contenido.load(function(){
				                            		ventana.find('.jwindows-load').remove();
				                            		contenido.unbind('load');
				                            	});
			                            		
			                            		contenido.contents().get(0).location.href=contenido.contents().get(0).location.href+ventana.attr('id');
			                            		contenido[0].contentDocument.location.reload();
			                            		contenido.load(function(){
			                            			
			                            			reload.attr('title',contenido.contents().get(0).location.href);
			                            		
			                            		});
		                            		}
		                                });
		                            	
		
		
		                            }
	                        	}
	                            
	                            function imprimir(iframe,contenido)
	                            {
	                            	var tmp;
	                            	
	                            	/*var estilo=$('link').clone();
	
	                                estilo.each(function(){
	                                	$(this).attr('media',"print");
	                                });
	                                
	                                contenido.unbind();
	                                var c=contenido.prepend(estilo.wrap('<head>')).html();
	                                
	                                */
	                            	
	                            	if(iframe){
	                            		contenido[0].contentWindow.print();
	                            	}else{
		                                tmp = window.open(" ","Impresión");
		                                tmp.document.open();
		                                tmp.document.write(contenido.html());
		                                tmp.document.close();
		                                tmp.print();
		                                tmp.close();
	                            		//tmp=$('<iframe src="#aaa">'+contenido.html()+'</iframe>')[0];
	                            		//console.log(tmp);
	                            		//tmp.contentWindow.document;
	                            		//tmp.print();
	                            	}
	                            }
	                            
	                            if(settings.print){
	
	                            	var print=$("<div class='jwindows-print'></div>").appendTo(mmc);
	                            	
	                            	print.click(function(){
	                            		var event = jQuery.Event("onPrint");
	                            		ventana.trigger(event,print);
	                            		if(event.result || event.result==undefined){
	                            			if(settings.iframe){
	                            				imprimir(settings.iframe,ventana.find('.jwindows-content'));
	                            			}
	                            			else{
	                            				imprimir(settings.iframe,ventana.find('.jwindows-content'));
	                            			}
	                            		}
	                            		
	                                });
	
	                        	}
	    
	                            if(settings.minimize){
	                               
	                                var minimize=$("<div class='jwindows-minimize'></div>").appendTo(mmc);
	                                minimize.click(function(){
	                                	
	                                	if(ventana.is('.jwindows-minimized')){
	                                		var event = jQuery.Event("onRestore");
	                                	} else if(ventana.is('.jwindows-opened')){
	                                		var event = jQuery.Event("onMinimize");
	                                	}
	                                	ventana.trigger(event,minimize);
	                                	
	                                	if(event.result || event.result==undefined){
	                                		ventana.stop(true,true).slideToggle().toggleClass('jwindows-minimized jwindows-opened');    
	                                	}
	                                });
	                               
	                               
	                            }
	    
	                            
	                            taskbarapplication.click(function(){
	    
	                                if(ventana.hasClass('jwindows-opened') && !ventana.hasClass('jwindows-active')){
	                                    ventana.click();
	                                }
	                                else if(ventana.hasClass('jwindows-minimized')){
	                                    /*ventana.stop(true,true).slideToggle().toggleClass('jwindows-minimized jwindows-opened');
	                                    ventana.click();*/
	                                	minimize.click();
	                                }
	                                else{
	                                    if(settings.minimize){
	                                        minimize.click();
	                                    }
	                                }
	                               
	                            });
	                            
	                            
	                            
	                            
	                            if(settings.maximize){
	    
	                                //var maximize=$(document.createElement('div')).addClass('jwindows-maximize').appendTo(mmc);
	                                var maximize=$("<div class='jwindows-maximize'></div>").appendTo(mmc);
	    
	                                //maximizar y restaurar  con el boton
	                                maximize.click(function(){
	                                	var event = jQuery.Event("onMaximize");
                                    	ventana.trigger(event,maximize);
                                    	
                                    	if(event.result || event.result==undefined){
                                    		ventana.toggleClass('jwindows-maximized');
                                    	}
	                                });
	    
	                                //maximizado con doble click
	                                bh.dblclick(function(){
	    
	                                    maximize.click();
	    
	                                });
	                               
	                               
	                            }
	                           
	                            if(settings.close){
	                               
	                                var close=$("<div class='jwindows-close'></div>").appendTo(mmc);
	    
	                                close.click(function(){
	                                		
	                                		var event = jQuery.Event("onClose");
	
	                                    	ventana.trigger(event,close);
	                                    	
	                                    	if(event.result || event.result==undefined){
		                                        close.unbind('click');
		                                        ventana.unbind('click');
		                                        ventana.unbind('dblclick');
		                                        ventana.draggable('destroy');
		                                        ventana.resizable('destroy');
		                                        ventana.addClass('jwindows-closed');
		                                        if(settings.stun){
		                                        	stun.remove();
		                                		}
		                                        ventana.removeClass("jwindows-window jwindows-loaded jwindows-opened jwindows-active jwindows-maximized jwindows-minimized");
		                                        contenido.removeClass('jwindows-content');
		                                        if(settings.deleteContent){
		                                            ventana.remove();
		                                        }
		                                        taskbarapplication.remove();
		                                        bh.remove();
		                                        
		                                        //solo para iframes
		                                        if(settings.srcs.length){
		                                            contenido.attr('src','');
		                                        }
	                                    	}
	
	                                });
	                               
	                            }
	    
	    
	                            
	                            ventana.click(function(){
	                            	
	                            	var event = jQuery.Event("onActivate");
                                	ventana.trigger(event);
                                	
	                            	if(event.result || event.result==undefined){
		                            	var index=0;
		                                activa=$(this);
		                                taskbarapplication.addClass("jwindows-taskbar-active");
		                                taskbarapplication.siblings('.jwindows-taskbar-active').removeClass("jwindows-taskbar-active");
		                                
		                                
		                                $('.jwindows-active').removeClass('jwindows-active');
		                                activa.addClass("jwindows-active");
		                                
		                                
		                                $('.jwindows-window:visible').each(function(){
		                                    if(parseInt($(this).css('z-index'))>index){
		                                        index=parseInt($(this).css('z-index'));
		                                    }
		                                });
		                                if(settings.stun){
		                                	stun.css({'z-index':''+(index)});
		                                }
		                                index+=1;
		                                activa.css({'z-index':''+(index)});
	                            	}
	                               
	                            });
	    
	                            var enlaceiframe=settings.srcs[indice];
	                            if(settings.srcs.length){
	                            	/*var idjwindows='';
	                            	if(enlaceiframe.indexOf('?')){
	                            		idjwindows ='?';
	                            	} else {
	                            		idjwindows ='&';
	                            	}
	                            	idjwindows +='idjwindows='+ventana.attr('id');
	                                contenido.attr('src',enlaceiframe+idjwindows);*/
	                                contenido.attr('src',enlaceiframe);
	                                
	                            }
	                            if(ventana.hasClass('jwindows-closed')){
	                                ventana.addClass("jwindows-loaded jwindows-opened").removeClass('jwindows-closed');
	                                taskbarapplication.removeClass('jwindows-taskbar-closed');               
	                            }
	                            else if(ventana.hasClass('jwindows-minimized')){
	                                minimize.click();
	                            }
	
	                            
	                       }
	                        
	                       if(settings.center){
	                    	   ventana.css('top',$(window).height()/2-ventana.height()/2);
	                    	   ventana.css('left',$(window).width()/2-ventana.width()/2);
	                    	   if(ventana.offset().top<0){
	                    		   ventana.offset({top:2});
	                    	   }
	                       }else if(settings.position){
	                    	   var posicion = settings.position.split(',');
	                    	   
	                    	   $.each(posicion,function(key){
	                    		   if(posicion[key]=="left"){
	                    			   ventana.css('left',0);
	                    		   } else if(posicion[key]=="top"){
	                    			   ventana.css('top',0);
	                    		   } else if(posicion[key]=="right"){
	                    			   ventana.css('right',0);
	                    		   } else if(posicion[key]=="bottom"){
	                    			   ventana.css('bottom',0);
	                    		   }
	                    	   });
	                    	  
	                       }
	       
	                       ventana.click();
	                       /*$(document).ready(function(){
	                    	   load.remove();
	                       });*/
	                      
	                       //console.log(jwindows);
                    	}
                    }
                    if(settings.autoOpen){
                    	
                    	if(settings.dblclick){
                    		
                    		$(ejecutores[indice]).dblclick();
                    	}
                    	else{
                    		$(ejecutores[indice]).click();
                    	}
                        
                    }
           

                });
               
   
              },
              
              //dado el componente borra la ventana y sus componentes del array de ventanas
              clear : function(){
                  
                  var ventanas=$(this);
                  
                  ventanas.jwindows('close');
                  ventanas.jwindows('destroy');
                  
                  return ventanas.each(function(){
                      
                      var componente=$(this);
                      
                      var key=componente.jwindows('encontrar');
                              
                              
                          if(!jwindows.jwindow[key].hasClass('jwindows-closed')){
                        	  jwindows.jtaskbar_application[key].remove();
                          }
                          jwindows.jwindow[key].remove();
                          jwindows.jexecute[key].remove();
                          delete jwindows.jexecute[key];
                          delete jwindows.jtaskbar_application[key];
                          delete jwindows.jwindow[key];
   
                  });
                  
              },
              
              //elimina todos los eventos del componente/s dado/s
              destroy : function(){
                  
                  var ventanas=$(this);
                  
                  ventanas.jwindows('close');
                  
                  return ventanas.each(function(){
                      
                      var componente=$(this);
                      
                      var key=componente.jwindows('encontrar');
                      ////console.log(jwindows.jwindow[key]);
                      
                      ////console.log(jwindows.jexecute[key]);
                      
                      ////console.log(jwindows.jtaskbar_application[key]);
                      jwindows.jexecute[key].unbind();

      
                  });
                  
                  
              },
              
              //dado un componente de jwindows(ventana,icono de barra o ejecutor) encuentra la key del array de ventanas
              encontrar: function(){

                  var componente=$(this);
                  var pos=false;
            	  $.each(jwindows.jexecute,function(key){
                      
                     
                      if(componente.is(jwindows.jwindow[key])){  
                    	  pos= key;
                      }
                      if(componente.is(jwindows.jexecute[key])){
                    	  pos= key;
                      }
                      if(componente.is(jwindows.jtaskbar_application[key])){
                    	  pos= key;
                      }
                      
                  });
            	  
            	  
            	  return pos;

              },
              
            //cierra la ventana, como si se hubiese presionado el boton de cerrar
              close : function(){
                  
                  var jwindow_component=$(this);

                  
                  return jwindow_component.each(function(){
                      
                      var componente=$(this);
                      
                        
                      var key=componente.jwindows('encontrar');
                      if(!jwindows.jwindow[key].hasClass('jwindows-closed')){
                    	  jwindows.jwindow[key].find('.jwindows-close').click();
                      }
                      
                      
                      
                  });
                  
                  
              },
              showAll : function(){
                  
                  var jwindow_component=$(this);

                  
                  return jwindow_component.each(function(){
                      
                      var componente=$(this);
                      
                        
                      var key=componente.jwindows('encontrar');
                      if(!jwindows.jwindow[key].hasClass('jwindows-minimized')){
                    	  jwindows.jwindow[key].find('.jwindows-close').click();
                      }
                      
                      
                      
                  });
                  
                  
              },
              
              //devuelve la ventana superior al elemento dado
              windowParent : function(){
                  
                  var jwindow_content=$(this);

                  
                  var jwindow_window = jwindow_content.closest('.jwindows-window');
                  
                  
                  return jwindow_window;                     
                  
                  
              },
              
              
                      
            
              /*jq().jwindows('messageBox',{mensaje: "hola",taskbar:'.tmp_navegadoraplicaciones'},
                    function(r){
                            if(r){
                                alert("siii");
                            }else {
                                alert("ohhhhhhhh");
                            }                    
                        });*/
            
            messageBox : function( options, callback ) {
                
                var settings={
                      
                      
                      titulo        : "",
                      icono         : "",
                      ejecutor      : "<div id='ejecutor'></div>",
                      minimize      : false,
                      maximize      : false,
                      close         : true,
                      taskbar       : "new",
                      draggable     : true,
                      resizable     : false,
                      center		: true,
                      autoOpen      : true,    //indica si la ventana se autoejecuta al generarla
                      iframe        : false,
                      mensaje       : "",        //mensaje que se introducira en la ventana
                      deleteContent : true,
                      stun			: true
                       
                };
               
                if ( options ) {
                      $.extend( settings, options );
                }

               
                var ventana=$("<div class='jwindows-messageBox'><div><div class='jwindows-msg'>"+settings.mensaje+"</div></div></div>").appendTo("body");
                
                
                ventana.jwindows({

                    titles        	: [settings.titulo],
                    icons        	: [settings.icono],
                    ejecutores     	: settings.ejecutor,
                    minimize    	: settings.minimize,
                    maximize    	: settings.maximize,
                    close         	: settings.close,
                    taskbar       	: settings.taskbar,
                    draggable     	: settings.draggable,
                    resizable     	: settings.resizable,
                    iframe        	: settings.iframe,
                    center			: settings.center,
                    stun			: settings.stun,
                    deleteContent   : settings.deleteContent,
                    autoOpen        : settings.autoOpen,
                    buttons        	:{
                                    	aceptar     : function(){ventana.jwindows('close');return true;},
                                    	cancelar    : function(){ventana.jwindows('close');return false;}
                                
                                 	 }
                    
                
                },function(result) {
                    if( callback ) {callback(result);}}
                    
                );
                
                return ventana;
                
            },

            
            
            
           /* jq().jwindows('alert',{mensaje: "hola",taskbar:'.tmp_navegadoraplicaciones'},

                    function(r){
                        if(r){
                            alert("siii");
                        }else {
                            alert("ohhhhhhhh");
                        }                    
                    });*/
          alert : function( options, callback ) {
              
              var settings={
                      
                    
                    titulo      	: "",
                    icono           : "",
                    ejecutor        : "<div id='ejecutor'></div>",
                    minimize        : false,
                    maximize        : false,
                    close           : true,
                    taskbar         : "new",
                    draggable       : true,
                    center			: true,
                    resizable       : false,
                    autoOpen        : true,
                    iframe          : false,
                    mensaje         : "",
                    deleteContent   : true,
                    stun			: true
                     
              };
             
              if ( options ) {
                    $.extend( settings, options );
              }
              
              
             
              var ventana=$("<div  class='jwindows-alert'><div><div class='jwindows-msg'>"+settings.mensaje+"</div></div></div>").appendTo("body");
              
              
              ventana.jwindows({
                  
                  titles        : [settings.titulo],
                  icons        	: [settings.icono],
                  ejecutores    : settings.ejecutor,
                  minimize   	: settings.minimize,
                  maximize    	: settings.maximize,
                  close        	: settings.close,
                  taskbar       : settings.taskbar,
                  draggable    	: settings.draggable,
                  resizable    	: settings.resizable,
                  iframe        : settings.iframe,
                  center		: settings.center,
                  deleteContent : settings.deleteContent,
                  stun			: settings.stun,
                  autoOpen      : settings.autoOpen,
                  buttons       :{
                                  	ok		: function(){ventana.find('.jwindows-close').click();ventana.remove();return true;}
                               	 }
                  
              
              },function(result) {
                    if( callback ) callback(result);}
                    
              );
              
              return ventana;
              
          },
          
          
          /*jq().jwindows('notification',{mensaje: "hola",taskbar:'.tmp_navegadoraplicaciones'});*/
          notification : function( options, callback ) {
                  
                  var settings={
                          
                        
                        titulo      	: "",
                        icono           : "",
                        ejecutor        : "<div id='ejecutor'></div>",
                        minimize        : false,
                        maximize        : false,
                        close           : true,
                        taskbar         : "new",
                        draggable       : false,
                        resizable       : false,
                        autoOpen        : true,
                        iframe          : false,
                        mensaje         : "",
                        position		: '',
                        deleteContent   : true,
                        time            : 4000        //tiempo que estará el mensaje en pantalla
                         
                  };
                 
                  if ( options ) {
                        $.extend( settings, options );
                  }
                 
                  var ventana=$("<div class='jwindows-notification'><div><div class='jwindows-msg'>"+settings.mensaje+"</div></div></div>").appendTo("body");
                  
                  
                  ventana.jwindows({
                      
                      titles     	: [settings.titulo],
                      icons        	: [settings.icono],
                      ejecutores    : settings.ejecutor,
                      minimize    	: settings.minimize,
                      maximize    	: settings.maximize,
                      close        	: settings.close,
                      taskbar       : settings.taskbar,
                      draggable    	: settings.draggable,
                      resizable    	: settings.resizable,
                      iframe        : settings.iframe,
                      deleteContent : settings.deleteContent,
                      autoOpen      : settings.autoOpen,
                      position		: settings.position
                      
                  
                  });                
                  setTimeout(function(){ventana.slideUp('slow',function(){ventana.jwindows('close');});},settings.time);
                  
                  return ventana;
                  
              },
              
              prompt : function( options, callback ) {
                  
                  var settings={
                        
                        
                        titulo        	: "",
                        icono       	: "",
                        ejecutor        : "<div id='ejecutor'></div>",
                        minimize      	: false,
                        maximize      	: false,
                        close         	: true,
                        taskbar    		: "new",
                        draggable     	: true,
                        resizable     	: false,
                        autoOpen        : true,    //indica si la ventana se autoejecuta al generarla
                        iframe        	: false,
                        mensaje        	: "",        //mensaje que se introducira en la ventana
                        deleteContent   : true,
                        center			: true,
                        stun			: true
                         
                  };
                 
                  if ( options ) {
                        $.extend( settings, options );
                  }

                 
                  var ventana=$("<div class='jwindows-prompt'><div><div class='jwindows-msg'>"+settings.mensaje+"</div><input type='text' id='jwindows-respuesta' /></div></div>").appendTo("body");
                  
                  
                  ventana.jwindows({

                      titles     	: [settings.titulo],
                      icons        	: [settings.icono],
                      ejecutores    : settings.ejecutor,
                      minimize    	: settings.minimize,
                      maximize    	: settings.maximize,
                      close        	: settings.close,
                      taskbar       : settings.taskbar,
                      draggable    	: settings.draggable,
                      resizable    	: settings.resizable,
                      center		: settings.center,
                      iframe        : settings.iframe,
                      stun			: settings.stun,
                      deleteContent : settings.deleteContent,
                      autoOpen      : settings.autoOpen,
                      buttons       :{
                                      	ok		: function(){respuesta=$('#jwindows-respuesta').val();ventana.jwindows('close');return respuesta;}                                  
                                   	 }
                      
                  
                  },function(result) {
                      if( callback ) {callback(result);}}
                      
                  );
                  
                  return ventana;
                  
              }
          
        };
 
  		
 
 
 
          $.fn.jwindows = function( method ) {
            
            // Method calling logic
            if ( methods[method] ) {
              return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            } else if ( typeof method === 'object' || ! method ) {
              return methods.application.apply( this, arguments );
            } else {
              $.error( 'El metodo ' +  method + ' no existe en jQuery.jwindows' );
            }    
          
          };
          
         
})( jQuery ); 



