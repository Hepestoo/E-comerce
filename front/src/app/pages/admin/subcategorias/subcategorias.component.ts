import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SubcategoriaService } from "../../../services/subcategorias.service";
import { HttpClient } from "@angular/common/http";
import Swal from 'sweetalert2';

// --- PASO 1: Importa el environment ---
// Asumo 5 niveles (subcategorias -> admin -> pages -> app -> src)
import { environment } from "../../../../environments/environments"; 


@Component({
  selector: 'app-subcategorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subcategorias.component.html',
  styleUrl: './subcategorias.component.scss'
})
export class SubcategoriasComponent implements OnInit {
  subcategorias: any[] = [];
  categorias: any[] = [];

  nueva: {
// ... (resto del código sin cambios)
    id: number | null;
    nombre: string;
    categoria_id: number;
  } = {
    id: null,
    nombre: '',
    categoria_id: 0
  };

  // --- PASO 2: Define la URL de la API ---
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private subcategoriaService: SubcategoriaService
  ) {}

  ngOnInit(): void {
    this.listar();
    
    // --- PASO 3: Corrige la llamada hardcodeada ---
    this.http.get(`${this.apiUrl}/categorias`).subscribe((res: any) => {
      this.categorias = res;
    });
  }

  listar() {
    // Esta llamada ya está corregida porque usa el servicio que arreglamos
    this.subcategoriaService.listar().subscribe((res) => {
      this.subcategorias = res;
    });
  }

  guardar() {
// ... (resto del código sin cambios)
    const dto = {
      nombre: this.nueva.nombre,
      categoria_id: +this.nueva.categoria_id
    };
  
    if (this.nueva.id === null) {
      // Crear
      this.subcategoriaService.crear(dto).subscribe(() => {
        this.reset();
        this.listar();
        Swal.fire({
// ... (resto del código sin cambios)
          icon: 'success',
          title: 'Subcategoría creada',
          text: 'La subcategoría fue registrada correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      });
    } else {
      // Actualizar
      this.subcategoriaService.actualizar(this.nueva.id, dto).subscribe(() => {
        this.reset();
        this.listar();
        Swal.fire({
// ... (resto del código sin cambios)
          icon: 'success',
          title: 'Subcategoría actualizada',
          text: 'Los cambios se guardaron correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
      });
    }
  }

  editar(sub: any) {
    this.nueva = {
// ... (resto del código sin cambios)
      id: sub.id,
      nombre: sub.nombre,
      categoria_id: sub.categoria?.id ?? 0
    };
  }

  eliminar(id: number) {
    Swal.fire({
// ... (resto del código sin cambios)
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la subcategoría permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subcategoriaService.eliminar(id).subscribe(() => {
          this.listar();
          Swal.fire('Eliminado', 'La subcategoría ha sido eliminada.', 'success');
        });
      }
    });
  }

  reset() {
    this.nueva = {
// ... (resto del código sin cambios)
      id: null,
      nombre: '',
      categoria_id: 0
    };
  }
}