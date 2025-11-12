import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SubcategoriaService } from "../../../services/subcategorias.service";
import { HttpClient } from "@angular/common/http";
import Swal from 'sweetalert2';
import { environment } from "../../../../environments/environments"; 


@Component({
  selector: 'app-subcategorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategorias.component.html',
  // CAMBIO: Asegúrate que la ruta a tu CSS sea correcta (usando .css)
  styleUrl: './subcategorias.component.scss'
})
export class SubcategoriasComponent implements OnInit {
  subcategorias: any[] = [];
  categorias: any[] = [];

  nueva: {
    id: number | null;
    nombre: string;
    categoria_id: number;
  } = {
    id: null,
    nombre: '',
    categoria_id: 0
  };

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private subcategoriaService: SubcategoriaService
  ) {}

  ngOnInit(): void {
    this.listar();
    
    this.http.get(`${this.apiUrl}/categorias`).subscribe((res: any) => {
      this.categorias = res;
    });
  }

  listar() {
    this.subcategoriaService.listar().subscribe((res) => {
      this.subcategorias = res;
    });
  }

  guardar() {
    const dto = {
      nombre: this.nueva.nombre,
      categoria_id: +this.nueva.categoria_id
    };
  
    if (this.nueva.id === null) {
      // Crear
      this.subcategoriaService.crear(dto).subscribe(() => {
        this.reset();
        this.listar();
        
        // --- CAMBIO: Alerta de éxito "bonita" ---
        Swal.fire({
          icon: 'success',
          title: 'Subcategoría Creada',
          text: 'La subcategoría fue registrada correctamente.',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          background: '#fff',
          iconColor: 'fuchsia',
          color: '#5a3a7d'
        });
        // --- FIN DEL CAMBIO ---
      });
    } else {
      // Actualizar
      this.subcategoriaService.actualizar(this.nueva.id, dto).subscribe(() => {
        this.reset();
        this.listar();

        // --- CAMBIO: Alerta de éxito "bonita" ---
        Swal.fire({
          icon: 'success',
          title: 'Subcategoría Actualizada',
          text: 'Los cambios se guardaron correctamente.',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          background: '#fff',
          iconColor: 'fuchsia',
          color: '#5a3a7d'
        });
        // --- FIN DEL CAMBIO ---
      });
    }
  }

  editar(sub: any) {
    this.nueva = {
      id: sub.id,
      nombre: sub.nombre,
      categoria_id: sub.categoria?.id ?? 0
    };
  }

  eliminar(id: number) {
    // --- CAMBIO: Alerta de confirmación "bonita" ---
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la subcategoría permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      
      // Colores de botones de marca
      confirmButtonText: 'Sí, eliminar',
      confirmButtonColor: '#B71C1C', // Rojo de eliminar
      
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#aaa',

      // Estilos de fondo y texto
      background: '#fff',
      color: '#5a3a7d'
      
    }).then((result) => {
      if (result.isConfirmed) {
        this.subcategoriaService.eliminar(id).subscribe(() => {
          this.listar();
          
          // --- CAMBIO: Alerta de "Eliminado" "bonita" ---
          Swal.fire({
            title: 'Eliminado',
            text: 'La subcategoría ha sido eliminada.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            background: '#fff',
            iconColor: 'fuchsia',
            color: '#5a3a7d'
          });
          // --- FIN DEL CAMBIO ---
        });
      }
    });
    // --- FIN DEL CAMBIO ---
  }

  reset() {
    this.nueva = {
      id: null,
      nombre: '',
      categoria_id: 0
    };
  }
}