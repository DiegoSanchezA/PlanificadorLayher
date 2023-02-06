import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AfterContentChecked } from '@angular/core';
import { CmpDataGridComponent } from '../../Componentes/cmp-data-grid/cmp-data-grid.component';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { ColumnDataGrid } from '../../Clases/ColumnDataGrid';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { DataGridConfig } from '../../Clases/DataGridConfig';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { Utilidades } from '../../Utilidades/Utilidades';
import { BotonPantalla } from '../../Clases/BotonPantalla';
import { BotonIcono } from '../../Clases/BotonIcono';

@Component({
  selector: 'app-frm-cargar-oferta',
  templateUrl: './frm-cargar-oferta.component.html',
  styleUrls: ['./frm-cargar-oferta.component.css']
})
export class FrmCargarOfertaComponent implements OnInit, AfterViewInit, AfterContentChecked {
  altoBtnFooter = '45px';
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  @ViewChild('dgArticulos', { static: false }) dgArticulos: CmpDataGridComponent;
  @ViewChild('dgUnidades', { static: false }) dgUnidades: CmpDataGridComponent;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: 'Salir', posicion: 1, accion: () => { }, tipo: TipoBoton.danger, activo: true, visible: true },
    { icono: '', texto: 'Limpiar', posicion: 2, accion: () => { }, tipo: TipoBoton.secondary, activo: true, visible: true },
  ];

  idOferta_mostrar: string = null;
  fechaAlta_mostrar: string;
  hasta_mostrar: string;
  fechaFin_mostrar: string;
  fechaInicio_mostrar: string;
  cliente_mostrar: string;
  estado_mostrar: string;

  oOfertaSeleccionada: oOferta;
  arrayArts: Array<oArticulo> = [];
  arrayCabeceras: Array<oOferta> = [];
  arrayUnidadesOfertas = [];

  alturaDiv: string = '0px';

  colsArts: Array<ColumnDataGrid> = [
    {
      dataField: 'IdLinea',
      caption: 'Id Línea',
      cssClass: 'blanco',
      visible: false
    },
    {
      dataField: 'IdOferta',
      caption: 'Id Oferta',
      cssClass: 'blanco',
      visible: false
    },
    {
      dataField: 'IdArticulo',
      caption: 'Id Artículo',
      cssClass: 'blanco'
    },
    {
      dataField: 'ArticuloNombre',
      caption: 'Nombre Artículo',
      cssClass: 'blanco'
    },
    {
      dataField: 'CantidadDisponible',
      caption: 'Cantidad Disponible',
      cssClass: 'blanco'
    },
    {
      dataField: 'CantidadPedida',
      caption: 'Cantidad Pedida',
      cssClass: 'blanco'
    },
    {
      dataField: 'CantidadReservada',
      caption: 'Cantidad Reservada',
      cssClass: 'blanco'
    },
    {
      dataField: 'FechaActualizacion',
      caption: 'Fecha Actualización',
      cssClass: 'blanco',
      visible: false
    }
  ];

  colsUnidades: Array<ColumnDataGrid> = [];

  dgConfigArticulos: DataGridConfig = new DataGridConfig(null, this.colsArts, 100, '');
  dgConfigUnidades: DataGridConfig = new DataGridConfig(null, this.colsUnidades, 100, '');

  WSEnvioCsv_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  // Indica si está entrando de 0 en la pantalla
  primeraVez: boolean = true;

  constructor(
    private renderer: Renderer2,
    private location: Location,
    public translate: TranslateService,
    public planificadorService: PlanificadorService,
  ) {
    // se añaden las acciones a lo botones
    this.btnAciones.forEach((a, b, c) => {
      if (a.posicion === 1) {
        a.accion = () => {
          this.location.back();
        };
      }
      if (a.posicion === 2) {
        a.accion = () => {
          this.limpiarControles();
        };
      }
    });

    this.ConstructorPantalla();
  }

  ngOnInit(): void {
    this.getPlanificacion();
  }

  // para actualizar la altura de btnFooter
  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // Actualizar altura del grid
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima) - 210);
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));
    
    this.alturaDiv = '210px';
  }

  // añadir los nombres traducidos a los botones
  ngAfterContentChecked(): void {
    this.btnAciones.forEach((a, b, c) => {
      if (a.posicion === 1) {
        a.texto = this.traducir('frm-reubicacion.btnSalir', 'Salir');
      }
    });
  }

  ConstructorPantalla() {
  }

  onResize(event) {
    this.alturaDiv = '0px';
    // this.mostrarEspacio = false;

    Utilidades.BtnFooterUpdate(
      this.pantalla,
      this.container,
      this.btnFooter,
      this.btnAciones,
      this.renderer
    );

    // Actualizar altura del grid
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima));
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));
    
    this.alturaDiv = '210px';
  }

  async getPlanificacion(){
    if(this.WSEnvioCsv_Validando) return;

    this.limpiarControles();

    this.WSEnvioCsv_Validando = true;
    (await this.planificadorService.getPlanificacion('EV_103+PODIUM')).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSEnvioCsv_Valido = true;
          console.log(datos);

          this.oOfertaSeleccionada = datos.datos.Oferta[0];
          this.idOferta_mostrar = this.oOfertaSeleccionada.IdOferta;
          this.fechaAlta_mostrar = this.oOfertaSeleccionada.FechaAlta;
          this.fechaFin_mostrar = this.oOfertaSeleccionada.FechaFin;
          this.fechaInicio_mostrar = this.oOfertaSeleccionada.FechaInicio;
          this.cliente_mostrar = this.oOfertaSeleccionada.Cliente;
          this.estado_mostrar = this.oOfertaSeleccionada.Estado;

          this.arrayArts = datos.datos.LineasOferta;
          this.arrayCabeceras = datos.datos.OfertasRel;
          this.arrayUnidadesOfertas = datos.datos.LineasOfertasRel;

          // Se configura el grid de artículos
          this.dgConfigArticulos = new DataGridConfig(this.arrayArts, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigArticulos.actualizarConfig(true,false,'standard');
          
          // Se configura el grid de las unidades
          let nroCol: number = 0;
          this.arrayCabeceras.forEach(c => {
            let newCol: ColumnDataGrid = {
              dataField: c.Cliente,
              caption: c.Cliente,
              cssClass: 'grisClaro',
              columns: [{
                dataField: c.Contrato,
                caption: c.Contrato,
                cssClass: 'gris',
                columns: [{
                  dataField: c.Obra,
                  caption: c.Obra,
                  cssClass: 'blanco',
                  columns: [{
                    dataField: c.Observaciones,
                    caption: c.Observaciones,
                    cssClass: 'blanco',
                    columns: [{
                      dataField: c.FechaInicio,
                      caption: c.FechaInicio,
                      cssClass: 'fecha',
                      columns: [{
                        dataField: c.FechaFin,
                        caption: c.FechaFin,
                        cssClass: 'fechaRoja',
                        columns: [{
                          dataField: c.Estado,
                          caption: c.Estado,
                          cssClass: 'rojoClaro',
                          columns: [{
                            dataField: 'C' + nroCol.toString(),
                            caption: 'Unidades',
                            cssClass: 'gris',
                            allowSorting: false
                          }]
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }
            
            this.colsUnidades.push(newCol);

            nroCol++;
          });
          this.dgConfigUnidades = new DataGridConfig(this.arrayUnidadesOfertas, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigUnidades.actualizarConfig(true,false,'standard');
        } else {
          this.WSEnvioCsv_Valido = false;
        }
        this.WSEnvioCsv_Validando = false;
      }, error => {
        this.WSEnvioCsv_Validando = false;
        console.log(error);
      }
    );
  }

  public async onContentReady_DataGridArticulos(): Promise<void> {
    if(this.primeraVez) {
      await Utilidades.delay(100);
      this.primeraVez = false;
    }

    let scrollable = this.dgArticulos.getScrollable();
    scrollable.on("scroll", () => {
      let scrollArticulos = this.dgArticulos.getScroll();
      if(scrollArticulos !== this.dgUnidades.getScroll())
        this.dgUnidades.setScroll(scrollArticulos);
    });

    // Se obtienen todos los optionColumn de cada columna
    const allColumns = Array.from(Array(this.dgArticulos.DataGrid.instance.columnCount()).keys()).map(index => this.dgArticulos.DataGrid.instance.columnOption(index));
    let columnOptionSorted = allColumns.find(col => !Utilidades.isEmpty(col.sortIndex));

    if(Utilidades.isEmpty(columnOptionSorted)) return;

    // Dependiendo de la columna en la que se ha ordenado se aplica al arrayArts
    switch (columnOptionSorted.dataField) {
      case 'IdArticulo':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            a.IdArticulo.localeCompare(b.IdArticulo, 'en', { numeric: true })
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.IdArticulo.localeCompare(a.IdArticulo, 'en', { numeric: true })
          );
        }

        break;
      case 'ArticuloNombre':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            a.ArticuloNombre.localeCompare(b.ArticuloNombre, 'en', { numeric: true })
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.ArticuloNombre.localeCompare(a.ArticuloNombre, 'en', { numeric: true })
          );
        }

        break;
      case 'CantidadDisponible':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            a.CantidadDisponible - b.CantidadDisponible
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.CantidadDisponible - a.CantidadDisponible
          );
        }

        break;
      case 'CantidadPedida':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            b.CantidadPedida - a.CantidadPedida
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.CantidadPedida - a.CantidadPedida
          );
        }

        break;
      case 'CantidadReservada':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            b.CantidadReservada - a.CantidadReservada
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.CantidadReservada - a.CantidadReservada
          );
        }

        break;
      default:
        break;
    }

    this.dgConfigUnidades = new DataGridConfig(this.arrayUnidadesOfertas, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigUnidades.actualizarConfig(true,false,'standard');
  }

  public async onContentReady_DataGridUnidades(): Promise<void> {
    if(this.primeraVez) {
      await Utilidades.delay(100);
      this.primeraVez = false;
    }

    let scrollable = this.dgUnidades.getScrollable();
    scrollable.on("scroll", () => {
      let scrollUnidades = this.dgUnidades.getScroll();
      if(scrollUnidades !== this.dgArticulos.getScroll())
        this.dgArticulos.setScroll(scrollUnidades);
    });
  }

  public async onFocusedRowChanged_DataGridArticulos(e): Promise<void> {
    // await Utilidades.delay(100);
    let selectedRowIndex = e.row.rowIndex;
    // Se selecciona y se le pasa el foco a la misma línea seleccionada pero en dgUnidades
    this.dgUnidades.DataGrid.instance.selectRowsByIndexes(selectedRowIndex);
    this.dgUnidades.DataGrid.focusedRowIndex = selectedRowIndex;
  }

  public async onFocusedRowChanged_DataGridUnidades(e): Promise<void>{
    // await Utilidades.delay(100);
    let selectedRowIndex = e.row.rowIndex
    // Se selecciona y se le pasa el foco a la misma línea seleccionada pero en dgArticulos
    this.dgArticulos.DataGrid.instance.selectRowsByIndexes(selectedRowIndex);
    this.dgArticulos.DataGrid.focusedRowIndex = selectedRowIndex;
  }

  public limpiarControles() {
    this.arrayArts = null;
    this.arrayUnidadesOfertas = null;
    this.arrayCabeceras = null;
    this.oOfertaSeleccionada = null;

    this.colsUnidades = [];

    this.dgConfigArticulos = new DataGridConfig(null, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigUnidades = new DataGridConfig(null, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
  }

  LPGen(value : boolean) {
    Utilidades.VerLPGenerico(value);
    return value;
  }

  traducir(key: string, def: string): string {
    let traduccion: string = this.translate.instant(key);
    if (traduccion !== key) {
      return traduccion;
    } else {
      return def;
    }
  }
}

export class oOferta {
  IdOferta: string;
  IdAlmacen: number;
  IdEstado: number;
  Almacen: string;
  Cliente: string;
  Contrato: string;
  Estado: string;
  FechaAlta: string;
  FechaFin: string;
  FechaInicio: string;
  NumLineas: number;
  Obra: string;
  Observaciones: string;
  Referencia: string;
}

export class oArticulo {
  IdLinea: number;
  IdOferta: number;
  IdArticulo: string;
  ArticuloNombre: string;
  CantidadDisponible: number;
  CantidadPedida: number;
  CantidadReservada: number;
  FechaActualizacion: Date;
}

export class oUnidadesOferta {

}