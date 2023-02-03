import { Permiso } from "../Clases/Permiso";
import { environment } from '../../environments/environment';

export class ConfiGlobal {
  
  // version 
  public static version : string ='1.23.5.1';
  
  // traducion label generales 
  public static lbl_NoHayDatos : string = 'No hay datos';

  // configuracion del diseño del terminal
  public static colorReadOnly: string = '#CACACA';
  public static colorValido: string =  '#66cc66';
  public static colorError: string = '#FB7C7C';
  public static colorFoco: string = '#d5f1f9';  //#7ebdfb'; // 7ebdfb
  public static colorGridRowLeido : string = '#ddfad2';     //usado para marcar lineas de un grid segun estado de un campo
  public static altoMinBotonesXS: number = 35;
  public static altoMaxBotonesXS: number = 50;

  public static principalValidando: boolean = false;

  // frm-login y canActivate
  public static autorizacion: boolean = false;

  public static Token: string = '';
  public static Usuario: number;
  public static NombreUsuario: string;
  public static sessionId: string;

  public static HttpTimeWait: number;
  public static Rec_GenerarPaletPorLinea: boolean = false;


  // frm-login y errores
  public static mensajeError: string;
  public static errorGuardado: number;

  // ==================== Conexión WebApi ====================
  // local
  // private static dominio = 'http://localhost';
  // private static dominio = 'http://192.168.1.129'; // IP Alejandro

  // JAT IP
  // private static dominio = 'http://192.168.200.69'; // ZEROTIER
  // private static dominio = 'http://192.168.10.234'; // OPENVPN esta
  // private static dominio = 'http://192.168.10.40';
  // private static dominio = 'http://192.168.10.158'; // Servidor Viletel
  // private static dominio = 'http://192.168.1.110'; // ALFRAN

  public static dominio: string = environment.dominio;

  // ARF IP
  // private static dominio = 'http://192.168.200.80';

  // DS IP
  // private static dominio = 'http://192.168.10.232';

  // private static puerto = '49220';
  // private static puerto = '49221';
  // private static puerto = '8081'; // IIS y Servidor
  // private static puerto = '9200'; // ALFRAN
  public static puerto: string = environment.puerto;

  public static URL: string = ConfiGlobal.dominio + ':' + ConfiGlobal.puerto;

  // EAN 128
  public static CharEAN128; // '%'
  public static PrefijosEAN128: Array<string> = [];

  // QR
  public static CharQR; // '@'
  public static PrefijosQR: Array<string> = [];

  // ConfiGrid
  public static SeparadorGrid: string; // '%;&_'

  // Array de Permisos para los botones
  public static Permisos: Array<Permiso> = new Array<Permiso>();

  public static WebSocket_IP: string;
  public static WebSocket_PORT: number;
  public static WebSocket_Enabled: boolean = false;

  public static LOG: Array<string> = new Array<string>();
}
